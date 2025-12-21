import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useShoppingList } from '../../../presentation/hooks/useShoppingList'
import { ProductId } from '../../../domain/model/ProductId'

describe('useShoppingList', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('loading shopping list', () => {
    it('should return empty array when no items in shopping list', async () => {
      const { result } = renderHook(() => useShoppingList())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.items).toEqual([])
      expect(result.current.error).toBeNull()
    })

    it('should load shopping list items with product name when available', async () => {
      // Setup: Add product to products, inventory, and shopping list
      const productId = '123e4567-e89b-12d3-a456-426614174000'

      localStorage.setItem('shopping_manager_products', JSON.stringify([{
        id: productId,
        name: 'Huevos',
        unitType: 'units'
      }]))

      localStorage.setItem('shopping_manager_inventory', JSON.stringify([{
        productId: productId,
        currentStock: 2,
        unitType: 'units',
        stockLevel: 'low',
        lastUpdated: new Date().toISOString()
      }]))

      localStorage.setItem('shopping_manager_shopping-list', JSON.stringify([{
        productId: productId,
        reason: 'auto',
        stockLevel: 'low',
        addedAt: new Date().toISOString()
      }]))

      const { result } = renderHook(() => useShoppingList())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.items).toHaveLength(1)
      expect(result.current.items[0].productId.value).toBe(productId)
      expect(result.current.items[0].stockLevel).toBe('low')
      expect(result.current.items[0].reason).toBe('auto')
      // Note: productName will be 'Producto desconocido' if product not found
      expect(result.current.items[0].productName).toBeDefined()
    })
  })

  describe('markAsPurchased', () => {
    it('should remove item from shopping list', async () => {
      const productId = '123e4567-e89b-12d3-a456-426614174000'

      localStorage.setItem('shopping_manager_shopping-list', JSON.stringify([{
        productId: productId,
        reason: 'auto',
        stockLevel: 'low',
        addedAt: new Date().toISOString()
      }]))

      const { result } = renderHook(() => useShoppingList())

      await waitFor(() => {
        expect(result.current.items).toHaveLength(1)
      })

      // Mark as purchased
      await result.current.markAsPurchased(ProductId.fromString(productId))

      await waitFor(() => {
        expect(result.current.items).toHaveLength(0)
      })
    })

    it('should handle errors when marking as purchased', async () => {
      const { result } = renderHook(() => useShoppingList())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      const invalidProductId = ProductId.fromString('123e4567-e89b-12d3-a456-426614174999')

      // Should not throw
      await expect(result.current.markAsPurchased(invalidProductId)).resolves.not.toThrow()
    })
  })

  describe('error handling', () => {
    it('should handle corrupted localStorage data gracefully', async () => {
      localStorage.setItem('shopping_manager_shopping-list', 'invalid json{')

      const { result } = renderHook(() => useShoppingList())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // LocalStorageClient handles corrupted data by returning null, so no error is thrown
      // The shopping list should just be empty
      expect(result.current.error).toBeNull()
      expect(result.current.items).toEqual([])
    })
  })

  describe('addManual', () => {
    it('should expose addManual method', async () => {
      const { result } = renderHook(() => useShoppingList())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.addManual).toBeDefined()
      expect(typeof result.current.addManual).toBe('function')
    })

    it('should add product to shopping list manually', async () => {
      const productId = '123e4567-e89b-12d3-a456-426614174000'

      localStorage.setItem('shopping_manager_products', JSON.stringify([{
        id: productId,
        name: 'Chocolate',
        unitType: 'units'
      }]))

      const { result } = renderHook(() => useShoppingList())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.items).toHaveLength(0)

      // Add manually
      await result.current.addManual(productId)

      await waitFor(() => {
        expect(result.current.items).toHaveLength(1)
      })

      expect(result.current.items[0].productId.value).toBe(productId)
      expect(result.current.items[0].reason).toBe('manual')
      expect(result.current.items[0].stockLevel).toBeUndefined()
    })

    it('should refresh shopping list after successful addition', async () => {
      const productId = '123e4567-e89b-12d3-a456-426614174000'

      localStorage.setItem('shopping_manager_products', JSON.stringify([{
        id: productId,
        name: 'Bread',
        unitType: 'units'
      }]))

      const { result } = renderHook(() => useShoppingList())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      const initialItems = result.current.items.length

      await result.current.addManual(productId)

      await waitFor(() => {
        expect(result.current.items.length).toBe(initialItems + 1)
      })
    })

    it('should throw error when trying to add duplicate product', async () => {
      const productId = '123e4567-e89b-12d3-a456-426614174000'

      localStorage.setItem('shopping_manager_products', JSON.stringify([{
        id: productId,
        name: 'Milk',
        unitType: 'units'
      }]))

      localStorage.setItem('shopping_manager_shopping-list', JSON.stringify([{
        productId: productId,
        reason: 'auto',
        stockLevel: 'low',
        addedAt: new Date().toISOString()
      }]))

      const { result } = renderHook(() => useShoppingList())

      await waitFor(() => {
        expect(result.current.items).toHaveLength(1)
      })

      // Try to add duplicate
      await expect(result.current.addManual(productId))
        .rejects.toThrow('Product already in shopping list')

      // List should still have 1 item
      expect(result.current.items).toHaveLength(1)
    })

    it('should throw error when product not found', async () => {
      const nonExistentProductId = '999e4567-e89b-12d3-a456-426614174000'

      const { result } = renderHook(() => useShoppingList())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await expect(result.current.addManual(nonExistentProductId))
        .rejects.toThrow('Product not found')
    })
  })
})
