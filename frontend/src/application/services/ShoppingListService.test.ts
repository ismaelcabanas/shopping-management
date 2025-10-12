import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ShoppingListService } from './ShoppingListService'
import type { ShoppingListRepository } from '../../domain/repositories/ShoppingListRepository'
import type { ShoppingListItem as DomainShoppingListItem } from '../../domain/entities/ShoppingListItem'
import { ItemStatusVO } from '../../domain/value-objects/ItemStatus'
import { Quantity } from '../../domain/value-objects/Quantity'

describe('ShoppingListService', () => {
  let service: ShoppingListService
  let mockRepository: ShoppingListRepository

  // Test data factories
  const createDomainItem = (
    id: string = '1',
    productName: string = 'Test Product',
    quantity: number = 5,
    status: 'needed' | 'bought' = 'needed'
  ): DomainShoppingListItem => ({
    id,
    productName,
    quantity: Quantity.create(quantity),
    unit: 'ud',
    status: status === 'needed' ? ItemStatusVO.needed() : ItemStatusVO.bought(),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  })


  beforeEach(() => {
    mockRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      save: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      markAllAsBought: vi.fn(),
      markAllAsNeeded: vi.fn()
    }

    service = new ShoppingListService(mockRepository)
  })

  describe('Constructor', () => {
    it('should initialize all use cases with the provided repository', () => {
      expect(service).toBeInstanceOf(ShoppingListService)
      // The service should be properly initialized with dependency injection
    })
  })

  describe('Get All Items', () => {
    it('should return all items in domain format', async () => {
      // Arrange
      const domainItems = [
        createDomainItem('1', 'Apples', 5, 'needed'),
        createDomainItem('2', 'Bread', 2, 'bought')
      ]

      vi.mocked(mockRepository.findAll).mockResolvedValue(domainItems)

      // Act
      const result = await service.getAllItems()

      // Assert
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1)
      expect(result).toHaveLength(2)

      // Verify domain format (not legacy format conversion)
      expect(result[0]).toEqual(createDomainItem('1', 'Apples', 5, 'needed'))
      expect(result[1]).toEqual(createDomainItem('2', 'Bread', 2, 'bought'))

      // Verify it's Value Objects (not plain objects)
      expect(result[0].quantity.getValue()).toBe(5)
      expect(result[0].status.getValue()).toBe('needed')
    })

    it('should return empty array when no items exist', async () => {
      // Arrange
      vi.mocked(mockRepository.findAll).mockResolvedValue([])

      // Act
      const result = await service.getAllItems()

      // Assert
      expect(result).toEqual([])
      expect(result).toHaveLength(0)
    })
  })

  describe('Get Needed Items', () => {
    it('should return only needed items in domain format', async () => {
      // Arrange
      const domainItems = [
        createDomainItem('1', 'Apples', 5, 'needed'),
        createDomainItem('2', 'Bread', 2, 'bought'),
        createDomainItem('3', 'Milk', 1, 'needed')
      ]

      vi.mocked(mockRepository.findAll).mockResolvedValue(domainItems)

      // Act
      const result = await service.getNeededItems()

      // Assert
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1)
      expect(result).toHaveLength(2)
      expect(result[0]).toEqual(createDomainItem('1', 'Apples', 5, 'needed'))
      expect(result[1]).toEqual(createDomainItem('3', 'Milk', 1, 'needed'))

      // Verify all returned items are needed
      result.forEach(item => {
        expect(item.status.getValue()).toBe('needed')
      })
    })
  })

  describe('Get Bought Items', () => {
    it('should return only bought items in domain format', async () => {
      // Arrange
      const domainItems = [
        createDomainItem('1', 'Apples', 5, 'needed'),
        createDomainItem('2', 'Bread', 2, 'bought'),
        createDomainItem('3', 'Cheese', 3, 'bought')
      ]

      vi.mocked(mockRepository.findAll).mockResolvedValue(domainItems)

      // Act
      const result = await service.getBoughtItems()

      // Assert
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1)
      expect(result).toHaveLength(2)
      expect(result[0]).toEqual(createDomainItem('2', 'Bread', 2, 'bought'))
      expect(result[1]).toEqual(createDomainItem('3', 'Cheese', 3, 'bought'))

      // Verify all returned items are bought
      result.forEach(item => {
        expect(item.status.getValue()).toBe('bought')
      })
    })
  })

  describe('Update Quantity', () => {
    it('should delegate to UpdateQuantityUseCase', async () => {
      // Arrange
      const existingItem = createDomainItem('item-1', 'Test Product', 3)
      vi.mocked(mockRepository.findById).mockResolvedValue(existingItem)
      vi.mocked(mockRepository.update).mockResolvedValue()

      // Act
      await service.updateQuantity('item-1', 7)

      // Assert
      expect(mockRepository.findById).toHaveBeenCalledWith('item-1')
      expect(mockRepository.update).toHaveBeenCalledTimes(1)

      const updatedItemCall = vi.mocked(mockRepository.update).mock.calls[0][0]
      expect(updatedItemCall.quantity.getValue()).toBe(7)
    })

    it('should handle update quantity errors', async () => {
      // Arrange
      vi.mocked(mockRepository.findById).mockResolvedValue(null)

      // Act & Assert
      await expect(
        service.updateQuantity('non-existent', 5)
      ).rejects.toThrow('Shopping list item with id non-existent not found')
    })
  })

  describe('Toggle Item Status', () => {
    it('should delegate to ToggleItemStatusUseCase', async () => {
      // Arrange
      const existingItem = createDomainItem('item-1', 'Test Product', 3, 'needed')
      vi.mocked(mockRepository.findById).mockResolvedValue(existingItem)
      vi.mocked(mockRepository.update).mockResolvedValue()

      // Act
      await service.toggleItemStatus('item-1')

      // Assert
      expect(mockRepository.findById).toHaveBeenCalledWith('item-1')
      expect(mockRepository.update).toHaveBeenCalledTimes(1)

      const updatedItemCall = vi.mocked(mockRepository.update).mock.calls[0][0]
      expect(updatedItemCall.status.getValue()).toBe('bought')
    })

    it('should handle toggle status errors', async () => {
      // Arrange
      vi.mocked(mockRepository.findById).mockResolvedValue(null)

      // Act & Assert
      await expect(
        service.toggleItemStatus('non-existent')
      ).rejects.toThrow('Shopping list item with id non-existent not found')
    })
  })

  describe('Mark All As Bought', () => {
    it('should delegate to BulkActionsUseCase', async () => {
      // Arrange
      vi.mocked(mockRepository.markAllAsBought).mockResolvedValue()

      // Act
      await service.markAllAsBought()

      // Assert
      expect(mockRepository.markAllAsBought).toHaveBeenCalledTimes(1)
    })

    it('should handle bulk actions errors', async () => {
      // Arrange
      vi.mocked(mockRepository.markAllAsBought).mockRejectedValue(new Error('Bulk operation failed'))

      // Act & Assert
      await expect(service.markAllAsBought()).rejects.toThrow('Bulk operation failed')
    })
  })

  describe('Clear List', () => {
    it('should delegate to BulkActionsUseCase clearList method', async () => {
      // Arrange
      vi.mocked(mockRepository.markAllAsNeeded).mockResolvedValue()

      // Act
      await service.clearList()

      // Assert
      expect(mockRepository.markAllAsNeeded).toHaveBeenCalledTimes(1)
    })

    it('should handle clear list errors', async () => {
      // Arrange
      vi.mocked(mockRepository.markAllAsNeeded).mockRejectedValue(new Error('Clear operation failed'))

      // Act & Assert
      await expect(service.clearList()).rejects.toThrow('Clear operation failed')
    })
  })

  describe('Integration Testing', () => {
    it('should coordinate multiple operations correctly', async () => {
      // Arrange
      const domainItems = [
        createDomainItem('1', 'Item1', 5, 'needed'),
        createDomainItem('2', 'Item2', 3, 'bought')
      ]

      vi.mocked(mockRepository.findAll).mockResolvedValue(domainItems)
      vi.mocked(mockRepository.findById).mockResolvedValue(domainItems[0])
      vi.mocked(mockRepository.update).mockResolvedValue()
      vi.mocked(mockRepository.markAllAsBought).mockResolvedValue()

      // Act - Multiple operations
      const allItems = await service.getAllItems()
      await service.updateQuantity('1', 10)
      await service.toggleItemStatus('1')
      await service.markAllAsBought()

      // Assert
      expect(allItems).toHaveLength(2)
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1)
      expect(mockRepository.findById).toHaveBeenCalledTimes(2) // updateQuantity + toggleStatus
      expect(mockRepository.update).toHaveBeenCalledTimes(2)   // updateQuantity + toggleStatus
      expect(mockRepository.markAllAsBought).toHaveBeenCalledTimes(1)
    })

    it('should handle domain format consistency across methods', async () => {
      // Arrange
      const domainItems = [
        createDomainItem('1', 'Mixed Test', 7, 'needed')
      ]

      vi.mocked(mockRepository.findAll).mockResolvedValue(domainItems)

      // Act
      const neededItems = await service.getNeededItems()
      const boughtItems = await service.getBoughtItems()
      const allItems = await service.getAllItems()

      // Assert - All should return domain format
      expect(neededItems).toHaveLength(1)
      expect(boughtItems).toHaveLength(0)
      expect(allItems).toHaveLength(1)

      // Verify format consistency across methods
      expect(neededItems[0]).toEqual(allItems[0])
      expect(neededItems[0].quantity.getValue()).toBe(7)
      expect(neededItems[0].status.getValue()).toBe('needed')
    })
  })

  describe('Error Propagation', () => {
    it('should propagate repository errors from use cases', async () => {
      // Arrange
      vi.mocked(mockRepository.findAll).mockRejectedValue(new Error('Database connection failed'))

      // Act & Assert
      await expect(service.getAllItems()).rejects.toThrow('Database connection failed')
      await expect(service.getNeededItems()).rejects.toThrow('Database connection failed')
      await expect(service.getBoughtItems()).rejects.toThrow('Database connection failed')
    })
  })
})