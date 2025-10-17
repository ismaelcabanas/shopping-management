/**
 * Calcula el precio total de un conjunto de items
 */
export interface PriceItem {
  price: number
  quantity: number
}

export function calculateTotal(items: PriceItem[]): number {
  return items.reduce((total, item) => {
    return total + item.price * item.quantity
  }, 0)
}

/**
 * Formatea un precio a formato de moneda
 */
export function formatPrice(price: number, currency = '€'): string {
  return `${price.toFixed(2)} ${currency}`
}

/**
 * Determina si un producto necesita reposición
 */
export function needsRestock(currentStock: number, minimumStock: number): boolean {
  return currentStock <= minimumStock
}

