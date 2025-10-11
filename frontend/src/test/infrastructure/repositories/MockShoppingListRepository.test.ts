import { describe, it, expect, beforeEach } from 'vitest'
import { MockShoppingListRepository } from '../../../infrastructure/repositories/MockShoppingListRepository'
import type { ShoppingListItem } from '../../../domain/entities/ShoppingListItem'
import { ItemStatusVO } from '../../../domain/value-objects/ItemStatus'
import { Quantity } from '../../../domain/value-objects/Quantity'

describe('MockShoppingListRepository', () => {
  let repository: MockShoppingListRepository

  // Test data factory
  const createTestItem = (
    id: string,
    productName: string,
    quantity: number = 1,
    status: 'needed' | 'bought' = 'needed'
  ): ShoppingListItem => ({
    id,
    productName,
    quantity: Quantity.create(quantity),
    unit: 'ud',
    status: status === 'needed' ? ItemStatusVO.needed() : ItemStatusVO.bought(),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  })

  beforeEach(() => {
    repository = new MockShoppingListRepository()
  })

  describe('Initial State', () => {
    it('should have pre-populated data on initialization', async () => {
      const items = await repository.findAll()

      expect(items).toHaveLength(5)
      expect(items[0].productName).toBe('Pan')
      expect(items[1].productName).toBe('Leche Entera')
      expect(items[2].productName).toBe('Tomates')
      expect(items[3].productName).toBe('Brócoli')
      expect(items[4].productName).toBe('Plátanos')

      // Verify all initial items are needed
      items.forEach(item => {
        expect(item.status.isNeeded()).toBe(true)
      })
    })

    it('should return a copy of items not direct reference', async () => {
      const items1 = await repository.findAll()
      const items2 = await repository.findAll()

      expect(items1).not.toBe(items2)
      expect(items1).toEqual(items2)
    })
  })

  describe('FindAll', () => {
    it('should return all items', async () => {
      const items = await repository.findAll()

      expect(items).toHaveLength(5)
      expect(Array.isArray(items)).toBe(true)
    })

    it('should return items with proper domain objects', async () => {
      const items = await repository.findAll()

      items.forEach(item => {
        expect(item.quantity).toBeInstanceOf(Quantity)
        expect(item.status).toBeInstanceOf(ItemStatusVO)
        expect(typeof item.id).toBe('string')
        expect(typeof item.productName).toBe('string')
        expect(typeof item.unit).toBe('string')
        expect(item.createdAt).toBeInstanceOf(Date)
        expect(item.updatedAt).toBeInstanceOf(Date)
      })
    })
  })

  describe('FindById', () => {
    it('should find existing item by id', async () => {
      const item = await repository.findById('1')

      expect(item).not.toBeNull()
      expect(item!.id).toBe('1')
      expect(item!.productName).toBe('Pan')
      expect(item!.quantity.getValue()).toBe(2)
      expect(item!.unit).toBe('ud')
    })

    it('should return null for non-existent id', async () => {
      const item = await repository.findById('non-existent')

      expect(item).toBeNull()
    })

    it('should find all initial items by their ids', async () => {
      const ids = ['1', '2', '3', '4', '5']

      for (const id of ids) {
        const item = await repository.findById(id)
        expect(item).not.toBeNull()
        expect(item!.id).toBe(id)
      }
    })
  })

  describe('Save', () => {
    it('should add new item to repository', async () => {
      const newItem = createTestItem('new-1', 'New Product', 3)

      await repository.save(newItem)

      const allItems = await repository.findAll()
      expect(allItems).toHaveLength(6)

      const savedItem = await repository.findById('new-1')
      expect(savedItem).not.toBeNull()
      expect(savedItem!.productName).toBe('New Product')
      expect(savedItem!.quantity.getValue()).toBe(3)
    })

    it('should preserve all properties when saving', async () => {
      const newItem = createTestItem('new-2', 'Complex Product', 5, 'bought')
      newItem.unit = 'kg'

      await repository.save(newItem)

      const savedItem = await repository.findById('new-2')
      expect(savedItem!.unit).toBe('kg')
      expect(savedItem!.status.isBought()).toBe(true)
      expect(savedItem!.quantity.getValue()).toBe(5)
    })

    it('should not prevent duplicate ids (repository behavior)', async () => {
      const newItem = createTestItem('1', 'Duplicate ID Product')

      await repository.save(newItem)

      const allItems = await repository.findAll()
      expect(allItems).toHaveLength(6) // Original 5 + 1 new

      // findById returns the first match
      const foundItem = await repository.findById('1')
      expect(foundItem!.productName).toBe('Pan') // Original item
    })
  })

  describe('Update', () => {
    it('should update existing item', async () => {
      const originalItem = await repository.findById('1')
      expect(originalItem!.productName).toBe('Pan')

      const updatedItem = {
        ...originalItem!,
        productName: 'Pan Integral',
        quantity: Quantity.create(4),
        updatedAt: new Date('2024-02-01')
      }

      await repository.update(updatedItem)

      const retrievedItem = await repository.findById('1')
      expect(retrievedItem!.productName).toBe('Pan Integral')
      expect(retrievedItem!.quantity.getValue()).toBe(4)
      expect(retrievedItem!.updatedAt).toEqual(new Date('2024-02-01'))
    })

    it('should not affect other items when updating', async () => {
      const originalItems = await repository.findAll()
      const itemToUpdate = { ...originalItems[0], productName: 'Updated Product' }

      await repository.update(itemToUpdate)

      const allItems = await repository.findAll()
      expect(allItems).toHaveLength(5) // Same count
      expect(allItems[0].productName).toBe('Updated Product')
      expect(allItems[1].productName).toBe('Leche Entera') // Unchanged
    })

    it('should do nothing when item id does not exist', async () => {
      const nonExistentItem = createTestItem('non-existent', 'Ghost Product')

      await repository.update(nonExistentItem)

      const allItems = await repository.findAll()
      expect(allItems).toHaveLength(5) // No change

      const item = await repository.findById('non-existent')
      expect(item).toBeNull()
    })
  })

  describe('Delete', () => {
    it('should remove item by id', async () => {
      await repository.delete('1')

      const allItems = await repository.findAll()
      expect(allItems).toHaveLength(4)

      const deletedItem = await repository.findById('1')
      expect(deletedItem).toBeNull()
    })

    it('should not affect other items when deleting', async () => {
      await repository.delete('3')

      const allItems = await repository.findAll()
      expect(allItems).toHaveLength(4)

      const item2 = await repository.findById('2')
      const item4 = await repository.findById('4')
      expect(item2).not.toBeNull()
      expect(item4).not.toBeNull()
    })

    it('should do nothing when deleting non-existent id', async () => {
      await repository.delete('non-existent')

      const allItems = await repository.findAll()
      expect(allItems).toHaveLength(5) // No change
    })

    it('should be able to delete all items', async () => {
      const allItems = await repository.findAll()

      for (const item of allItems) {
        await repository.delete(item.id)
      }

      const remainingItems = await repository.findAll()
      expect(remainingItems).toHaveLength(0)
    })
  })

  describe('Mark All As Bought', () => {
    it('should mark all items as bought', async () => {
      await repository.markAllAsBought()

      const allItems = await repository.findAll()
      expect(allItems).toHaveLength(5)

      allItems.forEach(item => {
        expect(item.status.isBought()).toBe(true)
        expect(item.status.isNeeded()).toBe(false)
      })
    })

    it('should update timestamps when marking as bought', async () => {
      const originalItems = await repository.findAll()
      const originalTimestamp = originalItems[0].updatedAt

      // Wait a bit to ensure different timestamp
      await new Promise(resolve => setTimeout(resolve, 10))

      await repository.markAllAsBought()

      const updatedItems = await repository.findAll()
      expect(updatedItems[0].updatedAt.getTime()).toBeGreaterThan(originalTimestamp.getTime())
    })

    it('should preserve other properties when marking as bought', async () => {
      const originalItems = await repository.findAll()

      await repository.markAllAsBought()

      const updatedItems = await repository.findAll()

      for (let i = 0; i < originalItems.length; i++) {
        expect(updatedItems[i].id).toBe(originalItems[i].id)
        expect(updatedItems[i].productName).toBe(originalItems[i].productName)
        expect(updatedItems[i].quantity.getValue()).toBe(originalItems[i].quantity.getValue())
        expect(updatedItems[i].unit).toBe(originalItems[i].unit)
      }
    })
  })

  describe('Mark All As Needed', () => {
    it('should mark all items as needed', async () => {
      // First mark as bought
      await repository.markAllAsBought()

      // Then mark as needed
      await repository.markAllAsNeeded()

      const allItems = await repository.findAll()
      expect(allItems).toHaveLength(5)

      allItems.forEach(item => {
        expect(item.status.isNeeded()).toBe(true)
        expect(item.status.isBought()).toBe(false)
      })
    })

    it('should update timestamps when marking as needed', async () => {
      await repository.markAllAsBought()
      const boughtItems = await repository.findAll()
      const boughtTimestamp = boughtItems[0].updatedAt

      // Wait a bit to ensure different timestamp
      await new Promise(resolve => setTimeout(resolve, 10))

      await repository.markAllAsNeeded()

      const neededItems = await repository.findAll()
      expect(neededItems[0].updatedAt.getTime()).toBeGreaterThan(boughtTimestamp.getTime())
    })
  })

  describe('Integration Scenarios', () => {
    it('should handle complete CRUD operations correctly', async () => {
      // Read
      let allItems = await repository.findAll()
      expect(allItems).toHaveLength(5)

      // Create
      const newItem = createTestItem('test-crud', 'CRUD Test Product', 2)
      await repository.save(newItem)

      allItems = await repository.findAll()
      expect(allItems).toHaveLength(6)

      // Update
      const updatedItem = { ...newItem, productName: 'Updated CRUD Product' }
      await repository.update(updatedItem)

      const retrievedItem = await repository.findById('test-crud')
      expect(retrievedItem!.productName).toBe('Updated CRUD Product')

      // Delete
      await repository.delete('test-crud')

      allItems = await repository.findAll()
      expect(allItems).toHaveLength(5)
    })

    it('should handle bulk operations correctly', async () => {
      // Add some items with different statuses
      await repository.save(createTestItem('bulk-1', 'Bulk Item 1', 1, 'needed'))
      await repository.save(createTestItem('bulk-2', 'Bulk Item 2', 2, 'bought'))

      let allItems = await repository.findAll()
      expect(allItems).toHaveLength(7)

      // Mark all as bought
      await repository.markAllAsBought()

      allItems = await repository.findAll()
      allItems.forEach(item => {
        expect(item.status.isBought()).toBe(true)
      })

      // Mark all as needed
      await repository.markAllAsNeeded()

      allItems = await repository.findAll()
      allItems.forEach(item => {
        expect(item.status.isNeeded()).toBe(true)
      })
    })
  })
})