import type { ShoppingListRepository } from '../../domain/repositories/ShoppingListRepository'
import type { InventoryRepository } from '../../domain/repositories/InventoryRepository'
import { ShoppingListItem } from '../../domain/model/ShoppingListItem'

export class RecalculateShoppingList {
  private shoppingListRepository: ShoppingListRepository
  private inventoryRepository: InventoryRepository
  constructor(
    shoppingListRepository: ShoppingListRepository,
    inventoryRepository: InventoryRepository
  ) {
    this.shoppingListRepository = shoppingListRepository
    this.inventoryRepository = inventoryRepository
  }

  async execute(): Promise<void> {
    await this.shoppingListRepository.clear()

    const inventory = await this.inventoryRepository.findAll()

    const needRestock = inventory.filter(
      item => item.stockLevel.value === 'low' || item.stockLevel.value === 'empty'
    )

    for (const item of needRestock) {
      const shoppingListItem = ShoppingListItem.createAuto(item.productId, item.stockLevel.value)
      await this.shoppingListRepository.add(shoppingListItem)
    }
  }
}
