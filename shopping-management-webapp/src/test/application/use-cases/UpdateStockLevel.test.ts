import { describe, it, expect, beforeEach } from 'vitest'
import { UpdateStockLevel, type UpdateStockLevelCommand } from '../../../application/use-cases/UpdateStockLevel'
import type { InventoryRepository } from '../../../domain/repositories/InventoryRepository'
import { InventoryItem } from '../../../domain/model/InventoryItem'
import { ProductId } from '../../../domain/model/ProductId'
import { Quantity } from '../../../domain/model/Quantity'
import { UnitType } from '../../../domain/model/UnitType'
import { StockLevel } from '../../../domain/model/StockLevel'

describe('UpdateStockLevel', () => {
  let inventoryRepository: InventoryRepository
  let updateStockLevel: UpdateStockLevel

  const productId = ProductId.fromString('123e4567-e89b-12d3-a456-426614174000')
  const existingItem = new InventoryItem(
    productId,
    Quantity.create(10),
    UnitType.units(),
    StockLevel.create('high'),
    new Date('2025-12-01')
  )

  beforeEach(() => {
    inventoryRepository = {
      findByProductId: async () => existingItem,
      save: async () => {},
      findAll: async () => []
    }
    updateStockLevel = new UpdateStockLevel(inventoryRepository)
  })

  it('should update stock level for existing inventory item', async () => {
    const command: UpdateStockLevelCommand = {
      productId: '123e4567-e89b-12d3-a456-426614174000',
      newStockLevel: 'low'
    }

    const result = await updateStockLevel.execute(command)

    expect(result.stockLevel.value).toBe('low')
    expect(result.productId.equals(productId)).toBe(true)
  })

  it('should update lastUpdated timestamp when updating stock level', async () => {
    const before = new Date()
    const command: UpdateStockLevelCommand = {
      productId: '123e4567-e89b-12d3-a456-426614174000',
      newStockLevel: 'medium'
    }

    const result = await updateStockLevel.execute(command)
    const after = new Date()

    expect(result.lastUpdated.getTime()).toBeGreaterThanOrEqual(before.getTime())
    expect(result.lastUpdated.getTime()).toBeLessThanOrEqual(after.getTime())
  })

  it('should throw error if product not found in inventory', async () => {
    inventoryRepository.findByProductId = async () => null

    const command: UpdateStockLevelCommand = {
      productId: '123e4567-e89b-12d3-a456-426614174000',
      newStockLevel: 'low'
    }

    await expect(updateStockLevel.execute(command)).rejects.toThrow('Product not found in inventory')
  })

  it('should throw error for invalid stock level', async () => {
    const command: UpdateStockLevelCommand = {
      productId: '123e4567-e89b-12d3-a456-426614174000',
      newStockLevel: 'invalid'
    }

    await expect(updateStockLevel.execute(command)).rejects.toThrow('Invalid stock level')
  })

  it('should save updated inventory item to repository', async () => {
    let savedItem: InventoryItem | undefined
    inventoryRepository.save = async (item: InventoryItem) => {
      savedItem = item
    }

    const command: UpdateStockLevelCommand = {
      productId: '123e4567-e89b-12d3-a456-426614174000',
      newStockLevel: 'medium'
    }

    await updateStockLevel.execute(command)

    expect(savedItem).toBeDefined()
    expect(savedItem!.stockLevel.value).toBe('medium')
  })
})