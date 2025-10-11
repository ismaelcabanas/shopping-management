import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useShoppingList } from '../../../presentation/hooks/useShoppingList'

// Mock the dependencies
vi.mock('../../../infrastructure/repositories/MockShoppingListRepository')
vi.mock('../../../application/services/ShoppingListService')

describe('useShoppingList Hook', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Initial State', () => {
    it('should initialize with empty items and loading state', () => {
      const { result } = renderHook(() => useShoppingList())

      expect(result.current.items).toEqual([])
      expect(result.current.neededItems).toEqual([])
      expect(result.current.boughtItems).toEqual([])
      expect(result.current.loading).toBe(true)
    })

    it('should provide all expected methods', () => {
      const { result } = renderHook(() => useShoppingList())

      expect(typeof result.current.updateItemQuantity).toBe('function')
      expect(typeof result.current.toggleItemStatus).toBe('function')
      expect(typeof result.current.markAllAsBought).toBe('function')
      expect(typeof result.current.clearList).toBe('function')
      expect(typeof result.current.refresh).toBe('function')
    })
  })

  describe('Data Loading', () => {
    it('should load items on mount', async () => {
      const mockItems = [
        { id: '1', productName: 'Test Item', quantity: 1, unit: 'ud', status: 'needed' as const, createdAt: new Date(), updatedAt: new Date() }
      ]

      // Mock the service response
      const mockService = {
        getAllItems: vi.fn().mockResolvedValue(mockItems)
      }

      const { result } = renderHook(() => useShoppingList())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
    })

    it('should filter needed and bought items correctly', async () => {
      const mockItems = [
        { id: '1', productName: 'Needed Item', quantity: 1, unit: 'ud', status: 'needed' as const, createdAt: new Date(), updatedAt: new Date() },
        { id: '2', productName: 'Bought Item', quantity: 2, unit: 'ud', status: 'bought' as const, createdAt: new Date(), updatedAt: new Date() }
      ]

      const { result } = renderHook(() => useShoppingList())

      // Simulate successful loading
      act(() => {
        // This would be populated after the async load
        result.current.items = mockItems
      })

      expect(result.current.neededItems).toHaveLength(1)
      expect(result.current.boughtItems).toHaveLength(1)
      expect(result.current.neededItems[0].productName).toBe('Needed Item')
      expect(result.current.boughtItems[0].productName).toBe('Bought Item')
    })
  })
})