import { describe, it, expect, vi, beforeEach } from 'vitest'
import { UpdateQuantityUseCase } from '../../../application/use-cases/UpdateQuantityUseCase'
import type { ShoppingListRepository } from '../../../domain/repositories/ShoppingListRepository'
import type { ShoppingListItem } from '../../../domain/entities/ShoppingListItem'
import { ItemStatusVO } from '../../../domain/value-objects/ItemStatus'
import { Quantity } from '../../../domain/value-objects/Quantity'

describe('UpdateQuantityUseCase', () => {
  let useCase: UpdateQuantityUseCase
  let mockRepository: ShoppingListRepository

  // Test data factory
  const createTestItem = (id: string = '1', quantity: number = 5): ShoppingListItem => ({
    id,
    productName: 'Test Product',
    quantity: Quantity.create(quantity),
    unit: 'ud',
    status: ItemStatusVO.needed(),
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

    useCase = new UpdateQuantityUseCase(mockRepository)
  })

  describe('Successful Update', () => {
    it('should update item quantity successfully', async () => {
      // Arrange
      const existingItem = createTestItem('item-1', 3)
      const newQuantityValue = 7

      vi.mocked(mockRepository.findById).mockResolvedValue(existingItem)
      vi.mocked(mockRepository.update).mockResolvedValue()

      // Act
      await useCase.execute('item-1', newQuantityValue)

      // Assert
      expect(mockRepository.findById).toHaveBeenCalledWith('item-1')
      expect(mockRepository.findById).toHaveBeenCalledTimes(1)

      expect(mockRepository.update).toHaveBeenCalledTimes(1)
      const updatedItemCall = vi.mocked(mockRepository.update).mock.calls[0][0]

      // Verify the updated item properties
      expect(updatedItemCall.id).toBe('item-1')
      expect(updatedItemCall.productName).toBe('Test Product')
      expect(updatedItemCall.quantity.getValue()).toBe(newQuantityValue)
      expect(updatedItemCall.unit).toBe('ud')
      expect(updatedItemCall.status.getValue()).toBe('needed')
      expect(updatedItemCall.updatedAt).toBeInstanceOf(Date)
      expect(updatedItemCall.updatedAt).not.toEqual(existingItem.updatedAt)
    })

    it('should preserve all other item properties when updating quantity', async () => {
      // Arrange
      const existingItem = createTestItem('special-id', 10)
      existingItem.productName = 'Special Product'
      existingItem.unit = 'kg'
      existingItem.status = ItemStatusVO.bought()

      vi.mocked(mockRepository.findById).mockResolvedValue(existingItem)
      vi.mocked(mockRepository.update).mockResolvedValue()

      // Act
      await useCase.execute('special-id', 15)

      // Assert
      const updatedItemCall = vi.mocked(mockRepository.update).mock.calls[0][0]
      expect(updatedItemCall.id).toBe('special-id')
      expect(updatedItemCall.productName).toBe('Special Product')
      expect(updatedItemCall.unit).toBe('kg')
      expect(updatedItemCall.status.getValue()).toBe('bought')
      expect(updatedItemCall.quantity.getValue()).toBe(15)
    })
  })

  describe('Error Cases', () => {
    it('should throw error when item not found', async () => {
      // Arrange
      vi.mocked(mockRepository.findById).mockResolvedValue(null)

      // Act & Assert
      await expect(
        useCase.execute('non-existent-id', 5)
      ).rejects.toThrow('Shopping list item with id non-existent-id not found')

      expect(mockRepository.findById).toHaveBeenCalledWith('non-existent-id')
      expect(mockRepository.update).not.toHaveBeenCalled()
    })

    it('should throw error for invalid quantity values', async () => {
      // Arrange
      const existingItem = createTestItem('item-1', 3)
      vi.mocked(mockRepository.findById).mockResolvedValue(existingItem)

      // Act & Assert - Test zero quantity
      await expect(
        useCase.execute('item-1', 0)
      ).rejects.toThrow('Quantity must be positive')

      // Act & Assert - Test negative quantity
      await expect(
        useCase.execute('item-1', -5)
      ).rejects.toThrow('Quantity must be positive')

      // Act & Assert - Test decimal quantity
      await expect(
        useCase.execute('item-1', 2.5)
      ).rejects.toThrow('Quantity must be an integer')

      expect(mockRepository.update).not.toHaveBeenCalled()
    })
  })

  describe('Repository Integration', () => {
    it('should handle repository errors gracefully', async () => {
      // Arrange
      const existingItem = createTestItem('item-1', 3)
      vi.mocked(mockRepository.findById).mockResolvedValue(existingItem)
      vi.mocked(mockRepository.update).mockRejectedValue(new Error('Database error'))

      // Act & Assert
      await expect(
        useCase.execute('item-1', 7)
      ).rejects.toThrow('Database error')

      expect(mockRepository.findById).toHaveBeenCalledWith('item-1')
      expect(mockRepository.update).toHaveBeenCalledTimes(1)
    })

    it('should handle findById repository errors', async () => {
      // Arrange
      vi.mocked(mockRepository.findById).mockRejectedValue(new Error('Connection error'))

      // Act & Assert
      await expect(
        useCase.execute('item-1', 7)
      ).rejects.toThrow('Connection error')

      expect(mockRepository.findById).toHaveBeenCalledWith('item-1')
      expect(mockRepository.update).not.toHaveBeenCalled()
    })
  })
})