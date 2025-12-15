import type { ShoppingListItem } from '../model/ShoppingListItem'
import type { ProductId } from '../model/ProductId'

export interface ShoppingListRepository {
  findAll(): Promise<ShoppingListItem[]>
  findByProductId(productId: ProductId): Promise<ShoppingListItem | null>
  add(item: ShoppingListItem): Promise<void>
  remove(productId: ProductId): Promise<void>
  exists(productId: ProductId): Promise<boolean>
  toggleChecked(productId: ProductId): Promise<void>
  getCheckedItems(): Promise<ShoppingListItem[]>
}
