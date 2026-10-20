import { AutoPart, CartItem, SelectedVehicle } from '../types/garage';
import { buildSelectedVehicle } from '../data/vehicles';

export const STORAGE_KEYS = {
  CART: 'apex_garage_cart_v1',
  SAVED_GARAGE: 'apex_garage_saved_vehicles_v1',
  FAVORITES: 'apex_garage_favorites_v1',
  ACTIVE_VEHICLE: 'apex_garage_active_vehicle_v1',
};

export function readStorage(key: string): unknown {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? undefined : JSON.parse(raw);
  } catch {
    return undefined;
  }
}

export function writeStorage(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Хранилище недоступно (приватный режим, переполнение) — работаем без него
  }
}

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null;

const str = (v: unknown): string => (typeof v === 'string' ? v : '');

/**
 * Восстанавливает автомобиль из сохранённых данных, пересобирая его по
 * актуальному справочнику: устаревшие или повреждённые записи отбрасываются.
 */
export function restoreVehicle(raw: unknown): SelectedVehicle | null {
  if (!isRecord(raw)) return null;
  return buildSelectedVehicle(
    str(raw.brandId),
    str(raw.modelId),
    str(raw.generationId),
    str(raw.modificationId)
  );
}

export function vehicleKey(v: SelectedVehicle): string {
  return [v.brandId, v.modelId, v.generationId, v.modificationId].join('|');
}

export function restoreSavedVehicles(raw: unknown): SelectedVehicle[] | null {
  if (!Array.isArray(raw)) return null;
  const seen = new Set<string>();
  const result: SelectedVehicle[] = [];
  for (const item of raw) {
    const v = restoreVehicle(item);
    if (v && !seen.has(vehicleKey(v))) {
      seen.add(vehicleKey(v));
      result.push(v);
    }
  }
  return result;
}

export function restoreCart(raw: unknown, parts: AutoPart[]): CartItem[] {
  if (!Array.isArray(raw)) return [];
  const result: CartItem[] = [];
  for (const item of raw) {
    if (!isRecord(item)) continue;
    const part = parts.find((p) => p.id === item.partId);
    const qty = Math.floor(Number(item.quantity));
    if (!part || part.stockCount <= 0 || !(qty > 0)) continue;
    if (result.some((i) => i.partId === part.id)) continue;
    result.push({
      partId: part.id,
      quantity: Math.min(qty, part.stockCount),
      vehicleContext: typeof item.vehicleContext === 'string' ? item.vehicleContext : undefined,
    });
  }
  return result;
}

export function restoreFavorites(raw: unknown, parts: AutoPart[]): string[] {
  if (!Array.isArray(raw)) return [];
  const ids = new Set(parts.map((p) => p.id));
  return Array.from(new Set(raw.filter((id): id is string => typeof id === 'string' && ids.has(id))));
}
