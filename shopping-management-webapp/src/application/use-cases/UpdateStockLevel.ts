import type { InventoryRepository } from '../../domain/repositories/InventoryRepository'
import { ProductId } from '../../domain/model/ProductId'
import { StockLevel } from '../../domain/model/StockLevel'
import type { InventoryItem } from '../../domain/model/InventoryItem'

export interface UpdateStockLevelCommand {
  productId: string
  newStockLevel: string
}

export class UpdateStockLevel {
  private readonly inventoryRepository: InventoryRepository

  constructor(inventoryRepository: InventoryRepository) {
    this.inventoryRepository = inventoryRepository
  }

  async execute(command: UpdateStockLevelCommand): Promise<InventoryItem> {
    const productId = ProductId.fromString(command.productId)
    const inventoryItem = await this.inventoryRepository.findByProductId(productId)

    if (!inventoryItem) {
      throw new Error('Product not found in inventory')
    }

    const newStockLevel = StockLevel.create(command.newStockLevel)
    const updatedItem = inventoryItem.updateStockLevel(newStockLevel)

    await this.inventoryRepository.save(updatedItem)

    return updatedItem
  }
}