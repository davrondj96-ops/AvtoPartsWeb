import React from 'react';
import { Clock, MapPin, Phone } from 'lucide-react';

export const ContactsView: React.FC = () => (
  <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-28 space-y-6">
    <div className="pb-4 border-b border-white/10">
      <h1 className="text-2xl font-bold text-white">Контакты и клиентский сервис</h1>
      <p className="text-xs text-slate-400 mt-1">
        Центральный склад, пункт самовывоза и техническая консультация по подбору
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-[#12161F] border border-white/10 rounded-2xl p-6 space-y-2">
        <Phone className="w-5 h-5 text-[#F97316]" />
        <h2 className="text-sm font-semibold text-white">Отдел подбора запчастей</h2>
        <p className="text-base font-bold font-mono text-white">+7 (495) 740-88-90</p>
        <p className="text-xs text-slate-400">Консультация по совместимости OEM и аналогов</p>
      </div>

      <div className="bg-[#12161F] border border-white/10 rounded-2xl p-6 space-y-2">
        <MapPin className="w-5 h-5 text-[#38BDF8]" />
        <h2 className="text-sm font-semibold text-white">Склад и самовывоз</h2>
        <p className="text-xs text-slate-200 leading-relaxed">
          г. Москва, Автозаводская ул., д. 23, корп. 7 (территория техцентра APEX GARAGE)
        </p>
      </div>

      <div className="bg-[#12161F] border border-white/10 rounded-2xl p-6 space-y-2">
        <Clock className="w-5 h-5 text-emerald-400" />
        <h2 className="text-sm font-semibold text-white">Режим работы</h2>
        <p className="text-xs text-slate-200">Ежедневно: 09:00 — 21:00</p>
        <p className="text-xs text-slate-400">Выдача интернет-заказов через 30 минут после подтверждения</p>
      </div>
    </div>
  </main>
);
