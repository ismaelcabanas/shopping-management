import { useState, useEffect, useCallback, useMemo } from 'react'
import { ProductId } from '../../domain/model/ProductId'
import { LocalStorageShoppingListRepository } from '../../infrastructure/repositories/LocalStorageShoppingListRepository'
import { LocalStorageProductRepository } from '../../infrastructure/repositories/LocalStorageProductRepository'
import type { StockLevelValue } from '../../domain/model/ShoppingListItem'

export interface ShoppingListItemWithDetails {
  productId: ProductId
  productName: string
  stockLevel?: StockLevelValue
  reason: 'auto' | 'manual'
  addedAt: Date
}

export interface UseShoppingListReturn {
  items: ShoppingListItemWithDetails[]
  isLoading: boolean
  error: Error | null
  markAsPurchased: (productId: ProductId) => Promise<void>
  refresh: () => Promise<void>
}

export function useShoppingList(): UseShoppingListReturn {
  const [items, setItems] = useState<ShoppingListItemWithDetails[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const shoppingListRepository = useMemo(() => new LocalStorageShoppingListRepository(), [])
  const productRepository = useMemo(() => new LocalStorageProductRepository(), [])

  const loadShoppingList = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const shoppingListItems = await shoppingListRepository.findAll()
      const products = await productRepository.findAll()

      // Enrich shopping list items with product details
      const enrichedItems: ShoppingListItemWithDetails[] = shoppingListItems.map(item => {
        const product = products.find(p => p.id.equals(item.productId))

        return {
          productId: item.productId,
          productName: product?.name || 'Producto desconocido',
          stockLevel: item.stockLevel,
          reason: item.reason,
          addedAt: item.addedAt
        }
      })

      setItems(enrichedItems)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load shopping list')
      setError(error)
      setItems([])
    } finally {
      setIsLoading(false)
    }
  }, [shoppingListRepository, productRepository])

  const markAsPurchased = useCallback(async (productId: ProductId): Promise<void> => {
    try {
      await shoppingListRepository.remove(productId)
      // Refresh the list after removing
      await loadShoppingList()
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to mark as purchased')
      setError(error)
    }
  }, [shoppingListRepository, loadShoppingList])

  const refresh = useCallback(async (): Promise<void> => {
    await loadShoppingList()
  }, [loadShoppingList])

  // Load shopping list on mount
  useEffect(() => {
    loadShoppingList()
  }, [loadShoppingList])

  return {
    items,
    isLoading,
    error,
    markAsPurchased,
    refresh
  }
}
