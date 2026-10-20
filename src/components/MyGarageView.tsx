import React from 'react';
import { SelectedVehicle } from '../types/garage';
import { vehicleKey } from '../lib/storage';
import { Trash2 } from 'lucide-react';

interface MyGarageViewProps {
  vehicles: SelectedVehicle[];
  activeVehicle: SelectedVehicle | null;
  onAddVehicle: () => void;
  onOpenGarage: (vehicle: SelectedVehicle) => void;
  onOpenCatalog: (vehicle: SelectedVehicle) => void;
  onRemove: (vehicle: SelectedVehicle) => void;
}

export const MyGarageView: React.FC<MyGarageViewProps> = ({
  vehicles,
  activeVehicle,
  onAddVehicle,
  onOpenGarage,
  onOpenCatalog,
  onRemove,
}) => (
  <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-28 space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
      <div>
        <h1 className="text-2xl font-bold text-white">Мой гараж</h1>
        <p className="text-xs text-slate-400 mt-1">
          Сохранённые автомобили для быстрого переключения и проверки совместимости запчастей
        </p>
      </div>
      <button
        type="button"
        onClick={onAddVehicle}
        className="px-4 py-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-semibold"
      >
        + Добавить автомобиль
      </button>
    </div>

    {vehicles.length === 0 ? (
      <div className="bg-[#12161F] border border-white/10 rounded-2xl p-10 text-center space-y-4">
        <p className="text-sm text-slate-300">В гараже пока нет сохранённых автомобилей.</p>
        <p className="text-xs text-slate-400">
          Выберите автомобиль на главной, откройте 3D-гараж и нажмите «В гараж».
        </p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vehicles.map((v) => {
          const key = vehicleKey(v);
          const isCurrent = activeVehicle !== null && vehicleKey(activeVehicle) === key;

          return (
            <div
              key={key}
              className={`p-5 rounded-2xl border flex flex-col justify-between gap-4 ${
                isCurrent ? 'bg-[#161B26] border-[#F97316]' : 'bg-[#12161F] border-white/10'
              }`}
            >
              <div className="space-y-1.5">
                <div className="text-xs text-slate-400 flex items-center justify-between">
                  <span>{v.years}</span>
                  {isCurrent && <span className="text-[#F97316] font-semibold">Активный выбор</span>}
                </div>
                <h2 className="text-lg font-bold text-white">
                  {v.brandName} {v.modelName}
                  {v.generationName && ` · ${v.generationName}`}
                </h2>
                <p className="text-xs text-slate-300">
                  {[v.engine, v.transmission, v.drivetrain].filter(Boolean).join(' · ')}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => onOpenGarage(v)}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-semibold"
                >
                  Открыть в 3D-гараже
                </button>
                <button
                  type="button"
                  onClick={() => onOpenCatalog(v)}
                  className="py-2 px-3 rounded-xl bg-[#1A202C] hover:bg-[#232B3A] text-slate-200 text-xs font-medium"
                >
                  Каталог
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(v)}
                  aria-label={`Удалить ${v.brandName} ${v.modelName} из гаража`}
                  title="Удалить из гаража"
                  className="w-9 h-9 rounded-xl bg-[#1A202C] hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 flex items-center justify-center shrink-0 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </main>
);
