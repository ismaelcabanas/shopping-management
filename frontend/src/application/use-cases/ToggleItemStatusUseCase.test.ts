import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ToggleItemStatusUseCase } from './ToggleItemStatusUseCase'
import type { ShoppingListRepository } from '../../domain/repositories/ShoppingListRepository'
import type { ShoppingListItem } from '../../domain/entities/ShoppingListItem'
import { ItemStatusVO } from '../../domain/value-objects/ItemStatus'
import { Quantity } from '../../domain/value-objects/Quantity'

describe('ToggleItemStatusUseCase', () => {
  let useCase: ToggleItemStatusUseCase
  let mockRepository: ShoppingListRepository

  // Test data factory
  const createTestItem = (id: string = '1', status: 'needed' | 'bought' = 'needed'): ShoppingListItem => ({
    id,
    productName: 'Test Product',
    quantity: Quantity.create(5),
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

    useCase = new ToggleItemStatusUseCase(mockRepository)
  })

  describe('Successful Toggle', () => {
    it('should toggle status from needed to bought', async () => {
      // Arrange
      const existingItem = createTestItem('item-1', 'needed')

      vi.mocked(mockRepository.findById).mockResolvedValue(existingItem)
      vi.mocked(mockRepository.update).mockResolvedValue()

      // Act
      await useCase.execute('item-1')

      // Assert
      expect(mockRepository.findById).toHaveBeenCalledWith('item-1')
      expect(mockRepository.findById).toHaveBeenCalledTimes(1)

      expect(mockRepository.update).toHaveBeenCalledTimes(1)
      const updatedItemCall = vi.mocked(mockRepository.update).mock.calls[0][0]

      // Verify the toggled status
      expect(updatedItemCall.id).toBe('item-1')
      expect(updatedItemCall.status.getValue()).toBe('bought')
      expect(updatedItemCall.status.isBought()).toBe(true)
      expect(updatedItemCall.status.isNeeded()).toBe(false)
      expect(updatedItemCall.updatedAt).toBeInstanceOf(Date)
      expect(updatedItemCall.updatedAt).not.toEqual(existingItem.updatedAt)
    })

    it('should toggle status from bought to needed', async () => {
      // Arrange
      const existingItem = createTestItem('item-2', 'bought')

      vi.mocked(mockRepository.findById).mockResolvedValue(existingItem)
      vi.mocked(mockRepository.update).mockResolvedValue()

      // Act
      await useCase.execute('item-2')

      // Assert
      expect(mockRepository.findById).toHaveBeenCalledWith('item-2')
      expect(mockRepository.findById).toHaveBeenCalledTimes(1)

      expect(mockRepository.update).toHaveBeenCalledTimes(1)
      const updatedItemCall = vi.mocked(mockRepository.update).mock.calls[0][0]

      // Verify the toggled status
      expect(updatedItemCall.id).toBe('item-2')
      expect(updatedItemCall.status.getValue()).toBe('needed')
      expect(updatedItemCall.status.isNeeded()).toBe(true)
      expect(updatedItemCall.status.isBought()).toBe(false)
      expect(updatedItemCall.updatedAt).toBeInstanceOf(Date)
      expect(updatedItemCall.updatedAt).not.toEqual(existingItem.updatedAt)
    })

    it('should preserve all other item properties when toggling status', async () => {
      // Arrange
      const existingItem = createTestItem('special-id', 'needed')
      existingItem.productName = 'Special Product'
      existingItem.quantity = Quantity.create(10)
      existingItem.unit = 'kg'

      vi.mocked(mockRepository.findById).mockResolvedValue(existingItem)
      vi.mocked(mockRepository.update).mockResolvedValue()

      // Act
      await useCase.execute('special-id')

      // Assert
      const updatedItemCall = vi.mocked(mockRepository.update).mock.calls[0][0]
      expect(updatedItemCall.id).toBe('special-id')
      expect(updatedItemCall.productName).toBe('Special Product')
      expect(updatedItemCall.quantity.getValue()).toBe(10)
      expect(updatedItemCall.unit).toBe('kg')
      expect(updatedItemCall.status.getValue()).toBe('bought') // Toggled from needed
    })
  })

  describe('Error Cases', () => {
    it('should throw error when item not found', async () => {
      // Arrange
      vi.mocked(mockRepository.findById).mockResolvedValue(null)

      // Act & Assert
      await expect(
        useCase.execute('non-existent-id')
      ).rejects.toThrow('Shopping list item with id non-existent-id not found')

      expect(mockRepository.findById).toHaveBeenCalledWith('non-existent-id')
      expect(mockRepository.update).not.toHaveBeenCalled()
    })
  })

  describe('Repository Integration', () => {
    it('should handle repository update errors gracefully', async () => {
      // Arrange
      const existingItem = createTestItem('item-1', 'needed')
      vi.mocked(mockRepository.findById).mockResolvedValue(existingItem)
      vi.mocked(mockRepository.update).mockRejectedValue(new Error('Database error'))

      // Act & Assert
      await expect(
        useCase.execute('item-1')
      ).rejects.toThrow('Database error')

      expect(mockRepository.findById).toHaveBeenCalledWith('item-1')
      expect(mockRepository.update).toHaveBeenCalledTimes(1)
    })

    it('should handle findById repository errors', async () => {
      // Arrange
      vi.mocked(mockRepository.findById).mockRejectedValue(new Error('Connection error'))

      // Act & Assert
      await expect(
        useCase.execute('item-1')
      ).rejects.toThrow('Connection error')

      expect(mockRepository.findById).toHaveBeenCalledWith('item-1')
      expect(mockRepository.update).not.toHaveBeenCalled()
    })
  })

  describe('Toggle Logic Verification', () => {
    it('should use domain value object toggle logic correctly', async () => {
      // Arrange
      const neededItem = createTestItem('item-1', 'needed')
      const boughtItem = createTestItem('item-2', 'bought')

      vi.mocked(mockRepository.findById)
        .mockResolvedValueOnce(neededItem)
        .mockResolvedValueOnce(boughtItem)
      vi.mocked(mockRepository.update).mockResolvedValue()

      // Act - Toggle needed item
      await useCase.execute('item-1')

      // Act - Toggle bought item
      await useCase.execute('item-2')

      // Assert
      expect(mockRepository.update).toHaveBeenCalledTimes(2)

      const firstUpdateCall = vi.mocked(mockRepository.update).mock.calls[0][0]
      const secondUpdateCall = vi.mocked(mockRepository.update).mock.calls[1][0]

      expect(firstUpdateCall.status.getValue()).toBe('bought')
      expect(secondUpdateCall.status.getValue()).toBe('needed')
    })
  })
})