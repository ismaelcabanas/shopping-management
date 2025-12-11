import type { ProductId } from './ProductId'

export type ShoppingListReason = 'auto' | 'manual'
export type StockLevelValue = 'high' | 'medium' | 'low' | 'empty'

export class ShoppingListItem {
  readonly productId: ProductId
  readonly reason: ShoppingListReason
  readonly stockLevel?: StockLevelValue
  readonly addedAt: Date

  private constructor(
    productId: ProductId,
    reason: ShoppingListReason,
    stockLevel: StockLevelValue | undefined,
    addedAt: Date
  ) {
    this.productId = productId
    this.reason = reason
    this.stockLevel = stockLevel
    this.addedAt = addedAt
  }

  static createAuto(productId: ProductId, stockLevel: StockLevelValue): ShoppingListItem {
    return new ShoppingListItem(productId, 'auto', stockLevel, new Date())
  }

  static createManual(productId: ProductId): ShoppingListItem {
    return new ShoppingListItem(productId, 'manual', undefined, new Date())
  }

  isAutoAdded(): boolean {
    return this.reason === 'auto'
  }

  shouldRemoveWhenStockHigh(): boolean {
    return this.isAutoAdded()
  }
}
