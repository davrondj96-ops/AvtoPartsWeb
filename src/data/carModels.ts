import { SelectedVehicle } from '../types/garage';

/**
 * Реальная 3D-модель автомобиля для 3D-гаража.
 * Файл .glb кладётся в public/models/, модель автоматически масштабируется
 * и ставится на пол. Если модели нет, показывается схематичный автомобиль.
 */
export interface CarModelAsset {
  /** Имя файла внутри public/models/ */
  file: string;
  /** Подпись под сценой, например «Chevrolet Cobalt» */
  title: string;
  /** Куда смотрит перед автомобиля в исходном файле (по умолчанию +z) */
  forward?: '+z' | '-z' | '+x' | '-x';
  /** Длина автомобиля в метрах — для правильного масштаба относительно схемы узлов */
  lengthMeters?: number;
  /** Автор и лицензия: для моделей CC-BY указание автора обязательно */
  credit?: { author: string; license: string; url: string };
}

/**
 * Ключ — generationId (модель конкретного поколения) или modelId
 * (одна модель для всех поколений).
 */
export const CAR_MODELS: Record<string, CarModelAsset> = {};

export function findCarModel(vehicle: SelectedVehicle): CarModelAsset | null {
  return CAR_MODELS[vehicle.generationId] ?? CAR_MODELS[vehicle.modelId] ?? null;
}
