// Цены хранятся и показываются в узбекских сумах
export function formatPrice(amount: number): string {
  return `${Math.round(amount).toLocaleString('ru-RU')} сум`;
}
