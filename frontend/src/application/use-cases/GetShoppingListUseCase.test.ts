import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GetShoppingListUseCase } from './GetShoppingListUseCase'
import type { ShoppingListRepository } from '../../domain/repositories/ShoppingListRepository'
import type { ShoppingListItem } from '../../domain/entities/ShoppingListItem'
import { ItemStatusVO } from '../../domain/value-objects/ItemStatus'
import { Quantity } from '../../domain/value-objects/Quantity'

describe('GetShoppingListUseCase', () => {
  let useCase: GetShoppingListUseCase
  let mockRepository: ShoppingListRepository

  // Test data factory
  const createTestItem = (
    id: string,
    productName: string,
    status: 'needed' | 'bought' = 'needed',
    quantity: number = 1
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
    mockRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      save: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      markAllAsBought: vi.fn(),
      markAllAsNeeded: vi.fn()
    }

    useCase = new GetShoppingListUseCase(mockRepository)
  })

  describe('Get All Items', () => {
    it('should return all items from repository', async () => {
      // Arrange
      const testItems = [
        createTestItem('1', 'Apples', 'needed', 5),
        createTestItem('2', 'Bread', 'bought', 2),
        createTestItem('3', 'Milk', 'needed', 1)
      ]

      vi.mocked(mockRepository.findAll).mockResolvedValue(testItems)

      // Act
      const result = await useCase.execute()

      // Assert
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1)
      expect(result).toEqual(testItems)
      expect(result).toHaveLength(3)
    })

    it('should return empty array when no items exist', async () => {
      // Arrange
      vi.mocked(mockRepository.findAll).mockResolvedValue([])

      // Act
      const result = await useCase.execute()

      // Assert
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1)
      expect(result).toEqual([])
      expect(result).toHaveLength(0)
    })

    it('should handle repository errors', async () => {
      // Arrange
      vi.mocked(mockRepository.findAll).mockRejectedValue(new Error('Database error'))

      // Act & Assert
      await expect(useCase.execute()).rejects.toThrow('Database error')
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1)
    })
  })

  describe('Get Needed Items', () => {
    it('should return only needed items', async () => {
      // Arrange
      const testItems = [
        createTestItem('1', 'Apples', 'needed', 5),
        createTestItem('2', 'Bread', 'bought', 2),
        createTestItem('3', 'Milk', 'needed', 1),
        createTestItem('4', 'Cheese', 'bought', 3)
      ]

      vi.mocked(mockRepository.findAll).mockResolvedValue(testItems)

      // Act
      const result = await useCase.getNeededItems()

      // Assert
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1)
      expect(result).toHaveLength(2)
      expect(result[0].id).toBe('1')
      expect(result[0].productName).toBe('Apples')
      expect(result[0].status.isNeeded()).toBe(true)
      expect(result[1].id).toBe('3')
      expect(result[1].productName).toBe('Milk')
      expect(result[1].status.isNeeded()).toBe(true)

      // Verify all returned items are needed
      result.forEach(item => {
        expect(item.status.isNeeded()).toBe(true)
        expect(item.status.isBought()).toBe(false)
      })
    })

    it('should return empty array when no needed items exist', async () => {
      // Arrange
      const testItems = [
        createTestItem('1', 'Apples', 'bought', 5),
        createTestItem('2', 'Bread', 'bought', 2)
      ]

      vi.mocked(mockRepository.findAll).mockResolvedValue(testItems)

      // Act
      const result = await useCase.getNeededItems()

      // Assert
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1)
      expect(result).toEqual([])
      expect(result).toHaveLength(0)
    })

    it('should handle repository errors in getNeededItems', async () => {
      // Arrange
      vi.mocked(mockRepository.findAll).mockRejectedValue(new Error('Network error'))

      // Act & Assert
      await expect(useCase.getNeededItems()).rejects.toThrow('Network error')
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1)
    })
  })

  describe('Get Bought Items', () => {
    it('should return only bought items', async () => {
      // Arrange
      const testItems = [
        createTestItem('1', 'Apples', 'needed', 5),
        createTestItem('2', 'Bread', 'bought', 2),
        createTestItem('3', 'Milk', 'needed', 1),
        createTestItem('4', 'Cheese', 'bought', 3)
      ]

      vi.mocked(mockRepository.findAll).mockResolvedValue(testItems)

      // Act
      const result = await useCase.getBoughtItems()

      // Assert
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1)
      expect(result).toHaveLength(2)
      expect(result[0].id).toBe('2')
      expect(result[0].productName).toBe('Bread')
      expect(result[0].status.isBought()).toBe(true)
      expect(result[1].id).toBe('4')
      expect(result[1].productName).toBe('Cheese')
      expect(result[1].status.isBought()).toBe(true)

      // Verify all returned items are bought
      result.forEach(item => {
        expect(item.status.isBought()).toBe(true)
        expect(item.status.isNeeded()).toBe(false)
      })
    })

    it('should return empty array when no bought items exist', async () => {
      // Arrange
      const testItems = [
        createTestItem('1', 'Apples', 'needed', 5),
        createTestItem('2', 'Bread', 'needed', 2)
      ]

      vi.mocked(mockRepository.findAll).mockResolvedValue(testItems)

      // Act
      const result = await useCase.getBoughtItems()

      // Assert
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1)
      expect(result).toEqual([])
      expect(result).toHaveLength(0)
    })

    it('should handle repository errors in getBoughtItems', async () => {
      // Arrange
      vi.mocked(mockRepository.findAll).mockRejectedValue(new Error('Timeout error'))

      // Act & Assert
      await expect(useCase.getBoughtItems()).rejects.toThrow('Timeout error')
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1)
    })
  })

  describe('Filtering Logic Verification', () => {
    it('should use correct domain filtering logic', async () => {
      // Arrange
      const testItems = [
        createTestItem('1', 'Item1', 'needed'),
        createTestItem('2', 'Item2', 'bought'),
        createTestItem('3', 'Item3', 'needed'),
        createTestItem('4', 'Item4', 'bought'),
        createTestItem('5', 'Item5', 'needed')
      ]

      vi.mocked(mockRepository.findAll).mockResolvedValue(testItems)

      // Act
      const allItems = await useCase.execute()
      const neededItems = await useCase.getNeededItems()
      const boughtItems = await useCase.getBoughtItems()

      // Assert
      expect(allItems).toHaveLength(5)
      expect(neededItems).toHaveLength(3)
      expect(boughtItems).toHaveLength(2)

      // Verify correct filtering
      expect(neededItems.every(item => item.status.isNeeded())).toBe(true)
      expect(boughtItems.every(item => item.status.isBought())).toBe(true)

      // Verify no overlap
      const neededIds = neededItems.map(item => item.id)
      const boughtIds = boughtItems.map(item => item.id)
      expect(neededIds.some(id => boughtIds.includes(id))).toBe(false)

      // Verify completeness
      const filteredTotal = neededItems.length + boughtItems.length
      expect(filteredTotal).toBe(allItems.length)
    })
  })

  describe('Multiple Calls Optimization', () => {
    it('should call repository separately for each method (current implementation)', async () => {
      // Arrange
      const testItems = [
        createTestItem('1', 'Item1', 'needed'),
        createTestItem('2', 'Item2', 'bought')
      ]

      vi.mocked(mockRepository.findAll).mockResolvedValue(testItems)

      // Act
      await useCase.getNeededItems()
      await useCase.getBoughtItems()

      // Assert
      expect(mockRepository.findAll).toHaveBeenCalledTimes(2)
    })
  })
})