import React, { useState } from 'react';
import {
  AutoPart,
  CompatibilityStatus,
  SelectedVehicle,
} from '../types/garage';
import { evaluatePartCompatibility } from '../data/parts';
import { GARAGE_SYSTEMS, VEHICLE_BRANDS } from '../data/vehicles';
import { PartIllustration } from './PartIllustration';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Heart,
  ShoppingCart,
  ShieldCheck,
  Truck,
  Layers,
  Copy,
  Check,
} from 'lucide-react';

interface ProductDetailViewProps {
  part: AutoPart;
  allParts: AutoPart[];
  selectedVehicle: SelectedVehicle | null;
  isFavorite: boolean;
  onToggleFavorite: (partId: string) => void;
  onAddToCart: (part: AutoPart, quantity: number) => void;
  onSelectPart: (partId: string) => void;
  onBackToCatalog: () => void;
  onNavigateSystem: (systemId: AutoPart['systemId'], subcategoryId?: string) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  part,
  allParts,
  selectedVehicle,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  onSelectPart,
  onBackToCatalog,
  onNavigateSystem,
}) => {
  const [activeViewAngle, setActiveViewAngle] = useState<'main' | 'blueprint' | 'detail'>('main');
  const [quantity, setQuantity] = useState<number>(1);
  const [copiedOem, setCopiedOem] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState<boolean>(false);

  const compatibility = evaluatePartCompatibility(part, selectedVehicle);

  const systemObj = GARAGE_SYSTEMS.find((s) => s.id === part.systemId);
  const subcatObj = systemObj?.subcategories.find((sub) => sub.id === part.subcategoryId);

  const analogParts = allParts.filter(
    (p) =>
      part.analogPartIds.includes(p.id) ||
      (p.subcategoryId === part.subcategoryId && p.id !== part.id)
  );

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedOem(code);
    setTimeout(() => setCopiedOem(null), 1500);
  };

  const handleAdd = () => {
    onAddToCart(part, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  const renderCompatibilityBanner = (status: CompatibilityStatus) => {
    if (status === 'compatible') {
      return (
        <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-semibold text-emerald-300">
              {compatibility.label}
            </div>
            <p className="text-xs text-slate-300 mt-0.5">{compatibility.detail}</p>
          </div>
        </div>
      );
    }
    if (status === 'verify_required' || status === 'no_vehicle') {
      return (
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-semibold text-amber-300">
              Совместимость требует проверки
            </div>
            <p className="text-xs text-slate-300 mt-0.5">{compatibility.detail}</p>
          </div>
        </div>
      );
    }
    return (
      <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 flex items-start gap-3">
        <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        <div>
          <div className="text-sm font-semibold text-rose-300">{compatibility.label}</div>
          <p className="text-xs text-slate-300 mt-0.5">{compatibility.detail}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28">
      {/* Breadcrumbs & Back Button */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
        <nav aria-label="Хлебные крошки" className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <button
            type="button"
            onClick={onBackToCatalog}
            className="hover:text-white transition-colors"
          >
            Каталог запчастей
          </button>
          {systemObj && (
            <>
              <span aria-hidden="true">/</span>
              <button
                type="button"
                onClick={() => onNavigateSystem(systemObj.id)}
                className="hover:text-white transition-colors"
              >
                {systemObj.shortName}
              </button>
            </>
          )}
          {systemObj && subcatObj && (
            <>
              <span aria-hidden="true">/</span>
              <button
                type="button"
                onClick={() => onNavigateSystem(systemObj.id, subcatObj.id)}
                className="hover:text-white transition-colors"
              >
                {subcatObj.name}
              </button>
            </>
          )}
          <span aria-hidden="true">/</span>
          <span className="text-slate-200 font-mono">{part.sku}</span>
        </nav>

        <button
          type="button"
          onClick={onBackToCatalog}
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white transition-colors whitespace-nowrap"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Назад к списку деталей</span>
        </button>
      </div>

      {/* Main Contiguous 2-Column Purchase Module */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Gallery & Technical Views */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#12161F] aspect-[4/3]">
            <PartIllustration
              type={part.illustrationType}
              viewAngle={activeViewAngle}
              className="w-full h-full"
            />
          </div>

          {/* Gallery Thumbnails */}
          <div className="grid grid-cols-3 gap-3">
            {(
              [
                { id: 'main', label: '3D-рендер детали' },
                { id: 'blueprint', label: 'Проекция узла' },
                { id: 'detail', label: 'Крепёж и размеры' },
              ] as const
            ).map((view) => (
              <button
                key={view.id}
                type="button"
                onClick={() => setActiveViewAngle(view.id)}
                className={`p-2 rounded-xl border text-left transition-colors ${
                  activeViewAngle === view.id
                    ? 'border-[#F97316] bg-[#161B24]'
                    : 'border-white/10 bg-[#12161F] hover:border-white/25'
                }`}
              >
                <div className="aspect-[16/10] rounded-lg overflow-hidden mb-1.5 pointer-events-none">
                  <PartIllustration type={part.illustrationType} viewAngle={view.id} />
                </div>
                <div className="text-[11px] font-medium text-slate-300 truncate">
                  {view.label}
                </div>
              </button>
            ))}
          </div>

          {/* Delivery & Warranty Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-[#12161F] border border-white/10">
              <div className="flex items-center gap-2 text-xs font-semibold text-white mb-1">
                <Truck className="w-4 h-4 text-[#38BDF8]" />
                <span>Доставка и самовывоз</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {part.deliveryDays === 0
                  ? 'В наличии на центральном складе. Самовывоз сегодня через 30 минут или экспресс-доставка курьером.'
                  : `Поставка со склада дистрибьютора за ${part.deliveryDays} дн. Доступна доставка до СТО или пункта выдачи.`}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#12161F] border border-white/10">
              <div className="flex items-center gap-2 text-xs font-semibold text-white mb-1">
                <ShieldCheck className="w-4 h-4 text-[#F97316]" />
                <span>Официальная гарантия {part.warrantyMonths} мес.</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Защита от подделок и возврат в течение 14 дней без объяснения причин при сохранении товарного вида.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Contiguous Purchase & Specification Module */}
        <div className="lg:col-span-6 space-y-6 bg-[#12161F] p-6 sm:p-8 rounded-2xl border border-white/10">
          {/* Clean Unboxed Metadata */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-[#F97316] uppercase tracking-wider">
              {part.brand}
            </span>
            <span aria-hidden="true">·</span>
            <span>Артикул: <strong className="font-mono text-slate-200">{part.sku}</strong></span>
            <span aria-hidden="true">·</span>
            <span>{part.isOriginal ? 'Оригинальная деталь (OEM)' : 'Сертифицированный дубликат'}</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-white leading-snug">
            {part.name}
          </h1>

          {/* Compatibility Status for Active Garage Vehicle */}
          {renderCompatibilityBanner(compatibility.status)}

          {/* Pricing & Stock */}
          <div className="pt-2 pb-4 border-b border-white/10 flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-white font-mono tabular-nums">
                  {part.price.toLocaleString('ru-RU')} ₽
                </span>
                {part.oldPrice && (
                  <span className="text-sm text-slate-500 line-through font-mono tabular-nums">
                    {part.oldPrice.toLocaleString('ru-RU')} ₽
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Цена за 1 шт. (включая НДС)
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-medium text-emerald-400">
                В наличии: <span className="font-mono tabular-nums">{part.stockCount} шт.</span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                {part.deliveryDays === 0 ? 'Отгрузка сегодня' : `Срок поставки: ${part.deliveryDays} дн.`}
              </div>
            </div>
          </div>

          {/* Quantity Stepper & Add to Cart Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center bg-[#0B0D11] border border-white/15 rounded-xl p-1">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Уменьшить количество"
                className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-white font-mono text-lg"
              >
                −
              </button>
              <span className="w-10 text-center font-mono text-sm font-semibold text-white tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(part.stockCount, q + 1))}
                aria-label="Увеличить количество"
                className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-white font-mono text-lg"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className="flex-1 min-w-[200px] h-12 px-6 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>
                {justAdded
                  ? `Добавлено (${quantity} шт.)`
                  : `В корзину · ${(part.price * quantity).toLocaleString('ru-RU')} ₽`}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onToggleFavorite(part.id)}
              aria-label={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
              className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-colors ${
                isFavorite
                  ? 'border-[#F97316] bg-[#F97316]/15 text-[#F97316]'
                  : 'border-white/15 bg-[#0B0D11] text-slate-400 hover:text-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">{part.description}</p>

          {/* Technical Specifications Table */}
          <div className="space-y-3 pt-2">
            <h2 className="text-sm font-semibold text-white">
              Технические характеристики
            </h2>
            <dl className="divide-y divide-white/10 border-t border-b border-white/10 text-xs">
              {part.specs.map((spec) => (
                <div key={spec.label} className="py-2.5 flex items-center justify-between gap-4">
                  <dt className="text-slate-400">{spec.label}</dt>
                  <dd className="text-slate-100 font-medium text-right font-mono tabular-nums">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* OEM Reference Numbers */}
          <div className="space-y-2.5">
            <h2 className="text-sm font-semibold text-white">
              Оригинальные OEM-номера (кросс-коды)
            </h2>
            <div className="flex flex-wrap gap-2">
              {part.oemNumbers.map((oem) => (
                <button
                  key={oem}
                  type="button"
                  onClick={() => handleCopy(oem)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0B0D11] border border-white/10 hover:border-[#38BDF8] text-xs font-mono text-slate-200 transition-colors"
                >
                  <span>{oem}</span>
                  {copiedOem === oem ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmed Vehicle Compatibility Matrix */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-[#12161F] p-6 rounded-2xl border border-white/10">
          <h2 className="text-base font-semibold text-white mb-4">
            Подтверждённая применимость к автомобилям
          </h2>
          <div className="divide-y divide-white/10 text-xs">
            {part.compatibility.map((rule, idx) => {
              const brand = VEHICLE_BRANDS.find((b) => b.id === rule.brandId);
              const model = brand?.models.find((m) => m.id === rule.modelId);
              const gen = model?.generations.find((g) => g.id === rule.generationId);
              const mods =
                gen?.modifications.filter((mod) =>
                  rule.modificationIds?.includes(mod.id)
                ) || [];

              return (
                <div key={idx} className="py-3.5 space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold text-white text-sm">
                      {brand?.name} {model?.name}{' '}
                      {gen ? `· ${gen.name} (${gen.years})` : ''}
                    </span>
                    <span className="text-slate-400 font-mono">
                      {mods.length > 0
                        ? `Модификаций: ${mods.length}`
                        : 'Требуется проверка по VIN/OEM'}
                    </span>
                  </div>
                  {mods.length > 0 && (
                    <div className="text-slate-300 space-y-1">
                      {mods.map((m) => (
                        <div key={m.id} className="flex flex-wrap items-center gap-2 text-slate-400">
                          <span className="text-slate-200">{m.engine}</span>
                          <span aria-hidden="true">·</span>
                          <span>{m.transmission}</span>
                          <span aria-hidden="true">·</span>
                          <span>{m.drivetrain}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {rule.notes && (
                    <p className="text-slate-400 italic">{rule.notes}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Direct Analogs & Replacements */}
        <div className="lg:col-span-5 bg-[#12161F] p-6 rounded-2xl border border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-4 h-4 text-[#38BDF8]" />
            <h2 className="text-base font-semibold text-white">
              Совместимые аналоги и замены
            </h2>
          </div>

          {analogParts.length === 0 ? (
            <p className="text-xs text-slate-400">
              Для данного артикула прямые кросс-аналоги в текущем разделе не требуются.
            </p>
          ) : (
            <div className="space-y-3">
              {analogParts.map((analog) => (
                <div
                  key={analog.id}
                  className="p-3.5 rounded-xl bg-[#0B0D11] border border-white/10 hover:border-white/25 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="text-xs text-slate-400 flex items-center gap-1.5">
                      <span className="font-semibold text-[#F97316]">{analog.brand}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{analog.sku}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onSelectPart(analog.id)}
                      className="text-sm font-medium text-white hover:text-[#38BDF8] transition-colors text-left truncate block max-w-full mt-0.5"
                    >
                      {analog.name}
                    </button>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-white font-mono tabular-nums">
                      {analog.price.toLocaleString('ru-RU')} ₽
                    </div>
                    <button
                      type="button"
                      onClick={() => onSelectPart(analog.id)}
                      className="text-xs text-[#38BDF8] hover:underline mt-0.5"
                    >
                      Открыть
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
