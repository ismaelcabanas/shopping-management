/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'

// Create hoisted mocks
const { mockGetAllItems, mockUpdateQuantity, mockToggleItemStatus, mockMarkAllAsBought, mockClearList } = vi.hoisted(() => ({
  mockGetAllItems: vi.fn(),
  mockUpdateQuantity: vi.fn(),
  mockToggleItemStatus: vi.fn(),
  mockMarkAllAsBought: vi.fn(),
  mockClearList: vi.fn()
}))

// Mock the ShoppingListService
vi.mock('../../../application/services/ShoppingListService', () => ({
  ShoppingListService: vi.fn(() => ({
    getAllItems: mockGetAllItems,
    updateQuantity: mockUpdateQuantity,
    toggleItemStatus: mockToggleItemStatus,
    markAllAsBought: mockMarkAllAsBought,
    clearList: mockClearList
  }))
}))

// Mock the MockShoppingListRepository
vi.mock('../../../infrastructure/repositories/MockShoppingListRepository', () => ({
  MockShoppingListRepository: vi.fn()
}))

// Import after mocking
import { useShoppingList } from '../../../presentation/hooks/useShoppingList'
import { Quantity } from '../../../domain/value-objects/Quantity'
import { ItemStatusVO } from '../../../domain/value-objects/ItemStatus'

describe('useShoppingList Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Default successful mock responses
    mockGetAllItems.mockResolvedValue([])
    mockUpdateQuantity.mockResolvedValue(undefined)
    mockToggleItemStatus.mockResolvedValue(undefined)
    mockMarkAllAsBought.mockResolvedValue(undefined)
    mockClearList.mockResolvedValue(undefined)
  })

  describe('Initial State', () => {
    it('should initialize with correct initial state', async () => {
      const { result } = renderHook(() => useShoppingList())

      // Initial state should be loading
      expect(result.current.loading).toBe(true)
      expect(result.current.items).toEqual([])
      expect(result.current.neededItems).toEqual([])
      expect(result.current.boughtItems).toEqual([])

      // Wait for loading to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
    })

    it('should provide all expected methods', async () => {
      const { result } = renderHook(() => useShoppingList())

      expect(typeof result.current.updateItemQuantity).toBe('function')
      expect(typeof result.current.toggleItemStatus).toBe('function')
      expect(typeof result.current.markAllAsBought).toBe('function')
      expect(typeof result.current.clearList).toBe('function')
      expect(typeof result.current.refresh).toBe('function')

      // Wait for any async effects to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
    })
  })

  describe('Data Loading', () => {
    it('should load items on mount', async () => {
      const mockItems = [
        {
          id: '1',
          productName: 'Test Item',
          quantity: Quantity.create(1),
          unit: 'ud',
          status: ItemStatusVO.needed(),
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01')
        }
      ]

      mockGetAllItems.mockResolvedValue(mockItems)

      const { result } = renderHook(() => useShoppingList())

      // Should call getAllItems on mount
      expect(mockGetAllItems).toHaveBeenCalledTimes(1)

      // Wait for data to load
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      await waitFor(() => {
        expect(result.current.items).toEqual(mockItems)
      })
    })

    it('should handle empty items list', async () => {
      mockGetAllItems.mockResolvedValue([])

      const { result } = renderHook(() => useShoppingList())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.items).toEqual([])
      expect(result.current.neededItems).toEqual([])
      expect(result.current.boughtItems).toEqual([])
    })
  })

  describe('Item Filtering', () => {
    it('should filter needed and bought items correctly', async () => {
      const mockItems = [
        {
          id: '1',
          productName: 'Needed Item',
          quantity: Quantity.create(1),
          unit: 'ud',
          status: ItemStatusVO.needed(),
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01')
        },
        {
          id: '2',
          productName: 'Bought Item',
          quantity: Quantity.create(2),
          unit: 'kg',
          status: ItemStatusVO.bought(),
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01')
        }
      ]

      mockGetAllItems.mockResolvedValue(mockItems)

      const { result } = renderHook(() => useShoppingList())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      await waitFor(() => {
        expect(result.current.items).toHaveLength(2)
        expect(result.current.neededItems).toHaveLength(1)
        expect(result.current.boughtItems).toHaveLength(1)
      })

      expect(result.current.neededItems[0].productName).toBe('Needed Item')
      expect(result.current.boughtItems[0].productName).toBe('Bought Item')
    })
  })
})