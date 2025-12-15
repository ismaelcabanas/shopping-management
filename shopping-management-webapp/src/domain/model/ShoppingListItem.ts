import type { ProductId } from './ProductId'

export type ShoppingListReason = 'auto' | 'manual'
export type StockLevelValue = 'high' | 'medium' | 'low' | 'empty'

export class ShoppingListItem {
  readonly productId: ProductId
  readonly reason: ShoppingListReason
  readonly stockLevel?: StockLevelValue
  readonly addedAt: Date
  readonly checked: boolean

  private constructor(
    productId: ProductId,
    reason: ShoppingListReason,
    stockLevel: StockLevelValue | undefined,
    addedAt: Date,
    checked: boolean = false
  ) {
    this.productId = productId
    this.reason = reason
    this.stockLevel = stockLevel
    this.addedAt = addedAt
    this.checked = checked
  }

  static createAuto(productId: ProductId, stockLevel: StockLevelValue): ShoppingListItem {
    return new ShoppingListItem(productId, 'auto', stockLevel, new Date(), false)
  }

  static createManual(productId: ProductId): ShoppingListItem {
    return new ShoppingListItem(productId, 'manual', undefined, new Date(), false)
  }

  toggleChecked(): ShoppingListItem {
    return new ShoppingListItem(
      this.productId,
      this.reason,
      this.stockLevel,
      this.addedAt,
      !this.checked
    )
  }

  isAutoAdded(): boolean {
    return this.reason === 'auto'
  }

  shouldRemoveWhenStockHigh(): boolean {
    return this.isAutoAdded()
  }
}
