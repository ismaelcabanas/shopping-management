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
})
