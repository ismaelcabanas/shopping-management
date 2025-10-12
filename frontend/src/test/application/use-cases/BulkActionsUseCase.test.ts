import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BulkActionsUseCase } from '../../../application/use-cases/BulkActionsUseCase'
import type { ShoppingListRepository } from '../../../domain/repositories/ShoppingListRepository'

describe('BulkActionsUseCase', () => {
  let useCase: BulkActionsUseCase
  let mockRepository: ShoppingListRepository

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

    useCase = new BulkActionsUseCase(mockRepository)
  })

  describe('Mark All As Bought', () => {
    it('should call repository markAllAsBought method', async () => {
      // Arrange
      vi.mocked(mockRepository.markAllAsBought).mockResolvedValue()

      // Act
      await useCase.markAllAsBought()

      // Assert
      expect(mockRepository.markAllAsBought).toHaveBeenCalledTimes(1)
      expect(mockRepository.markAllAsBought).toHaveBeenCalledWith()
    })

    it('should handle repository errors in markAllAsBought', async () => {
      // Arrange
      vi.mocked(mockRepository.markAllAsBought).mockRejectedValue(new Error('Database error'))

      // Act & Assert
      await expect(useCase.markAllAsBought()).rejects.toThrow('Database error')
      expect(mockRepository.markAllAsBought).toHaveBeenCalledTimes(1)
    })

    it('should not call other repository methods when marking all as bought', async () => {
      // Arrange
      vi.mocked(mockRepository.markAllAsBought).mockResolvedValue()

      // Act
      await useCase.markAllAsBought()

      // Assert
      expect(mockRepository.markAllAsBought).toHaveBeenCalledTimes(1)
      expect(mockRepository.markAllAsNeeded).not.toHaveBeenCalled()
      expect(mockRepository.findAll).not.toHaveBeenCalled()
      expect(mockRepository.update).not.toHaveBeenCalled()
      expect(mockRepository.save).not.toHaveBeenCalled()
      expect(mockRepository.delete).not.toHaveBeenCalled()
    })
  })

  describe('Clear List (Mark All As Needed)', () => {
    it('should call repository markAllAsNeeded method', async () => {
      // Arrange
      vi.mocked(mockRepository.markAllAsNeeded).mockResolvedValue()

      // Act
      await useCase.clearList()

      // Assert
      expect(mockRepository.markAllAsNeeded).toHaveBeenCalledTimes(1)
      expect(mockRepository.markAllAsNeeded).toHaveBeenCalledWith()
    })

    it('should handle repository errors in clearList', async () => {
      // Arrange
      vi.mocked(mockRepository.markAllAsNeeded).mockRejectedValue(new Error('Connection error'))

      // Act & Assert
      await expect(useCase.clearList()).rejects.toThrow('Connection error')
      expect(mockRepository.markAllAsNeeded).toHaveBeenCalledTimes(1)
    })

    it('should not call other repository methods when clearing list', async () => {
      // Arrange
      vi.mocked(mockRepository.markAllAsNeeded).mockResolvedValue()

      // Act
      await useCase.clearList()

      // Assert
      expect(mockRepository.markAllAsNeeded).toHaveBeenCalledTimes(1)
      expect(mockRepository.markAllAsBought).not.toHaveBeenCalled()
      expect(mockRepository.findAll).not.toHaveBeenCalled()
      expect(mockRepository.update).not.toHaveBeenCalled()
      expect(mockRepository.save).not.toHaveBeenCalled()
      expect(mockRepository.delete).not.toHaveBeenCalled()
    })
  })

  describe('Multiple Operations', () => {
    it('should handle sequential bulk operations', async () => {
      // Arrange
      vi.mocked(mockRepository.markAllAsBought).mockResolvedValue()
      vi.mocked(mockRepository.markAllAsNeeded).mockResolvedValue()

      // Act
      await useCase.markAllAsBought()
      await useCase.clearList()

      // Assert
      expect(mockRepository.markAllAsBought).toHaveBeenCalledTimes(1)
      expect(mockRepository.markAllAsNeeded).toHaveBeenCalledTimes(1)
    })

    it('should handle parallel bulk operations', async () => {
      // Arrange
      vi.mocked(mockRepository.markAllAsBought).mockImplementation(() =>
        new Promise(resolve => setTimeout(resolve, 10))
      )
      vi.mocked(mockRepository.markAllAsNeeded).mockImplementation(() =>
        new Promise(resolve => setTimeout(resolve, 20))
      )

      // Act
      const promise1 = useCase.markAllAsBought()
      const promise2 = useCase.clearList()

      await Promise.all([promise1, promise2])

      // Assert
      expect(mockRepository.markAllAsBought).toHaveBeenCalledTimes(1)
      expect(mockRepository.markAllAsNeeded).toHaveBeenCalledTimes(1)
    })
  })

  describe('Repository Delegation', () => {
    it('should delegate markAllAsBought responsibility to repository', async () => {
      // Arrange
      const mockImplementation = vi.fn().mockResolvedValue(undefined)
      vi.mocked(mockRepository.markAllAsBought).mockImplementation(mockImplementation)

      // Act
      await useCase.markAllAsBought()

      // Assert
      expect(mockImplementation).toHaveBeenCalledTimes(1)
      expect(mockImplementation).toHaveBeenCalledWith()
    })

    it('should delegate markAllAsNeeded responsibility to repository', async () => {
      // Arrange
      const mockImplementation = vi.fn().mockResolvedValue(undefined)
      vi.mocked(mockRepository.markAllAsNeeded).mockImplementation(mockImplementation)

      // Act
      await useCase.clearList()

      // Assert
      expect(mockImplementation).toHaveBeenCalledTimes(1)
      expect(mockImplementation).toHaveBeenCalledWith()
    })
  })

  describe('Error Propagation', () => {
    it('should propagate specific error messages from repository', async () => {
      // Arrange
      const specificError = new Error('Specific database constraint violation')
      vi.mocked(mockRepository.markAllAsBought).mockRejectedValue(specificError)

      // Act & Assert
      await expect(useCase.markAllAsBought()).rejects.toThrow('Specific database constraint violation')
    })

    it('should propagate different error types correctly', async () => {
      // Arrange
      const typeError = new TypeError('Invalid operation')
      const rangeError = new RangeError('Out of bounds')

      vi.mocked(mockRepository.markAllAsBought).mockRejectedValue(typeError)
      vi.mocked(mockRepository.markAllAsNeeded).mockRejectedValue(rangeError)

      // Act & Assert
      await expect(useCase.markAllAsBought()).rejects.toThrow(TypeError)
      await expect(useCase.clearList()).rejects.toThrow(RangeError)
    })
  })
})