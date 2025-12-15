import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest'
import { UpdateStockLevel, type UpdateStockLevelCommand } from '../../../application/use-cases/UpdateStockLevel'
import type { InventoryRepository } from '../../../domain/repositories/InventoryRepository'
import type { ShoppingListRepository } from '../../../domain/repositories/ShoppingListRepository'
import { InventoryItem } from '../../../domain/model/InventoryItem'
import { ProductId } from '../../../domain/model/ProductId'
import { Quantity } from '../../../domain/model/Quantity'
import { UnitType } from '../../../domain/model/UnitType'
import { StockLevel } from '../../../domain/model/StockLevel'
import type { ShoppingListItem } from '../../../domain/model/ShoppingListItem'

describe('UpdateStockLevel', () => {
  let inventoryRepository: InventoryRepository
  let shoppingListRepository: ShoppingListRepository
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
    shoppingListRepository = {
      findAll: async () => [],
      findByProductId: async () => null,
      add: vi.fn(),
      remove: vi.fn(),
      exists: async () => false,
      toggleChecked: vi.fn(),
      getCheckedItems: async () => []
    }
    updateStockLevel = new UpdateStockLevel(inventoryRepository, shoppingListRepository)
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

  describe('Shopping List Integration', () => {
    it('should add product to shopping list when stock level is low', async () => {
      const command: UpdateStockLevelCommand = {
        productId: '123e4567-e89b-12d3-a456-426614174000',
        newStockLevel: 'low'
      }

      await updateStockLevel.execute(command)

      expect(shoppingListRepository.add).toHaveBeenCalledOnce()
      const addMock = shoppingListRepository.add as Mock
      const addedItem = addMock.mock.calls[0][0] as ShoppingListItem
      expect(addedItem.productId.equals(productId)).toBe(true)
      expect(addedItem.reason).toBe('auto')
      expect(addedItem.stockLevel).toBe('low')
    })

    it('should add product to shopping list when stock level is empty', async () => {
      const command: UpdateStockLevelCommand = {
        productId: '123e4567-e89b-12d3-a456-426614174000',
        newStockLevel: 'empty'
      }

      await updateStockLevel.execute(command)

      expect(shoppingListRepository.add).toHaveBeenCalledOnce()
      const addMock = shoppingListRepository.add as Mock
      const addedItem = addMock.mock.calls[0][0] as ShoppingListItem
      expect(addedItem.stockLevel).toBe('empty')
    })

    it('should remove product from shopping list when stock level is high', async () => {
      const command: UpdateStockLevelCommand = {
        productId: '123e4567-e89b-12d3-a456-426614174000',
        newStockLevel: 'high'
      }

      await updateStockLevel.execute(command)

      expect(shoppingListRepository.remove).toHaveBeenCalledOnce()
      expect(shoppingListRepository.remove).toHaveBeenCalledWith(productId)
    })

    it('should remove product from shopping list when stock level is medium', async () => {
      const command: UpdateStockLevelCommand = {
        productId: '123e4567-e89b-12d3-a456-426614174000',
        newStockLevel: 'medium'
      }

      await updateStockLevel.execute(command)

      expect(shoppingListRepository.remove).toHaveBeenCalledOnce()
      expect(shoppingListRepository.remove).toHaveBeenCalledWith(productId)
    })

    it('should not add/remove from shopping list if update fails', async () => {
      inventoryRepository.save = async () => {
        throw new Error('Database error')
      }

      const command: UpdateStockLevelCommand = {
        productId: '123e4567-e89b-12d3-a456-426614174000',
        newStockLevel: 'low'
      }

      await expect(updateStockLevel.execute(command)).rejects.toThrow('Database error')
      expect(shoppingListRepository.add).not.toHaveBeenCalled()
      expect(shoppingListRepository.remove).not.toHaveBeenCalled()
    })
  })
})