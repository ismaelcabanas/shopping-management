import { describe, it, expect } from 'vitest'
import { StockLevelCalculator } from '../../../domain/services/StockLevelCalculator'
import { StockLevel } from '../../../domain/model/StockLevel'

describe('StockLevelCalculator', () => {
  const calculator = new StockLevelCalculator()

  describe('shouldAddToShoppingList', () => {
    it('should return false for high stock level', () => {
      const level = StockLevel.create('high')

      const result = calculator.shouldAddToShoppingList(level)

      expect(result).toBe(false)
    })

    it('should return false for medium stock level', () => {
      const level = StockLevel.create('medium')

      const result = calculator.shouldAddToShoppingList(level)

      expect(result).toBe(false)
    })

    it('should return true for low stock level', () => {
      const level = StockLevel.create('low')

      const result = calculator.shouldAddToShoppingList(level)

      expect(result).toBe(true)
    })

    it('should return true for empty stock level', () => {
      const level = StockLevel.create('empty')

      const result = calculator.shouldAddToShoppingList(level)

      expect(result).toBe(true)
    })
  })

  describe('getLevelColor', () => {
    it('should return green for high level', () => {
      const level = StockLevel.create('high')

      const color = calculator.getLevelColor(level)

      expect(color).toBe('green')
    })

    it('should return yellow for medium level', () => {
      const level = StockLevel.create('medium')

      const color = calculator.getLevelColor(level)

      expect(color).toBe('yellow')
    })

    it('should return red for low level', () => {
      const level = StockLevel.create('low')

      const color = calculator.getLevelColor(level)

      expect(color).toBe('red')
    })

    it('should return gray for empty level', () => {
      const level = StockLevel.create('empty')

      const color = calculator.getLevelColor(level)

      expect(color).toBe('gray')
    })
  })

  describe('getLevelPercentage', () => {
    it('should return 87.5 (midpoint between 75-100) for high level', () => {
      const level = StockLevel.create('high')

      const percentage = calculator.getLevelPercentage(level)

      expect(percentage).toBe(87.5)
    })

    it('should return 50 (midpoint between 25-75) for medium level', () => {
      const level = StockLevel.create('medium')

      const percentage = calculator.getLevelPercentage(level)

      expect(percentage).toBe(50)
    })

    it('should return 12.5 (midpoint between 0-25) for low level', () => {
      const level = StockLevel.create('low')

      const percentage = calculator.getLevelPercentage(level)

      expect(percentage).toBe(12.5)
    })

    it('should return 0 for empty level', () => {
      const level = StockLevel.create('empty')

      const percentage = calculator.getLevelPercentage(level)

      expect(percentage).toBe(0)
    })
  })
})