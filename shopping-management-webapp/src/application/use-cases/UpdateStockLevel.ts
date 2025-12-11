import type { InventoryRepository } from '../../domain/repositories/InventoryRepository'
import type { ShoppingListRepository } from '../../domain/repositories/ShoppingListRepository'
import { ProductId } from '../../domain/model/ProductId'
import { StockLevel } from '../../domain/model/StockLevel'
import { ShoppingListItem } from '../../domain/model/ShoppingListItem'
import type { InventoryItem } from '../../domain/model/InventoryItem'
import { StockLevelCalculator } from '../../domain/services/StockLevelCalculator'

export interface UpdateStockLevelCommand {
  productId: string
  newStockLevel: string
}

export class UpdateStockLevel {
  private readonly inventoryRepository: InventoryRepository
  private readonly shoppingListRepository: ShoppingListRepository
  private readonly stockLevelCalculator: StockLevelCalculator

  constructor(
    inventoryRepository: InventoryRepository,
    shoppingListRepository: ShoppingListRepository
  ) {
    this.inventoryRepository = inventoryRepository
    this.shoppingListRepository = shoppingListRepository
    this.stockLevelCalculator = new StockLevelCalculator()
  }

  async execute(command: UpdateStockLevelCommand): Promise<InventoryItem> {
    const productId = ProductId.fromString(command.productId)
    const inventoryItem = await this.inventoryRepository.findByProductId(productId)

    if (!inventoryItem) {
      throw new Error('Product not found in inventory')
    }

    const newStockLevel = StockLevel.create(command.newStockLevel)
    const updatedItem = inventoryItem.updateStockLevel(newStockLevel)

    // Save inventory first (if this fails, we don't want to modify shopping list)
    await this.inventoryRepository.save(updatedItem)

    // Automatically manage shopping list based on stock level
    await this.updateShoppingList(productId, newStockLevel)

    return updatedItem
  }

  private async updateShoppingList(
    productId: ProductId,
    stockLevel: StockLevel
  ): Promise<void> {
    const shouldBeInList = this.stockLevelCalculator.shouldAddToShoppingList(stockLevel)

    if (shouldBeInList) {
      // Add to shopping list with auto reason
      const shoppingListItem = ShoppingListItem.createAuto(productId, stockLevel.value)
      await this.shoppingListRepository.add(shoppingListItem)
    } else {
      // Remove from shopping list (if it exists)
      await this.shoppingListRepository.remove(productId)
    }
  }
}