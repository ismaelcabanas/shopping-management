import type { InventoryRepository } from '../../domain/repositories/InventoryRepository'
import type { InventoryItem } from '../../domain/model/InventoryItem'
import { StockLevelCalculator } from '../../domain/services/StockLevelCalculator'

export class GetProductsNeedingRestock {
  private readonly inventoryRepository: InventoryRepository
  private readonly stockLevelCalculator: StockLevelCalculator

  constructor(inventoryRepository: InventoryRepository) {
    this.inventoryRepository = inventoryRepository
    this.stockLevelCalculator = new StockLevelCalculator()
  }

  async execute(): Promise<InventoryItem[]> {
    const allItems = await this.inventoryRepository.findAll()

    return allItems.filter(item =>
      this.stockLevelCalculator.shouldAddToShoppingList(item.stockLevel)
    )
  }
}