import { describe, it, expect } from 'vitest'
import { ShoppingListItem } from '../../../domain/model/ShoppingListItem'
import { ProductId } from '../../../domain/model/ProductId'

describe('ShoppingListItem', () => {
  describe('creation', () => {
    it('should create a shopping list item with auto reason', () => {
      const productId = ProductId.fromString('123e4567-e89b-12d3-a456-426614174000')
      const item = ShoppingListItem.createAuto(productId, 'low')

      expect(item.productId.value).toBe('123e4567-e89b-12d3-a456-426614174000')
      expect(item.reason).toBe('auto')
      expect(item.stockLevel).toBe('low')
      expect(item.addedAt).toBeInstanceOf(Date)
    })

    it('should create a shopping list item with manual reason', () => {
      const productId = ProductId.fromString('123e4567-e89b-12d3-a456-426614174000')
      const item = ShoppingListItem.createManual(productId)

      expect(item.productId.value).toBe('123e4567-e89b-12d3-a456-426614174000')
      expect(item.reason).toBe('manual')
      expect(item.stockLevel).toBeUndefined()
      expect(item.addedAt).toBeInstanceOf(Date)
    })
  })

  describe('isAutoAdded', () => {
    it('should return true for auto-added items', () => {
      const productId = ProductId.fromString('123e4567-e89b-12d3-a456-426614174000')
      const item = ShoppingListItem.createAuto(productId, 'low')

      expect(item.isAutoAdded()).toBe(true)
    })

    it('should return false for manually added items', () => {
      const productId = ProductId.fromString('123e4567-e89b-12d3-a456-426614174000')
      const item = ShoppingListItem.createManual(productId)

      expect(item.isAutoAdded()).toBe(false)
    })
  })

  describe('shouldRemoveWhenStockHigh', () => {
    it('should return true for auto-added items', () => {
      const productId = ProductId.fromString('123e4567-e89b-12d3-a456-426614174000')
      const item = ShoppingListItem.createAuto(productId, 'low')

      expect(item.shouldRemoveWhenStockHigh()).toBe(true)
    })

    it('should return false for manually added items', () => {
      const productId = ProductId.fromString('123e4567-e89b-12d3-a456-426614174000')
      const item = ShoppingListItem.createManual(productId)

      expect(item.shouldRemoveWhenStockHigh()).toBe(false)
    })
  })
})
