import { describe, it, expect, beforeEach } from 'vitest'
import { LocalStorageShoppingListRepository } from '../../../infrastructure/repositories/LocalStorageShoppingListRepository'
import { ShoppingListItem } from '../../../domain/model/ShoppingListItem'
import { ProductId } from '../../../domain/model/ProductId'

describe('LocalStorageShoppingListRepository', () => {
  let repository: LocalStorageShoppingListRepository

  beforeEach(() => {
    localStorage.clear()
    repository = new LocalStorageShoppingListRepository()
  })

  describe('findAll', () => {
    it('should return empty array when no items exist', async () => {
      const items = await repository.findAll()

      expect(items).toEqual([])
    })

    it('should return all shopping list items', async () => {
      const productId1 = ProductId.fromString('123e4567-e89b-12d3-a456-426614174000')
      const productId2 = ProductId.fromString('123e4567-e89b-12d3-a456-426614174001')
      const item1 = ShoppingListItem.createAuto(productId1, 'low')
      const item2 = ShoppingListItem.createManual(productId2)

      await repository.add(item1)
      await repository.add(item2)

      const items = await repository.findAll()

      expect(items).toHaveLength(2)
      expect(items[0].productId.value).toBe('123e4567-e89b-12d3-a456-426614174000')
      expect(items[1].productId.value).toBe('123e4567-e89b-12d3-a456-426614174001')
    })
  })

  describe('findByProductId', () => {
    it('should return null when item does not exist', async () => {
      const productId = ProductId.fromString('123e4567-e89b-12d3-a456-426614174000')

      const item = await repository.findByProductId(productId)

      expect(item).toBeNull()
    })

    it('should return item when it exists', async () => {
      const productId = ProductId.fromString('123e4567-e89b-12d3-a456-426614174000')
      const item = ShoppingListItem.createAuto(productId, 'low')

      await repository.add(item)

      const foundItem = await repository.findByProductId(productId)

      expect(foundItem).not.toBeNull()
      expect(foundItem?.productId.value).toBe('123e4567-e89b-12d3-a456-426614174000')
      expect(foundItem?.reason).toBe('auto')
    })
  })

  describe('add', () => {
    it('should add an item to the shopping list', async () => {
      const productId = ProductId.fromString('123e4567-e89b-12d3-a456-426614174000')
      const item = ShoppingListItem.createAuto(productId, 'low')

      await repository.add(item)

      const items = await repository.findAll()
      expect(items).toHaveLength(1)
    })

    it('should not add duplicate items', async () => {
      const productId = ProductId.fromString('123e4567-e89b-12d3-a456-426614174000')
      const item1 = ShoppingListItem.createAuto(productId, 'low')
      const item2 = ShoppingListItem.createAuto(productId, 'empty')

      await repository.add(item1)
      await repository.add(item2)

      const items = await repository.findAll()
      expect(items).toHaveLength(1)
      expect(items[0].stockLevel).toBe('empty') // Should update to latest
    })
  })

  describe('remove', () => {
    it('should remove an item from the shopping list', async () => {
      const productId = ProductId.fromString('123e4567-e89b-12d3-a456-426614174000')
      const item = ShoppingListItem.createAuto(productId, 'low')

      await repository.add(item)
      await repository.remove(productId)

      const items = await repository.findAll()
      expect(items).toHaveLength(0)
    })

    it('should do nothing when removing non-existent item', async () => {
      const productId = ProductId.fromString('123e4567-e89b-12d3-a456-426614174000')

      await repository.remove(productId)

      const items = await repository.findAll()
      expect(items).toHaveLength(0)
    })
  })

  describe('exists', () => {
    it('should return false when item does not exist', async () => {
      const productId = ProductId.fromString('123e4567-e89b-12d3-a456-426614174000')

      const exists = await repository.exists(productId)

      expect(exists).toBe(false)
    })

    it('should return true when item exists', async () => {
      const productId = ProductId.fromString('123e4567-e89b-12d3-a456-426614174000')
      const item = ShoppingListItem.createAuto(productId, 'low')

      await repository.add(item)

      const exists = await repository.exists(productId)

      expect(exists).toBe(true)
    })
  })

  describe('toggleChecked', () => {
    it('should toggle checked state of existing item from false to true', async () => {
      const productId = ProductId.fromString('123e4567-e89b-12d3-a456-426614174000')
      const item = ShoppingListItem.createAuto(productId, 'low')

      await repository.add(item)
      await repository.toggleChecked(productId)

      const found = await repository.findByProductId(productId)
      expect(found?.checked).toBe(true)
    })

    it('should toggle checked state from true to false', async () => {
      const productId = ProductId.fromString('123e4567-e89b-12d3-a456-426614174000')
      const item = ShoppingListItem.createAuto(productId, 'low')

      await repository.add(item)
      await repository.toggleChecked(productId) // true
      await repository.toggleChecked(productId) // false

      const found = await repository.findByProductId(productId)
      expect(found?.checked).toBe(false)
    })

    it('should do nothing when toggling non-existent item', async () => {
      const productId = ProductId.fromString('123e4567-e89b-12d3-a456-426614174000')

      await repository.toggleChecked(productId)

      const found = await repository.findByProductId(productId)
      expect(found).toBeNull()
    })
  })

  describe('getCheckedItems', () => {
    it('should return empty array when no items are checked', async () => {
      const productId1 = ProductId.fromString('123e4567-e89b-12d3-a456-426614174000')
      const productId2 = ProductId.fromString('123e4567-e89b-12d3-a456-426614174001')
      const item1 = ShoppingListItem.createAuto(productId1, 'low')
      const item2 = ShoppingListItem.createManual(productId2)

      await repository.add(item1)
      await repository.add(item2)

      const checkedItems = await repository.getCheckedItems()

      expect(checkedItems).toHaveLength(0)
    })

    it('should return only checked items', async () => {
      const productId1 = ProductId.fromString('123e4567-e89b-12d3-a456-426614174000')
      const productId2 = ProductId.fromString('123e4567-e89b-12d3-a456-426614174001')
      const productId3 = ProductId.fromString('123e4567-e89b-12d3-a456-426614174002')
      const item1 = ShoppingListItem.createAuto(productId1, 'low')
      const item2 = ShoppingListItem.createManual(productId2)
      const item3 = ShoppingListItem.createAuto(productId3, 'empty')

      await repository.add(item1)
      await repository.add(item2)
      await repository.add(item3)

      await repository.toggleChecked(productId1)
      await repository.toggleChecked(productId3)

      const checkedItems = await repository.getCheckedItems()

      expect(checkedItems).toHaveLength(2)
      expect(checkedItems[0].productId.value).toBe('123e4567-e89b-12d3-a456-426614174000')
      expect(checkedItems[1].productId.value).toBe('123e4567-e89b-12d3-a456-426614174002')
    })
  })

  describe('backward compatibility', () => {
    it('should default checked to false for legacy data without checked field', async () => {
      // Simulate legacy data directly in localStorage
      const legacyData = [{
        productId: '123e4567-e89b-12d3-a456-426614174000',
        reason: 'auto',
        stockLevel: 'low',
        addedAt: new Date().toISOString()
        // NO checked field
      }]
      localStorage.setItem('shopping_manager_shopping-list', JSON.stringify(legacyData))

      const items = await repository.findAll()

      expect(items).toHaveLength(1)
      expect(items[0].checked).toBe(false)
    })

    it('should preserve checked = true from storage', async () => {
      // Simulate data with checked field
      const dataWithChecked = [{
        productId: '123e4567-e89b-12d3-a456-426614174000',
        reason: 'auto',
        stockLevel: 'low',
        addedAt: new Date().toISOString(),
        checked: true
      }]
      localStorage.setItem('shopping_manager_shopping-list', JSON.stringify(dataWithChecked))

      const items = await repository.findAll()

      expect(items).toHaveLength(1)
      expect(items[0].checked).toBe(true)
    })
  })

  describe('clear', () => {
    it('should remove all items from localStorage', async () => {
      const productId1 = ProductId.fromString('123e4567-e89b-12d3-a456-426614174000')
      const productId2 = ProductId.fromString('123e4567-e89b-12d3-a456-426614174001')
      const item1 = ShoppingListItem.createAuto(productId1, 'low')
      const item2 = ShoppingListItem.createManual(productId2)

      await repository.add(item1)
      await repository.add(item2)

      await repository.clear()

      const items = await repository.findAll()
      expect(items).toHaveLength(0)
    })

    it('should not affect other localStorage keys', async () => {
      const productId = ProductId.fromString('123e4567-e89b-12d3-a456-426614174000')
      const item = ShoppingListItem.createAuto(productId, 'low')

      await repository.add(item)
      localStorage.setItem('shopping_manager_other-key', 'test-value')

      await repository.clear()

      expect(localStorage.getItem('shopping_manager_other-key')).toBe('test-value')
    })
  })

  describe('updateChecked', () => {
    it('should update specific item checked state to true', async () => {
      const productId = ProductId.fromString('123e4567-e89b-12d3-a456-426614174000')
      const item = ShoppingListItem.createAuto(productId, 'low')

      await repository.add(item)
      await repository.updateChecked(productId, true)

      const found = await repository.findByProductId(productId)
      expect(found?.checked).toBe(true)
    })

    it('should update specific item checked state to false', async () => {
      const productId = ProductId.fromString('123e4567-e89b-12d3-a456-426614174000')
      const item = ShoppingListItem.createAuto(productId, 'low')

      await repository.add(item)
      await repository.toggleChecked(productId) // Set to true first
      await repository.updateChecked(productId, false)

      const found = await repository.findByProductId(productId)
      expect(found?.checked).toBe(false)
    })

    it('should persist checked state to localStorage', async () => {
      const productId = ProductId.fromString('123e4567-e89b-12d3-a456-426614174000')
      const item = ShoppingListItem.createAuto(productId, 'low')

      await repository.add(item)
      await repository.updateChecked(productId, true)

      // Create new repository instance to verify persistence
      const newRepository = new LocalStorageShoppingListRepository()
      const found = await newRepository.findByProductId(productId)
      expect(found?.checked).toBe(true)
    })

    it('should do nothing when updating non-existent item', async () => {
      const productId = ProductId.fromString('123e4567-e89b-12d3-a456-426614174000')

      await repository.updateChecked(productId, true)

      const found = await repository.findByProductId(productId)
      expect(found).toBeNull()
    })
  })
})
