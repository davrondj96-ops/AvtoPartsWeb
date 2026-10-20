import React from 'react';
import { AutoPart, SelectedVehicle } from '../types/garage';
import { evaluatePartCompatibility } from '../data/parts';
import { PartIllustration } from './PartIllustration';
import { CompatibilityHint } from './CompatibilityHint';
import { Heart, ShoppingCart } from 'lucide-react';

interface PartCardProps {
  part: AutoPart;
  selectedVehicle: SelectedVehicle | null;
  isFavorite: boolean;
  onOpen: (partId: string) => void;
  onToggleFavorite: (partId: string) => void;
  onAddToCart: (part: AutoPart, quantity: number) => void;
}

// Карточка товара в сетке каталога, избранного и на главной
export const PartCard: React.FC<PartCardProps> = ({
  part,
  selectedVehicle,
  isFavorite,
  onOpen,
  onToggleFavorite,
  onAddToCart,
}) => {
  const comp = evaluatePartCompatibility(part, selectedVehicle);

  return (
    <article className="group bg-[#12161F] border border-white/10 hover:border-white/25 rounded-2xl overflow-hidden flex flex-col transition-transform duration-150 hover:-translate-y-0.5">
      {/* Product Image Slot (65% height proportions) */}
      <div className="relative aspect-[4/3] w-full bg-[#0E1219] border-b border-white/10 overflow-hidden">
        <button
          type="button"
          onClick={() => onOpen(part.id)}
          aria-label={`Открыть: ${part.name}`}
          className="w-full h-full block text-left focus:outline-none"
        >
          <PartIllustration type={part.illustrationType} className="w-full h-full" />
        </button>

        <button
          type="button"
          onClick={() => onToggleFavorite(part.id)}
          aria-label={isFavorite ? 'Убрать из избранного' : 'В избранное'}
          aria-pressed={isFavorite}
          className={`absolute top-3 right-3 z-20 w-9 h-9 rounded-lg border flex items-center justify-center transition-colors ${
            isFavorite
              ? 'bg-[#12161F] border-[#F97316] text-[#F97316]'
              : 'bg-[#12161F]/80 border-white/15 text-slate-400 hover:text-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Clean Unboxed Metadata & Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Unboxed Metadata Line */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
            <span className="font-semibold text-[#F97316] uppercase tracking-wider">
              {part.brand}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-slate-300">{part.sku}</span>
            <span aria-hidden="true">·</span>
            <span>{part.isOriginal ? 'Оригинал' : 'Аналог'}</span>
          </div>

          <h3 className="text-base font-semibold text-white leading-snug line-clamp-2">
            <button
              type="button"
              onClick={() => onOpen(part.id)}
              className="text-left hover:text-[#38BDF8] transition-colors"
            >
              {part.name}
            </button>
          </h3>

          {/* Compatibility Indicator with Icon + Text */}
          <CompatibilityHint status={comp.status} label={comp.label} className="pt-1 text-xs" />
        </div>

        {/* Price Baseline & Add to Cart */}
        <div className="pt-3 border-t border-white/10 flex items-end justify-between gap-3">
          <div>
            <div className="text-lg font-bold text-white font-mono tabular-nums">
              {part.price.toLocaleString('ru-RU')} ₽
            </div>
            <div className="text-[11px] text-slate-400">
              {part.deliveryDays === 0
                ? `В наличии (${part.stockCount} шт.)`
                : `Под заказ ${part.deliveryDays} дн.`}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onAddToCart(part, 1)}
            className="px-4 py-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>В корзину</span>
          </button>
        </div>
      </div>
    </article>
  );
};
