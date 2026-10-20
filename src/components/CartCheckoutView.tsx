import React, { useState } from 'react';
import { AutoPart, CartItem, OrderDetails, SelectedVehicle } from '../types/garage';
import { PartIllustration } from './PartIllustration';
import {
  Trash2,
  ShoppingBag,
  ArrowLeft,
  CheckCircle2,
  Truck,
  MapPin,
  Info,
} from 'lucide-react';

interface CartCheckoutViewProps {
  cart: CartItem[];
  allParts: AutoPart[];
  selectedVehicle: SelectedVehicle | null;
  onUpdateQuantity: (partId: string, quantity: number) => void;
  onRemoveItem: (partId: string) => void;
  onClearCart: () => void;
  onSelectPart: (partId: string) => void;
  onNavigateCatalog: () => void;
  onNavigateGarage: () => void;
}

export const CartCheckoutView: React.FC<CartCheckoutViewProps> = ({
  cart,
  allParts,
  selectedVehicle,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onSelectPart,
  onNavigateCatalog,
  onNavigateGarage,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [comment, setComment] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<OrderDetails | null>(null);

  const populatedItems = cart
    .map((item) => {
      const part = allParts.find((p) => p.id === item.partId);
      return part ? { part, quantity: item.quantity, vehicleContext: item.vehicleContext } : null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const itemsSubtotal = populatedItems.reduce(
    (sum, item) => sum + item.part.price * item.quantity,
    0
  );
  const deliveryCost =
    deliveryMethod === 'pickup' || itemsSubtotal >= 15000 || itemsSubtotal === 0 ? 0 : 590;
  const totalAmount = itemsSubtotal + deliveryCost;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setFormError('Пожалуйста, укажите ваше имя для оформления заказа.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.trim().length < 6) {
      setFormError('Пожалуйста, укажите корректный номер телефона для связи.');
      return;
    }
    if (deliveryMethod === 'delivery' && !deliveryAddress.trim()) {
      setFormError('Пожалуйста, укажите адрес доставки или выберите самовывоз.');
      return;
    }

    setFormError(null);
    const order: OrderDetails = {
      id: `APX-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toLocaleString('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      deliveryMethod,
      deliveryAddress:
        deliveryMethod === 'pickup'
          ? 'Центральный техцентр APEX GARAGE: г. Москва, Автозаводская ул., д. 23, корп. 7'
          : deliveryAddress.trim(),
      comment: comment.trim(),
      items: populatedItems,
      totalAmount,
    };

    setCompletedOrder(order);
    onClearCart();
  };

  if (completedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 pb-28">
        <div className="bg-[#12161F] border border-white/10 rounded-2xl p-6 sm:p-10 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                Демонстрационный режим · Тестовый заказ без списания средств
              </div>
              <h1 className="text-2xl font-bold text-white mt-1">
                Заказ №{completedOrder.id} успешно сформирован
              </h1>
              <p className="text-sm text-slate-300 mt-1">
                Оформлен {completedOrder.createdAt}. Это демонстрационный заказ для проверки работы прототипа интернет-магазина.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#0B0D11] border border-white/10 text-xs">
            <div>
              <div className="text-slate-400">Получатель</div>
              <div className="text-white font-medium mt-0.5">{completedOrder.customerName}</div>
              <div className="text-slate-300 font-mono mt-0.5">{completedOrder.customerPhone}</div>
            </div>
            <div>
              <div className="text-slate-400">
                {completedOrder.deliveryMethod === 'delivery' ? 'Адрес доставки' : 'Пункт самовывоза'}
              </div>
              <div className="text-white font-medium mt-0.5">{completedOrder.deliveryAddress}</div>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-white">Состав заказа</h2>
            <div className="divide-y divide-white/10 border-t border-b border-white/10">
              {completedOrder.items.map(({ part, quantity, vehicleContext }) => (
                <div key={part.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="text-white font-medium">{part.name}</div>
                    <div className="text-slate-400 font-mono mt-0.5">
                      {part.brand} · {part.sku} × {quantity} шт.
                    </div>
                    {vehicleContext && (
                      <div className="text-slate-400 mt-0.5">Автомобиль: {vehicleContext}</div>
                    )}
                  </div>
                  <div className="text-sm font-bold text-white font-mono tabular-nums shrink-0">
                    {(part.price * quantity).toLocaleString('ru-RU')} ₽
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-medium text-slate-300">Итоговая сумма заказа:</span>
              <span className="text-2xl font-bold text-[#F97316] font-mono tabular-nums">
                {completedOrder.totalAmount.toLocaleString('ru-RU')} ₽
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-4">
            <button
              type="button"
              onClick={onNavigateGarage}
              className="px-5 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-semibold transition-colors whitespace-nowrap"
            >
              Вернуться в 3D-гараж
            </button>
            <button
              type="button"
              onClick={onNavigateCatalog}
              className="px-5 py-2.5 rounded-xl bg-[#1A202C] hover:bg-[#232B3A] text-slate-200 text-xs font-semibold transition-colors whitespace-nowrap"
            >
              Продолжить выбор деталей
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (populatedItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center pb-28">
        <div className="bg-[#12161F] border border-white/10 rounded-2xl p-8 sm:p-12 max-w-xl mx-auto space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-[#1A202C] border border-white/10 flex items-center justify-center mx-auto text-slate-400">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Ваша корзина пока пуста</h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Откройте интерактивный гараж, выберите систему автомобиля (например, «Ходовая часть и подвеска») и добавьте подходящие запчасти.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onNavigateGarage}
              className="px-5 py-3 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-semibold transition-colors whitespace-nowrap"
            >
              Открыть интерактивный гараж
            </button>
            <button
              type="button"
              onClick={onNavigateCatalog}
              className="px-5 py-3 rounded-xl bg-[#1A202C] hover:bg-[#232B3A] text-slate-200 text-xs font-semibold transition-colors whitespace-nowrap"
            >
              Перейти в каталог запчастей
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-white">Корзина и оформление заказа</h1>
          {selectedVehicle && (
            <p className="text-xs text-slate-400 mt-1">
              Выбранный автомобиль: {selectedVehicle.brandName} {selectedVehicle.modelName} (
              {selectedVehicle.generationName}), {selectedVehicle.engine}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onNavigateCatalog}
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Вернуться к покупкам</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Cols: Cart Items List */}
        <div className="lg:col-span-7 space-y-4">
          {populatedItems.map(({ part, quantity, vehicleContext }) => (
            <div
              key={part.id}
              className="p-4 sm:p-5 rounded-2xl bg-[#12161F] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <button
                type="button"
                onClick={() => onSelectPart(part.id)}
                className="w-full sm:w-28 h-24 rounded-xl overflow-hidden border border-white/10 shrink-0"
              >
                <PartIllustration type={part.illustrationType} />
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="font-semibold text-[#F97316]">{part.brand}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono">{part.sku}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectPart(part.id)}
                  className="text-sm font-semibold text-white hover:text-[#38BDF8] transition-colors text-left mt-0.5 line-clamp-2"
                >
                  {part.name}
                </button>
                {vehicleContext && (
                  <div className="text-[11px] text-slate-400 mt-1">
                    Подбор для: {vehicleContext}
                  </div>
                )}
              </div>

              <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
                <div className="text-base font-bold text-white font-mono tabular-nums">
                  {(part.price * quantity).toLocaleString('ru-RU')} ₽
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-[#0B0D11] border border-white/15 rounded-lg">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(part.id, quantity - 1)}
                      aria-label="Уменьшить количество"
                      className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-white font-mono"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-mono text-xs font-semibold text-white tabular-nums">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateQuantity(part.id, Math.min(part.stockCount, quantity + 1))
                      }
                      aria-label="Увеличить количество"
                      className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-white font-mono"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveItem(part.id)}
                    aria-label="Удалить деталь из корзины"
                    className="w-8 h-8 rounded-lg bg-[#0B0D11] border border-white/10 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right 5 Cols: Order Checkout Form & Summary */}
        <form
          onSubmit={handleSubmitOrder}
          className="lg:col-span-5 bg-[#12161F] p-6 rounded-2xl border border-white/10 space-y-5"
        >
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#0B0D11] border border-amber-500/30 text-xs text-slate-300">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300 block">Демонстрационное оформление заказа</strong>
              Платежный шлюз не подключён. Заказ создаётся в тестовом режиме без оплаты.
            </div>
          </div>

          <h2 className="text-base font-semibold text-white">Данные получателя</h2>

          {formError && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-200">
              {formError}
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-300 mb-1">Ваше имя и фамилия *</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Александр Волков"
                className="w-full h-11 px-3.5 rounded-xl bg-[#0B0D11] border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#F97316]"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Контактный телефон *</label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+7 (999) 123-45-67"
                className="w-full h-11 px-3.5 rounded-xl bg-[#0B0D11] border border-white/15 text-sm text-white font-mono placeholder:text-slate-500 focus:outline-none focus:border-[#F97316]"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1.5">Способ получения</label>
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#0B0D11] border border-white/10">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('delivery')}
                  className={`py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap ${
                    deliveryMethod === 'delivery'
                      ? 'bg-[#1A202C] text-white border border-[#F97316]/60'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Доставка курьером</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('pickup')}
                  className={`py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap ${
                    deliveryMethod === 'pickup'
                      ? 'bg-[#1A202C] text-white border border-[#F97316]/60'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Самовывоз со склада</span>
                </button>
              </div>
            </div>

            {deliveryMethod === 'delivery' ? (
              <div>
                <label className="block text-xs text-slate-300 mb-1">Адрес доставки *</label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="г. Москва, Ленинский пр-т, д. 45, кв. 12"
                  className="w-full h-11 px-3.5 rounded-xl bg-[#0B0D11] border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#F97316]"
                />
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-[#0B0D11] border border-white/10 text-xs text-slate-300">
                Пункт выдачи и техцентр: <strong className="text-white">г. Москва, Автозаводская ул., д. 23, корп. 7</strong> (ежедневно 09:00 — 21:00, бесплатно).
              </div>
            )}

            <div>
              <label className="block text-xs text-slate-300 mb-1">
                Комментарий к заказу или VIN для дополнительной сверки
              </label>
              <textarea
                rows={2}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Например: позвонить за час до приезда курьера"
                className="w-full p-3 rounded-xl bg-[#0B0D11] border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#F97316]"
              />
            </div>
          </div>

          {/* Order Cost Breakdown */}
          <div className="pt-4 border-t border-white/10 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Товары ({populatedItems.reduce((acc, i) => acc + i.quantity, 0)} шт.):</span>
              <span className="font-mono text-slate-200 tabular-nums">
                {itemsSubtotal.toLocaleString('ru-RU')} ₽
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Стоимость доставки:</span>
              <span className="font-mono text-slate-200 tabular-nums">
                {deliveryCost === 0 ? 'Бесплатно' : `${deliveryCost.toLocaleString('ru-RU')} ₽`}
              </span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-white/10">
              <span className="text-sm font-semibold text-white">Итого к оплате:</span>
              <span className="text-2xl font-bold text-[#F97316] font-mono tabular-nums">
                {totalAmount.toLocaleString('ru-RU')} ₽
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-12 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold text-sm transition-colors"
          >
            Подтвердить демонстрационный заказ
          </button>
        </form>
      </div>
    </div>
  );
};
