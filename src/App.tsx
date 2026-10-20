/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import {
  AutoPart,
  CartItem,
  SelectedVehicle,
  SystemCategoryId,
} from './types/garage';
import {
  DEFAULT_VEHICLE,
  GARAGE_SYSTEMS,
  VEHICLE_BRANDS,
  buildSelectedVehicle,
} from './data/vehicles';
import { AUTO_PARTS, evaluatePartCompatibility } from './data/parts';
import {
  STORAGE_KEYS,
  readStorage,
  restoreCart,
  restoreFavorites,
  restoreSavedVehicles,
  restoreVehicle,
  vehicleKey,
  writeStorage,
} from './lib/storage';
import { PartIllustration } from './components/PartIllustration';
import { PartCard } from './components/PartCard';
import { CompatibilityHint } from './components/CompatibilityHint';
import { ProductDetailView } from './components/ProductDetailView';
import { CartCheckoutView } from './components/CartCheckoutView';
import { MyGarageView } from './components/MyGarageView';
import { ContactsView } from './components/ContactsView';
import {
  Search,
  ShoppingCart,
  Car,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  SlidersHorizontal,
  ChevronRight,
  Home,
  LayoutGrid,
  X,
  Menu,
  Info,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

// Lazy load the 3D WebGL Garage Scene as requested
const GarageScene3D = React.lazy(() => import('./components/GarageScene3D'));

type ScreenMode =
  | 'home'
  | 'garage'
  | 'catalog'
  | 'product'
  | 'cart'
  | 'favorites'
  | 'my_garage'
  | 'contacts';

// Экраны отражаются в адресной строке (#/catalog, #/product/<id>), чтобы
// работали кнопки «Назад/Вперёд», перезагрузка страницы и ссылки на товар.
const SCREEN_PATHS: Record<Exclude<ScreenMode, 'product'>, string> = {
  home: '',
  garage: 'garage',
  catalog: 'catalog',
  cart: 'cart',
  favorites: 'favorites',
  my_garage: 'my-garage',
  contacts: 'contacts',
};

interface Route {
  screen: ScreenMode;
  partId: string | null;
}

function parseHash(hash: string): Route {
  const path = hash.replace(/^#\/?/, '');
  if (path.startsWith('product/')) {
    const partId = decodeURIComponent(path.slice('product/'.length));
    if (AUTO_PARTS.some((p) => p.id === partId)) return { screen: 'product', partId };
    return { screen: 'catalog', partId: null };
  }
  const entry = Object.entries(SCREEN_PATHS).find(([, p]) => p === path);
  return { screen: entry ? (entry[0] as ScreenMode) : 'home', partId: null };
}

function routeToHash(screen: ScreenMode, partId: string | null): string {
  if (screen === 'product') return partId ? `#/product/${encodeURIComponent(partId)}` : '';
  const path = SCREEN_PATHS[screen];
  return path ? `#/${path}` : '';
}

const MAX_PRICE_LIMIT = 80000;

const NAV_LINKS: { screen: ScreenMode; label: string }[] = [
  { screen: 'catalog', label: 'Каталог' },
  { screen: 'garage', label: '3D-Гараж' },
  { screen: 'my_garage', label: 'Мой гараж' },
  { screen: 'favorites', label: 'Избранное' },
  { screen: 'contacts', label: 'Контакты' },
];

type ToastTone = 'success' | 'warning';

export default function App() {
  // Navigation & Active Screen State
  const [initialRoute] = useState<Route>(() => parseHash(window.location.hash));
  const [screen, setScreen] = useState<ScreenMode>(initialRoute.screen);
  const [previousScreen, setPreviousScreen] = useState<ScreenMode>('catalog');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Persisted Active Vehicle in Garage
  const [selectedVehicle, setSelectedVehicle] = useState<SelectedVehicle | null>(
    () => restoreVehicle(readStorage(STORAGE_KEYS.ACTIVE_VEHICLE)) ?? DEFAULT_VEHICLE
  );

  // Форма подбора стартует с активного автомобиля, а не с автомобиля по умолчанию
  const [brandId, setBrandId] = useState<string>(() => selectedVehicle?.brandId ?? '');
  const [modelId, setModelId] = useState<string>(() => selectedVehicle?.modelId ?? '');
  const [generationId, setGenerationId] = useState<string>(
    () => selectedVehicle?.generationId ?? ''
  );
  const [modificationId, setModificationId] = useState<string>(
    () => selectedVehicle?.modificationId ?? ''
  );

  // Saved Vehicles ("Мой гараж")
  const [savedVehicles, setSavedVehicles] = useState<SelectedVehicle[]>(
    () => restoreSavedVehicles(readStorage(STORAGE_KEYS.SAVED_GARAGE)) ?? [DEFAULT_VEHICLE]
  );

  // Shopping Cart ("Корзина")
  const [cart, setCart] = useState<CartItem[]>(() =>
    restoreCart(readStorage(STORAGE_KEYS.CART), AUTO_PARTS)
  );

  // Favorites ("Избранное")
  const [favorites, setFavorites] = useState<string[]>(() =>
    restoreFavorites(readStorage(STORAGE_KEYS.FAVORITES), AUTO_PARTS)
  );

  // Interactive Garage & Catalog Navigation State (Preserved across product returns)
  const [selectedSystemId, setSelectedSystemId] = useState<SystemCategoryId | null>(null);
  const [hoveredSystemId, setHoveredSystemId] = useState<SystemCategoryId | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);
  const [activePartId, setActivePartId] = useState<string | null>(initialRoute.partId);
  const [garageDrawerOpen, setGarageDrawerOpen] = useState<boolean>(false);

  // Search & VIN State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [vinInput, setVinInput] = useState<string>('');
  const [vinNoticeVisible, setVinNoticeVisible] = useState<boolean>(false);

  // Catalog Filters & Sorting
  const [filterBrand, setFilterBrand] = useState<string>('all');
  const [filterOrigin, setFilterOrigin] = useState<'all' | 'original' | 'analog'>('all');
  const [filterInStockOnly, setFilterInStockOnly] = useState<boolean>(false);
  const [filterCompatibleOnly, setFilterCompatibleOnly] = useState<boolean>(false);
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(MAX_PRICE_LIMIT);
  const [sortBy, setSortBy] = useState<'popularity' | 'price_asc' | 'price_desc'>('popularity');

  // Accessibility: Reduced Motion Toggle (по умолчанию — из настроек системы)
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
      return false;
    }
  });
  const [toast, setToast] = useState<{ text: string; tone: ToastTone } | null>(null);

  // Sync to localStorage
  useEffect(() => writeStorage(STORAGE_KEYS.CART, cart), [cart]);
  useEffect(() => writeStorage(STORAGE_KEYS.SAVED_GARAGE, savedVehicles), [savedVehicles]);
  useEffect(() => writeStorage(STORAGE_KEYS.FAVORITES, favorites), [favorites]);
  useEffect(() => {
    if (selectedVehicle) writeStorage(STORAGE_KEYS.ACTIVE_VEHICLE, selectedVehicle);
  }, [selectedVehicle]);

  // Sync screen -> URL hash (new history entry on every navigation)
  useEffect(() => {
    const target = routeToHash(screen, activePartId);
    if (window.location.hash !== target) {
      window.history.pushState(
        null,
        '',
        target || window.location.pathname + window.location.search
      );
    }
  }, [screen, activePartId]);

  // URL hash -> screen (browser Back/Forward, manual hash edits)
  useEffect(() => {
    const onPopState = () => {
      const route = parseHash(window.location.hash);
      setScreen(route.screen);
      if (route.partId) setActivePartId(route.partId);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // New screen starts from the top; the mobile menu closes after navigation
  useEffect(() => {
    window.scrollTo({ top: 0 });
    setMobileMenuOpen(false);
  }, [screen]);

  // Keyboard Escape handler to close drawers
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setGarageDrawerOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const showToast = (text: string, tone: ToastTone = 'success') => {
    const next = { text, tone };
    setToast(next);
    setTimeout(() => {
      setToast((prev) => (prev === next ? null : prev));
    }, 2600);
  };

  // Cascading Vehicle Selector Helpers
  const availableModels = useMemo(() => {
    const b = VEHICLE_BRANDS.find((x) => x.id === brandId);
    return b ? b.models : [];
  }, [brandId]);

  const availableGenerations = useMemo(() => {
    const m = availableModels.find((x) => x.id === modelId);
    return m ? m.generations : [];
  }, [availableModels, modelId]);

  const availableModifications = useMemo(() => {
    const g = availableGenerations.find((x) => x.id === generationId);
    return g ? g.modifications : [];
  }, [availableGenerations, generationId]);

  // Reset incompatible child values when parent changes
  const handleBrandChange = (newBrandId: string) => {
    setBrandId(newBrandId);
    setModelId('');
    setGenerationId('');
    setModificationId('');
  };

  const handleModelChange = (newModelId: string) => {
    setModelId(newModelId);
    setGenerationId('');
    setModificationId('');
  };

  const handleGenerationChange = (newGenId: string) => {
    setGenerationId(newGenId);
    setModificationId('');
  };

  // Build SelectedVehicle from current form selections
  const buildCurrentVehicleSelection = (): SelectedVehicle | null =>
    buildSelectedVehicle(brandId, modelId, generationId, modificationId);

  // Делает автомобиль активным и подставляет его в форму подбора
  const activateVehicle = (v: SelectedVehicle) => {
    setSelectedVehicle(v);
    setBrandId(v.brandId);
    setModelId(v.modelId);
    setGenerationId(v.generationId);
    setModificationId(v.modificationId);
  };

  const handleOpenGarageFromForm = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const built = buildCurrentVehicleSelection();
    if (!built) {
      showToast('Выберите хотя бы марку и модель автомобиля', 'warning');
      return;
    }
    setSelectedVehicle(built);
    setScreen('garage');
  };

  const handleSaveCurrentVehicleToGarage = () => {
    if (!selectedVehicle) return;
    const exists = savedVehicles.some((v) => vehicleKey(v) === vehicleKey(selectedVehicle));
    if (exists) {
      showToast('Этот автомобиль уже сохранён в «Мой гараж»', 'warning');
      return;
    }
    setSavedVehicles((prev) => [selectedVehicle, ...prev]);
    showToast(`Сохранён в гараж: ${selectedVehicle.brandName} ${selectedVehicle.modelName}`);
  };

  const handleRemoveSavedVehicle = (v: SelectedVehicle) => {
    setSavedVehicles((prev) => prev.filter((x) => vehicleKey(x) !== vehicleKey(v)));
    showToast(`Удалён из гаража: ${v.brandName} ${v.modelName}`);
  };

  const handleSelectSystemInGarage = (sysId: SystemCategoryId) => {
    setSelectedSystemId(sysId);
    setSelectedSubcategoryId(null);
    setGarageDrawerOpen(true);
  };

  // Cart Handlers
  const totalCartCount = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity, 0),
    [cart]
  );

  const handleAddToCart = (part: AutoPart, quantity = 1) => {
    // Количество в корзине никогда не превышает остаток на складе
    const inCart = cart.find((i) => i.partId === part.id)?.quantity ?? 0;
    const allowed = Math.min(quantity, part.stockCount - inCart);
    if (allowed <= 0) {
      showToast(
        `В корзине уже весь остаток: ${part.brand} ${part.sku} (${part.stockCount} шт.)`,
        'warning'
      );
      return;
    }

    const vehicleContext = selectedVehicle
      ? `${selectedVehicle.brandName} ${selectedVehicle.modelName}${
          selectedVehicle.generationName ? ` (${selectedVehicle.generationName})` : ''
        }`
      : undefined;

    setCart((prev) => {
      if (prev.some((i) => i.partId === part.id)) {
        return prev.map((i) =>
          i.partId === part.id
            ? { ...i, quantity: Math.min(part.stockCount, i.quantity + allowed) }
            : i
        );
      }
      return [...prev, { partId: part.id, quantity: allowed, vehicleContext }];
    });

    if (allowed < quantity) {
      showToast(
        `Добавлено ${allowed} шт. — больше нет на складе: ${part.brand} ${part.sku}`,
        'warning'
      );
    } else {
      showToast(`В корзине: ${part.brand} ${part.sku}`);
    }
  };

  const handleUpdateCartQuantity = (partId: string, newQty: number) => {
    if (newQty <= 0) {
      setCart((prev) => prev.filter((i) => i.partId !== partId));
      return;
    }
    const stock = AUTO_PARTS.find((p) => p.id === partId)?.stockCount ?? newQty;
    setCart((prev) =>
      prev.map((i) => (i.partId === partId ? { ...i, quantity: Math.min(stock, newQty) } : i))
    );
  };

  const handleRemoveCartItem = (partId: string) => {
    setCart((prev) => prev.filter((i) => i.partId !== partId));
  };

  const handleToggleFavorite = (partId: string) => {
    setFavorites((prev) =>
      prev.includes(partId) ? prev.filter((id) => id !== partId) : [...prev, partId]
    );
  };

  const handleOpenProductDetail = (partId: string) => {
    setPreviousScreen(screen === 'product' ? previousScreen : screen);
    setActivePartId(partId);
    setScreen('product');
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  const resetCatalogFilters = () => {
    setSearchQuery('');
    setFilterBrand('all');
    setFilterOrigin('all');
    setFilterInStockOnly(false);
    setFilterCompatibleOnly(false);
    setMaxPriceFilter(MAX_PRICE_LIMIT);
  };

  // Unique part brands for filter dropdown
  const allPartBrands = useMemo(() => {
    const set = new Set<string>();
    AUTO_PARTS.forEach((p) => set.add(p.brand));
    return Array.from(set);
  }, []);

  // Filtered and Sorted Parts for Catalog
  const filteredParts = useMemo(() => {
    return AUTO_PARTS.filter((part) => {
      if (selectedSystemId && part.systemId !== selectedSystemId) return false;
      if (selectedSubcategoryId && part.subcategoryId !== selectedSubcategoryId) return false;

      if (searchQuery.trim() !== '') {
        const q = searchQuery.trim().toLowerCase();
        const matchesName = part.name.toLowerCase().includes(q);
        const matchesSku = part.sku.toLowerCase().includes(q);
        const matchesBrand = part.brand.toLowerCase().includes(q);
        const matchesOem = part.oemNumbers.some((oem) => oem.toLowerCase().includes(q));
        if (!matchesName && !matchesSku && !matchesBrand && !matchesOem) return false;
      }

      if (filterBrand !== 'all' && part.brand !== filterBrand) return false;
      if (filterOrigin === 'original' && !part.isOriginal) return false;
      if (filterOrigin === 'analog' && part.isOriginal) return false;
      if (filterInStockOnly && part.deliveryDays > 0) return false;
      if (part.price > maxPriceFilter) return false;

      if (filterCompatibleOnly && selectedVehicle) {
        const comp = evaluatePartCompatibility(part, selectedVehicle);
        if (comp.status === 'incompatible') return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      return b.popularity - a.popularity;
    });
  }, [
    selectedSystemId,
    selectedSubcategoryId,
    searchQuery,
    filterBrand,
    filterOrigin,
    filterInStockOnly,
    filterCompatibleOnly,
    maxPriceFilter,
    sortBy,
    selectedVehicle,
  ]);

  // Панель 3D-гаража показывает детали узла без учёта фильтров каталога,
  // чтобы поиск или ценовой фильтр не скрывали детали незаметно для покупателя.
  const garageDrawerParts = useMemo(
    () =>
      AUTO_PARTS.filter(
        (part) =>
          (!selectedSystemId || part.systemId === selectedSystemId) &&
          (!selectedSubcategoryId || part.subcategoryId === selectedSubcategoryId)
      ).sort((a, b) => b.popularity - a.popularity),
    [selectedSystemId, selectedSubcategoryId]
  );

  const activeSystemObj = useMemo(
    () => GARAGE_SYSTEMS.find((s) => s.id === selectedSystemId) || null,
    [selectedSystemId]
  );

  const activeSubcategoryObj = useMemo(
    () =>
      activeSystemObj?.subcategories.find((sub) => sub.id === selectedSubcategoryId) || null,
    [activeSystemObj, selectedSubcategoryId]
  );

  const activePartObj = useMemo(
    () => AUTO_PARTS.find((p) => p.id === activePartId) || null,
    [activePartId]
  );

  const renderPartCard = (part: AutoPart) => (
    <PartCard
      key={part.id}
      part={part}
      selectedVehicle={selectedVehicle}
      isFavorite={favorites.includes(part.id)}
      onOpen={handleOpenProductDetail}
      onToggleFavorite={handleToggleFavorite}
      onAddToCart={handleAddToCart}
    />
  );

  return (
    <div className={`min-h-screen flex flex-col bg-[#0B0D11] text-[#F8FAFC] ${reducedMotion ? 'reduce-motion' : ''}`}>
      {/* =====================================================================
          HEADER (Strict 3-Zone Top Bar Contract: Brand — 5 Nav Links — 1 CTA)
      ====================================================================== */}
      <header className="sticky top-0 z-40 h-16 flex items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 bg-[#0B0D11]/95 border-b border-white/10">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => setScreen('home')}
          className="font-display text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 focus:outline-none"
        >
          APEX GARAGE
        </button>

        {/* Zone 2: 5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          {NAV_LINKS.map((link) => (
            <button
              key={link.screen}
              type="button"
              onClick={() => setScreen(link.screen)}
              aria-current={screen === link.screen ? 'page' : undefined}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                screen === link.screen ? 'border-[#F97316] text-white' : 'border-transparent'
              }`}
            >
              {link.label}
              {link.screen === 'my_garage' && ` (${savedVehicles.length})`}
              {link.screen === 'favorites' && ` (${favorites.length})`}
            </button>
          ))}
        </nav>

        {/* Zone 3: 1 Primary Action Button (Cart with item count) + mobile menu toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setScreen('cart')}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#F97316] hover:bg-[#EA580C] rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span className="font-mono tabular-nums">Корзина ({totalCartCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-label={mobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            className="md:hidden w-9 h-9 rounded-lg bg-[#1A202C] text-slate-200 hover:text-white flex items-center justify-center"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Mobile dropdown menu: все разделы, включая отсутствующие в нижней панели */}
        {mobileMenuOpen && (
          <nav
            id="mobile-menu"
            aria-label="Меню разделов"
            className="md:hidden absolute top-16 inset-x-0 bg-[#0B0D11] border-b border-white/10 shadow-2xl py-2"
          >
            {NAV_LINKS.map((link) => (
              <button
                key={link.screen}
                type="button"
                onClick={() => setScreen(link.screen)}
                aria-current={screen === link.screen ? 'page' : undefined}
                className={`w-full px-5 py-3 text-left text-sm font-medium transition-colors ${
                  screen === link.screen
                    ? 'text-[#F97316] bg-white/5'
                    : 'text-slate-200 hover:bg-white/5'
                }`}
              >
                {link.label}
                {link.screen === 'my_garage' && ` (${savedVehicles.length})`}
                {link.screen === 'favorites' && ` (${favorites.length})`}
              </button>
            ))}
          </nav>
        )}
      </header>

      {/* Toast Feedback Notification */}
      <div role="status" aria-live="polite" className="fixed top-20 right-4 left-4 sm:left-auto z-50 pointer-events-none">
        {toast && (
          <div
            className={`px-4 py-3 rounded-xl bg-[#161B26] border text-xs font-medium text-white shadow-2xl flex items-center gap-2 ${
              toast.tone === 'warning' ? 'border-amber-500' : 'border-[#F97316]'
            }`}
          >
            {toast.tone === 'warning' ? (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-[#F97316] shrink-0" />
            )}
            <span>{toast.text}</span>
          </div>
        )}
      </div>

      {/* =====================================================================
          SCREEN 1: HOME PAGE (Vehicle Selector + OEM/SKU Search + VIN Input)
      ====================================================================== */}
      {screen === 'home' && (
        <main className="flex-1 pb-24">
          {/* Hero Section */}
          <section className="relative overflow-hidden border-b border-white/10 py-10 sm:py-16">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle at 75% 30%, rgba(249, 115, 22, 0.14), transparent 50%), radial-gradient(circle at 20% 80%, rgba(14, 165, 233, 0.1), transparent 55%)',
              }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
                {/* Left 7 Cols: Greeting + Dependent Vehicle Configurator */}
                <div className="lg:col-span-7 flex flex-col justify-between bg-[#12161F] border border-white/10 rounded-2xl p-6 sm:p-8">
                  <div className="space-y-3">
                    <div className="text-xs font-medium text-[#38BDF8] tracking-wide">
                      ИНТЕРАКТИВНЫЙ ПОДБОР АВТОЗАПЧАСТЕЙ
                    </div>
                    <h1
                      className="font-display font-bold text-white tracking-tight leading-tight"
                      style={{
                        fontSize: 'clamp(1.85rem, 3.5vw, 3rem)',
                        textWrap: 'balance',
                      }}
                    >
                      Добро пожаловать в ваш гараж. Найдите всё для своего автомобиля
                    </h1>
                    <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                      Выберите точную модификацию автомобиля, откройте интерактивный 3D-гараж, нажмите на нужный узел на кузове или шасси и подберите детали с проверкой совместимости.
                    </p>
                  </div>

                  {/* Cascading Vehicle Selection Form */}
                  <form onSubmit={handleOpenGarageFromForm} className="mt-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* 1. Марка */}
                      <div>
                        <label
                          htmlFor="select-brand"
                          className="block text-xs font-medium text-slate-300 mb-1.5"
                        >
                          1. Марка — производитель
                        </label>
                        <select
                          id="select-brand"
                          value={brandId}
                          onChange={(e) => handleBrandChange(e.target.value)}
                          className="w-full h-11 px-3.5 rounded-xl bg-[#0B0D11] border border-white/15 text-sm text-white focus:outline-none focus:border-[#F97316]"
                        >
                          <option value="">Выберите марку...</option>
                          {VEHICLE_BRANDS.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.name} ({b.country})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* 2. Модель */}
                      <div>
                        <label
                          htmlFor="select-model"
                          className="block text-xs font-medium text-slate-300 mb-1.5"
                        >
                          2. Модель автомобиля
                        </label>
                        <select
                          id="select-model"
                          value={modelId}
                          disabled={!brandId}
                          onChange={(e) => handleModelChange(e.target.value)}
                          className="w-full h-11 px-3.5 rounded-xl bg-[#0B0D11] border border-white/15 text-sm text-white disabled:opacity-40 focus:outline-none focus:border-[#F97316]"
                        >
                          <option value="">
                            {brandId ? 'Выберите модель...' : 'Сначала выберите марку'}
                          </option>
                          {availableModels.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* 3. Поколение и годы выпуска */}
                      <div>
                        <label
                          htmlFor="select-generation"
                          className="block text-xs font-medium text-slate-300 mb-1.5"
                        >
                          3. Поколение и годы выпуска
                        </label>
                        <select
                          id="select-generation"
                          value={generationId}
                          disabled={!modelId}
                          onChange={(e) => handleGenerationChange(e.target.value)}
                          className="w-full h-11 px-3.5 rounded-xl bg-[#0B0D11] border border-white/15 text-sm text-white disabled:opacity-40 focus:outline-none focus:border-[#F97316]"
                        >
                          <option value="">
                            {modelId ? 'Выберите поколение...' : 'Сначала выберите модель'}
                          </option>
                          {availableGenerations.map((g) => (
                            <option key={g.id} value={g.id}>
                              {g.name} · {g.years}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* 4. Двигатель, КПП и комплектация */}
                      <div>
                        <label
                          htmlFor="select-modification"
                          className="block text-xs font-medium text-slate-300 mb-1.5"
                        >
                          4. Двигатель, КПП и комплектация
                        </label>
                        <select
                          id="select-modification"
                          value={modificationId}
                          disabled={!generationId}
                          onChange={(e) => setModificationId(e.target.value)}
                          className="w-full h-11 px-3.5 rounded-xl bg-[#0B0D11] border border-white/15 text-sm text-white disabled:opacity-40 focus:outline-none focus:border-[#F97316]"
                        >
                          <option value="">
                            {generationId
                              ? 'Выберите двигатель и КПП...'
                              : 'Сначала выберите поколение'}
                          </option>
                          {availableModifications.map((mod) => (
                            <option key={mod.id} value={mod.id}>
                              {mod.engine} · {mod.transmission} ({mod.trim})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <button
                        type="submit"
                        disabled={!brandId || !modelId}
                        className="h-12 px-7 rounded-xl bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-40 text-white font-semibold text-sm flex items-center gap-2 transition-colors whitespace-nowrap"
                      >
                        <Car className="w-4 h-4" />
                        <span>Открыть гараж</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const built = buildCurrentVehicleSelection();
                          if (built && built.modelId) setSelectedVehicle(built);
                          setScreen('catalog');
                        }}
                        className="h-12 px-5 rounded-xl bg-[#1A202C] hover:bg-[#232B3A] text-slate-200 font-semibold text-xs transition-colors whitespace-nowrap"
                      >
                        Перейти сразу в текстовый каталог
                      </button>
                    </div>
                  </form>
                </div>

                {/* Right 5 Cols: Part Search (Name, SKU, OEM) & Honest VIN Lookup Box */}
                <div className="lg:col-span-5 flex flex-col justify-between gap-6">
                  {/* Search by Part Name, SKU, or OEM */}
                  <div className="bg-[#12161F] border border-white/10 rounded-2xl p-6 space-y-4">
                    <h2 className="text-base font-semibold text-white">
                      Быстрый поиск по названию, артикулу или OEM
                    </h2>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        setSelectedSystemId(null);
                        setSelectedSubcategoryId(null);
                        setScreen('catalog');
                      }}
                      className="flex gap-2"
                    >
                      <div className="relative flex-1">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Амортизатор, 22-291448 или 31316873795..."
                          className="w-full h-11 pl-10 pr-3.5 rounded-xl bg-[#0B0D11] border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#38BDF8]"
                        />
                      </div>
                      <button
                        type="submit"
                        className="h-11 px-4 rounded-xl bg-[#38BDF8] hover:bg-[#0284C7] text-[#0B0D11] font-semibold text-xs transition-colors whitespace-nowrap shrink-0"
                      >
                        Найти
                      </button>
                    </form>

                    {/* Quick OEM & Category shortcuts */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                      <span>Примеры:</span>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('31316873795');
                          setSelectedSystemId(null);
                          setScreen('catalog');
                        }}
                        className="font-mono text-slate-300 hover:text-[#F97316] underline"
                      >
                        OEM 31316873795
                      </button>
                      <span aria-hidden="true">·</span>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('Амортизатор');
                          setSelectedSystemId(null);
                          setScreen('catalog');
                        }}
                        className="text-slate-300 hover:text-[#F97316] underline"
                      >
                        Амортизаторы
                      </button>
                      <span aria-hidden="true">·</span>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('Brembo');
                          setSelectedSystemId(null);
                          setScreen('catalog');
                        }}
                        className="text-slate-300 hover:text-[#F97316] underline"
                      >
                        Диски Brembo
                      </button>
                    </div>
                  </div>

                  {/* Honest VIN Input Module (Without Fake VIN Decoding) */}
                  <div className="bg-[#12161F] border border-white/10 rounded-2xl p-6 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h2 className="text-base font-semibold text-white">
                          Подбор по VIN-коду кузова
                        </h2>
                        <span className="text-[11px] font-mono text-slate-400">
                          17 символов ISO 3779
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Поле подготовлено для подключения внешнего шлюза оригинальных каталогов (TecDoc / Laximo).
                      </p>
                    </div>

                    <div className="space-y-2.5 pt-1">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          maxLength={17}
                          value={vinInput}
                          onChange={(e) => {
                            setVinInput(e.target.value.toUpperCase());
                            setVinNoticeVisible(false);
                          }}
                          placeholder="Например: WBA5R1C00LFH12345"
                          className="flex-1 h-11 px-3.5 rounded-xl bg-[#0B0D11] border border-white/15 text-sm font-mono uppercase text-white placeholder:text-slate-600 focus:outline-none focus:border-[#F97316]"
                        />
                        <button
                          type="button"
                          onClick={() => setVinNoticeVisible(true)}
                          className="h-11 px-4 rounded-xl bg-[#1A202C] hover:bg-[#232B3A] border border-white/10 text-xs font-semibold text-slate-200 transition-colors whitespace-nowrap shrink-0"
                        >
                          Проверить VIN
                        </button>
                      </div>

                      {vinNoticeVisible && (
                        <div className="p-3 rounded-xl bg-[#0B0D11] border border-amber-500/30 text-xs text-slate-300 flex items-start gap-2">
                          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <span>
                            Внешний сервис расшифровки VIN в демонстрационном режиме не подключён. Пожалуйста, выберите марку, модель, поколение и двигатель в конфигураторе слева — это гарантирует честную проверку совместимости без имитации данных.
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: All 12 Vehicle Systems Grid (Direct Catalog Access) */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Узлы и системы автомобиля
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Выберите узел в списке или исследуйте его на интерактивной 3D-сцене в гараже
                </p>
              </div>
              <button
                type="button"
                onClick={() => setScreen('garage')}
                className="text-xs font-semibold text-[#F97316] hover:text-[#FB923C] flex items-center gap-1 transition-colors"
              >
                <span>Перейти в полноэкранный 3D-гараж</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {GARAGE_SYSTEMS.map((sys, idx) => (
                <div
                  key={sys.id}
                  className="bg-[#12161F] border border-white/10 hover:border-white/25 rounded-2xl p-5 flex flex-col justify-between transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-400 mb-2">
                      <span className="font-mono text-[#38BDF8]">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span>{sys.subcategories.length} подкатегории</span>
                    </div>
                    <h3 className="text-base font-semibold text-white">{sys.name}</h3>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      {sys.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/10 flex flex-wrap gap-1.5">
                    {sys.subcategories.map((sub) => (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => {
                          setSelectedSystemId(sys.id);
                          setSelectedSubcategoryId(sub.id);
                          setScreen('catalog');
                        }}
                        className="text-xs text-slate-300 hover:text-[#F97316] transition-colors text-left"
                      >
                        {sub.name} ·
                      </button>
                    ))}
                  </div>

                  <div className="pt-3 mt-2 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSystemId(sys.id);
                        setSelectedSubcategoryId(null);
                        setScreen('catalog');
                      }}
                      className="text-xs font-semibold text-white hover:text-[#38BDF8] transition-colors"
                    >
                      Открыть товары →
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSystemId(sys.id);
                        setSelectedSubcategoryId(null);
                        setGarageDrawerOpen(true);
                        setScreen('garage');
                      }}
                      className="text-xs text-slate-400 hover:text-white transition-colors"
                    >
                      Показать в 3D
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Popular Parts for Active Vehicle */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Востребованные запчасти для ТО и ремонта
                </h2>
                {selectedVehicle && (
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Проверка совместимости настроена для: {selectedVehicle.brandName}{' '}
                    {selectedVehicle.modelName} ({selectedVehicle.generationName}),{' '}
                    {selectedVehicle.engine}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedSystemId(null);
                  setSelectedSubcategoryId(null);
                  setScreen('catalog');
                }}
                className="text-xs font-semibold text-[#38BDF8] hover:underline"
              >
                Смотреть весь каталог ({AUTO_PARTS.length})
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {AUTO_PARTS.slice(0, 6).map((part) => renderPartCard(part))}
            </div>
          </section>
        </main>
      )}

      {/* =====================================================================
          SCREEN 2: FULLSCREEN INTERACTIVE 3D GARAGE
      ====================================================================== */}
      {screen === 'garage' && (
        <main className="relative flex-none flex flex-col lg:flex-row h-[calc(100dvh-7.5rem)] md:h-[calc(100dvh-4rem)] overflow-hidden bg-[#090B10]">
          {/* Left / Top Standard Duplicated Systems Menu (Accessible without 3D interaction) */}
          <aside className="w-full lg:w-72 bg-[#11151E] border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col z-20 shrink-0 max-h-[34vh] lg:max-h-none">
            {/* Active Vehicle Info Header inside Garage */}
            <div className="p-4 border-b border-white/10 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#38BDF8]">
                  Активный автомобиль
                </span>
                <button
                  type="button"
                  onClick={() => setReducedMotion((r) => !r)}
                  className="text-[11px] text-slate-400 hover:text-white transition-colors"
                >
                  {reducedMotion ? 'Анимация: выкл' : 'Анимация: вкл'}
                </button>
              </div>

              {selectedVehicle ? (
                <div>
                  <div className="text-base font-bold text-white leading-tight">
                    {selectedVehicle.brandName} {selectedVehicle.modelName}{' '}
                    <span className="text-slate-300 font-normal">
                      {selectedVehicle.generationName}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {selectedVehicle.years} · {selectedVehicle.engine}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-amber-300">Автомобиль не выбран</div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setScreen('home')}
                  className="flex-1 py-1.5 px-2.5 rounded-lg bg-[#1A202C] hover:bg-[#232B3A] text-xs font-medium text-slate-200 flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Сменить автомобиль</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveCurrentVehicleToGarage}
                  className="py-1.5 px-2.5 rounded-lg bg-[#F97316]/15 hover:bg-[#F97316]/25 border border-[#F97316]/40 text-xs font-medium text-[#F97316] flex items-center justify-center gap-1 transition-colors whitespace-nowrap"
                  title="Сохранить в мой гараж"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>В гараж</span>
                </button>
              </div>
            </div>

            {/* Duplicated Standard Systems Menu (12 systems) */}
            <div className="px-4 py-2 text-[11px] font-medium text-slate-400 border-b border-white/5">
              Все системы автомобиля (меню без 3D):
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-white/5">
              {GARAGE_SYSTEMS.map((sys) => {
                const isSelected = selectedSystemId === sys.id;
                const isHovered = hoveredSystemId === sys.id;
                return (
                  <button
                    key={sys.id}
                    type="button"
                    onClick={() => handleSelectSystemInGarage(sys.id)}
                    onMouseEnter={() => setHoveredSystemId(sys.id)}
                    onMouseLeave={() => setHoveredSystemId(null)}
                    className={`w-full px-4 py-3 text-left flex items-center justify-between gap-2 transition-colors ${
                      isSelected
                        ? 'bg-[#F97316]/15 text-white'
                        : isHovered
                        ? 'bg-white/5 text-white'
                        : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-semibold truncate">{sys.name}</div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">
                        {sys.subcategories.map((s) => s.name).join(' · ')}
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 shrink-0 ${
                        isSelected ? 'text-[#F97316]' : 'text-slate-500'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Center 3D Viewport (or 2D Fallback) */}
          <div className="relative flex-1 min-h-0 overflow-hidden">
            {/* Active System Hover Banner at Top Center */}
            {(hoveredSystemId || selectedSystemId) && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none px-4 py-2 rounded-xl bg-[#12161F] border border-[#F97316]/60 shadow-xl text-center">
                <div className="text-xs font-semibold text-white">
                  {
                    GARAGE_SYSTEMS.find(
                      (s) => s.id === (hoveredSystemId || selectedSystemId)
                    )?.name
                  }
                </div>
                <div className="text-[11px] text-slate-400">
                  Нажмите на узел, чтобы выбрать подкатегорию и запчасти
                </div>
              </div>
            )}

            <Suspense
              fallback={
                <div className="w-full h-full flex flex-col items-center justify-center bg-[#090B10] text-slate-300 gap-3">
                  <Sparkles className="w-7 h-7 text-[#F97316]" />
                  <div className="text-sm font-medium">
                    Загрузка 3D-сцены виртуального гаража...
                  </div>
                </div>
              }
            >
              <GarageScene3D
                vehicle={selectedVehicle || DEFAULT_VEHICLE}
                selectedSystemId={selectedSystemId}
                hoveredSystemId={hoveredSystemId}
                onSelectSystem={handleSelectSystemInGarage}
                onHoverSystem={setHoveredSystemId}
                reducedMotion={reducedMotion}
              />
            </Suspense>

            {/* Slide-Over System & Subcategory Catalog Drawer inside Garage */}
            {garageDrawerOpen && activeSystemObj && (
              <div className="absolute inset-y-0 right-0 z-30 w-full sm:w-[440px] md:w-[500px] bg-[#11151E] border-l border-white/15 shadow-2xl flex flex-col">
                {/* Drawer Header with Breadcrumbs */}
                <div className="p-4 sm:p-5 border-b border-white/10 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400 mb-1">
                      <span>{selectedVehicle?.brandName} {selectedVehicle?.modelName}</span>
                      <span aria-hidden="true">→</span>
                      <span className="text-[#F97316] font-medium">
                        {activeSystemObj.shortName}
                      </span>
                      {activeSubcategoryObj && (
                        <>
                          <span aria-hidden="true">→</span>
                          <span className="text-white">{activeSubcategoryObj.name}</span>
                        </>
                      )}
                    </div>
                    <h2 className="text-lg font-bold text-white">{activeSystemObj.name}</h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => setGarageDrawerOpen(false)}
                    aria-label="Закрыть панель раздела"
                    className="w-8 h-8 rounded-lg bg-[#1A202C] text-slate-300 hover:text-white flex items-center justify-center shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Subcategory Selector Tabs */}
                <div className="p-4 border-b border-white/10 bg-[#0D1017]">
                  <div className="text-xs font-medium text-slate-400 mb-2">
                    Выберите подкатегорию узла:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedSubcategoryId(null)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        selectedSubcategoryId === null
                          ? 'bg-[#F97316] text-white'
                          : 'bg-[#161B26] text-slate-300 hover:text-white'
                      }`}
                    >
                      Все детали узла
                    </button>
                    {activeSystemObj.subcategories.map((sub) => (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => setSelectedSubcategoryId(sub.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          selectedSubcategoryId === sub.id
                            ? 'bg-[#F97316] text-white'
                            : 'bg-[#161B26] text-slate-300 hover:text-white'
                        }`}
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Drawer Parts List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {garageDrawerParts.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400 space-y-3">
                      <p>В этой подкатегории пока нет запчастей.</p>
                      {selectedSubcategoryId && (
                        <button
                          type="button"
                          onClick={() => setSelectedSubcategoryId(null)}
                          className="px-3 py-1.5 rounded-lg bg-[#1A202C] text-white"
                        >
                          Показать все детали раздела
                        </button>
                      )}
                    </div>
                  ) : (
                    garageDrawerParts.map((part) => {
                      const comp = evaluatePartCompatibility(part, selectedVehicle);
                      return (
                        <div
                          key={part.id}
                          className="p-3.5 rounded-xl bg-[#161B26] border border-white/10 hover:border-white/25 transition-colors flex gap-3.5 items-center"
                        >
                          <button
                            type="button"
                            onClick={() => handleOpenProductDetail(part.id)}
                            className="w-20 h-20 rounded-lg overflow-hidden border border-white/10 shrink-0"
                          >
                            <PartIllustration type={part.illustrationType} />
                          </button>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                              <span className="font-semibold text-[#F97316]">{part.brand}</span>
                              <span aria-hidden="true">·</span>
                              <span className="font-mono">{part.sku}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleOpenProductDetail(part.id)}
                              className="text-xs font-semibold text-white hover:text-[#38BDF8] text-left line-clamp-2 mt-0.5"
                            >
                              {part.name}
                            </button>
                            <CompatibilityHint
                              status={comp.status}
                              label={comp.label}
                              className="text-[11px] mt-1"
                            />

                            <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-white/10">
                              <span className="text-sm font-bold text-white font-mono tabular-nums">
                                {part.price.toLocaleString('ru-RU')} ₽
                              </span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenProductDetail(part.id)}
                                  className="px-2.5 py-1 rounded-lg bg-[#0B0D11] text-slate-300 hover:text-white text-[11px] font-medium"
                                >
                                  Подробнее
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAddToCart(part, 1)}
                                  className="px-3 py-1 rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-white text-[11px] font-semibold"
                                >
                                  В корзину
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Drawer Footer Link to Full Catalog */}
                <div className="p-4 border-t border-white/10 bg-[#0D1017] flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setScreen('catalog')}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#1A202C] hover:bg-[#232B3A] text-xs font-semibold text-white text-center transition-colors"
                  >
                    Развернуть каталог с фильтрами ({garageDrawerParts.length})
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      )}

      {/* =====================================================================
          SCREEN 3: FULL CATALOG WITH FILTERS, BREADCRUMBS & SUBCATEGORIES
      ====================================================================== */}
      {screen === 'catalog' && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28">
          {/* Breadcrumbs: Автомобиль → Система → Подкатегория → Товары */}
          <nav
            aria-label="Хлебные крошки"
            className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-white/10 text-xs text-slate-400"
          >
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setScreen('home')}
                className="hover:text-white transition-colors"
              >
                Главная
              </button>
              <span aria-hidden="true">/</span>
              <button
                type="button"
                onClick={() => setScreen('garage')}
                className="hover:text-white transition-colors text-slate-200"
              >
                {selectedVehicle
                  ? `${selectedVehicle.brandName} ${selectedVehicle.modelName} (${selectedVehicle.generationName})`
                  : 'Все автомобили'}
              </button>
              <span aria-hidden="true">/</span>
              <button
                type="button"
                onClick={() => {
                  setSelectedSystemId(null);
                  setSelectedSubcategoryId(null);
                }}
                className={`hover:text-white transition-colors ${
                  !selectedSystemId ? 'text-[#F97316] font-semibold' : ''
                }`}
              >
                Все системы
              </button>
              {activeSystemObj && (
                <>
                  <span aria-hidden="true">/</span>
                  <button
                    type="button"
                    onClick={() => setSelectedSubcategoryId(null)}
                    className={`hover:text-white transition-colors ${
                      !activeSubcategoryObj ? 'text-[#F97316] font-semibold' : 'text-slate-200'
                    }`}
                  >
                    {activeSystemObj.name}
                  </button>
                </>
              )}
              {activeSubcategoryObj && (
                <>
                  <span aria-hidden="true">/</span>
                  <span className="text-[#F97316] font-semibold">
                    {activeSubcategoryObj.name}
                  </span>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setScreen('garage')}
              className="text-xs font-semibold text-[#38BDF8] hover:underline flex items-center gap-1"
            >
              <Car className="w-3.5 h-3.5" />
              <span>Выбрать узел на 3D-машине</span>
            </button>
          </nav>

          {/* System Selector Strip */}
          <div className="mb-6">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedSystemId(null);
                  setSelectedSubcategoryId(null);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                  selectedSystemId === null
                    ? 'bg-[#F97316] text-white'
                    : 'bg-[#12161F] text-slate-300 hover:text-white border border-white/10'
                }`}
              >
                Все разделы
              </button>
              {GARAGE_SYSTEMS.map((sys) => (
                <button
                  key={sys.id}
                  type="button"
                  onClick={() => {
                    setSelectedSystemId(sys.id);
                    setSelectedSubcategoryId(null);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                    selectedSystemId === sys.id
                      ? 'bg-[#F97316] text-white'
                      : 'bg-[#12161F] text-slate-300 hover:text-white border border-white/10'
                  }`}
                >
                  {sys.shortName}
                </button>
              ))}
            </div>

            {/* Subcategories if a system is active */}
            {activeSystemObj && (
              <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-white/10">
                <span className="text-xs text-slate-400 mr-1">Подкатегории:</span>
                <button
                  type="button"
                  onClick={() => setSelectedSubcategoryId(null)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedSubcategoryId === null
                      ? 'bg-[#38BDF8] text-[#0B0D11] font-semibold'
                      : 'bg-[#12161F] text-slate-300 hover:text-white'
                  }`}
                >
                  Все ({activeSystemObj.shortName})
                </button>
                {activeSystemObj.subcategories.map((sub) => (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setSelectedSubcategoryId(sub.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedSubcategoryId === sub.id
                        ? 'bg-[#38BDF8] text-[#0B0D11] font-semibold'
                        : 'bg-[#12161F] text-slate-300 hover:text-white'
                    }`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 3 Cols: Filters Sidebar */}
            <aside className="lg:col-span-3 bg-[#12161F] border border-white/10 rounded-2xl p-5 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <SlidersHorizontal className="w-4 h-4 text-[#F97316]" />
                  <span>Фильтры подбора</span>
                </div>
                <button
                  type="button"
                  onClick={resetCatalogFilters}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Сбросить
                </button>
              </div>

              {/* Search by SKU / OEM / Name */}
              <div>
                <label htmlFor="catalog-search" className="block text-xs text-slate-400 mb-1.5">
                  Название, артикул или OEM
                </label>
                <input
                  id="catalog-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск по коду..."
                  className="w-full h-10 px-3 rounded-xl bg-[#0B0D11] border border-white/15 text-xs text-white focus:outline-none focus:border-[#F97316]"
                />
              </div>

              {/* Applicability Filter */}
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-200">
                <input
                  type="checkbox"
                  checked={filterCompatibleOnly}
                  onChange={(e) => setFilterCompatibleOnly(e.target.checked)}
                  className="mt-0.5 accent-[#F97316]"
                />
                <span>
                  Только совместимые с{' '}
                  <strong className="text-white">
                    {selectedVehicle
                      ? `${selectedVehicle.brandName} ${selectedVehicle.modelName}`
                      : 'выбранным авто'}
                  </strong>
                </span>
              </label>

              {/* In Stock Today Filter */}
              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-200">
                <input
                  type="checkbox"
                  checked={filterInStockOnly}
                  onChange={(e) => setFilterInStockOnly(e.target.checked)}
                  className="accent-[#F97316]"
                />
                <span>Отгрузка сегодня со склада</span>
              </label>

              {/* Original vs Analog */}
              <div>
                <div className="text-xs text-slate-400 mb-1.5">Тип детали</div>
                <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-[#0B0D11] border border-white/10 text-xs">
                  {(
                    [
                      { id: 'all', label: 'Все' },
                      { id: 'original', label: 'Оригинал' },
                      { id: 'analog', label: 'Аналог' },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setFilterOrigin(opt.id)}
                      className={`py-1.5 rounded-lg font-medium transition-colors ${
                        filterOrigin === opt.id
                          ? 'bg-[#1A202C] text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div>
                <label htmlFor="catalog-brand" className="block text-xs text-slate-400 mb-1.5">
                  Производитель детали
                </label>
                <select
                  id="catalog-brand"
                  value={filterBrand}
                  onChange={(e) => setFilterBrand(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#0B0D11] border border-white/15 text-xs text-white focus:outline-none focus:border-[#F97316]"
                >
                  <option value="all">Все бренды ({allPartBrands.length})</option>
                  {allPartBrands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Ceiling Slider */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-400">Макс. цена:</span>
                  <span className="font-mono text-white tabular-nums">
                    до {maxPriceFilter.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
                <input
                  type="range"
                  min={2000}
                  max={MAX_PRICE_LIMIT}
                  step={1000}
                  value={maxPriceFilter}
                  onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                  className="w-full accent-[#F97316]"
                />
              </div>
            </aside>

            {/* Right 9 Cols: Sorting Toolbar & Product Grid */}
            <div className="lg:col-span-9 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 bg-[#12161F] border border-white/10 rounded-2xl px-5 py-3.5">
                <div className="text-xs text-slate-300">
                  Найдено запчастей:{' '}
                  <strong className="font-mono text-white tabular-nums">
                    {filteredParts.length}
                  </strong>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">Сортировка:</span>
                  <select
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(e.target.value as 'popularity' | 'price_asc' | 'price_desc')
                    }
                    className="h-9 px-3 rounded-lg bg-[#0B0D11] border border-white/15 text-xs text-white focus:outline-none focus:border-[#F97316]"
                  >
                    <option value="popularity">По популярности</option>
                    <option value="price_asc">Сначала дешевле</option>
                    <option value="price_desc">Сначала дороже</option>
                  </select>
                </div>
              </div>

              {filteredParts.length === 0 ? (
                <div className="bg-[#12161F] border border-white/10 rounded-2xl p-10 text-center space-y-4">
                  <div className="text-base font-semibold text-white">
                    По заданным параметрам запчасти не найдены
                  </div>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Попробуйте изменить поисковый запрос, сбросить фильтры или выбрать другой раздел автомобиля.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSystemId(null);
                      setSelectedSubcategoryId(null);
                      resetCatalogFilters();
                    }}
                    className="px-4 py-2 rounded-xl bg-[#F97316] text-white text-xs font-semibold"
                  >
                    Показать все товары каталога
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredParts.map((part) => renderPartCard(part))}
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      {/* =====================================================================
          SCREEN 4: DETAILED PRODUCT PAGE (PDP)
      ====================================================================== */}
      {screen === 'product' && activePartObj && (
        <main className="flex-1">
          <ProductDetailView
            key={activePartObj.id}
            part={activePartObj}
            allParts={AUTO_PARTS}
            selectedVehicle={selectedVehicle}
            isFavorite={favorites.includes(activePartObj.id)}
            onToggleFavorite={handleToggleFavorite}
            onAddToCart={handleAddToCart}
            onSelectPart={(id) => {
              setActivePartId(id);
              window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
            }}
            onBackToCatalog={() => setScreen(previousScreen === 'garage' ? 'garage' : 'catalog')}
            onNavigateSystem={(sysId, subId) => {
              setSelectedSystemId(sysId);
              setSelectedSubcategoryId(subId || null);
              setScreen('catalog');
            }}
          />
        </main>
      )}

      {/* =====================================================================
          SCREEN 5: SHOPPING CART & DEMO CHECKOUT
      ====================================================================== */}
      {screen === 'cart' && (
        <main className="flex-1">
          <CartCheckoutView
            cart={cart}
            allParts={AUTO_PARTS}
            selectedVehicle={selectedVehicle}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveCartItem}
            onClearCart={() => setCart([])}
            onSelectPart={handleOpenProductDetail}
            onNavigateCatalog={() => setScreen('catalog')}
            onNavigateGarage={() => setScreen('garage')}
          />
        </main>
      )}

      {/* =====================================================================
          SCREEN 6: SAVED VEHICLES ("МОЙ ГАРАЖ")
      ====================================================================== */}
      {screen === 'my_garage' && (
        <MyGarageView
          vehicles={savedVehicles}
          activeVehicle={selectedVehicle}
          onAddVehicle={() => setScreen('home')}
          onOpenGarage={(v) => {
            activateVehicle(v);
            setScreen('garage');
          }}
          onOpenCatalog={(v) => {
            activateVehicle(v);
            setScreen('catalog');
          }}
          onRemove={handleRemoveSavedVehicle}
        />
      )}

      {/* =====================================================================
          SCREEN 7: FAVORITES ("ИЗБРАННОЕ")
      ====================================================================== */}
      {screen === 'favorites' && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-28 space-y-6">
          <div className="pb-4 border-b border-white/10">
            <h1 className="text-2xl font-bold text-white">Избранные запчасти</h1>
            <p className="text-xs text-slate-400 mt-1">
              Сохранённые позиции для сравнения характеристик и заказа
            </p>
          </div>

          {favorites.length === 0 ? (
            <div className="bg-[#12161F] border border-white/10 rounded-2xl p-10 text-center space-y-4">
              <p className="text-sm text-slate-300">Список избранного пока пуст.</p>
              <button
                type="button"
                onClick={() => setScreen('catalog')}
                className="px-5 py-2.5 rounded-xl bg-[#F97316] text-white text-xs font-semibold"
              >
                Перейти в каталог
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {AUTO_PARTS.filter((p) => favorites.includes(p.id)).map((part) =>
                renderPartCard(part)
              )}
            </div>
          )}
        </main>
      )}

      {/* =====================================================================
          SCREEN 8: CONTACTS ("КОНТАКТЫ")
      ====================================================================== */}
      {screen === 'contacts' && <ContactsView />}

      {/* =====================================================================
          MOBILE BOTTOM NAVIGATION BAR («Главная», «Гараж», «Каталог», «Корзина»)
      ====================================================================== */}
      <nav
        aria-label="Мобильная навигация"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 h-14 bg-[#0B0D11]/95 border-t border-white/10 grid grid-cols-4 items-center px-2"
      >
        <button
          type="button"
          onClick={() => setScreen('home')}
          className={`flex flex-col items-center justify-center py-1 text-[11px] font-medium transition-colors ${
            screen === 'home' ? 'text-[#F97316]' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Home className="w-4 h-4 mb-0.5" />
          <span>Главная</span>
        </button>

        <button
          type="button"
          onClick={() => setScreen('garage')}
          className={`flex flex-col items-center justify-center py-1 text-[11px] font-medium transition-colors ${
            screen === 'garage' ? 'text-[#F97316]' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Car className="w-4 h-4 mb-0.5" />
          <span>Гараж</span>
        </button>

        <button
          type="button"
          onClick={() => setScreen('catalog')}
          className={`flex flex-col items-center justify-center py-1 text-[11px] font-medium transition-colors ${
            screen === 'catalog' || screen === 'product'
              ? 'text-[#F97316]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <LayoutGrid className="w-4 h-4 mb-0.5" />
          <span>Каталог</span>
        </button>

        <button
          type="button"
          onClick={() => setScreen('cart')}
          className={`relative flex flex-col items-center justify-center py-1 text-[11px] font-medium transition-colors ${
            screen === 'cart' ? 'text-[#F97316]' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShoppingCart className="w-4 h-4 mb-0.5" />
          <span>Корзина ({totalCartCount})</span>
        </button>
      </nav>
    </div>
  );
}
