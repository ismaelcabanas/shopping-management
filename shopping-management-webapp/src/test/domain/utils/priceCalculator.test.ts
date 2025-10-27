import { describe, it, expect } from 'vitest'
import { calculateTotal, formatPrice, needsRestock } from '../../../domain/utils/priceCalculator'

describe('Price Calculator - Unit Tests', () => {
  describe('calculateTotal', () => {
    it('should calculate the total of items correctly', () => {
      const items = [
        { price: 10, quantity: 2 },
        { price: 5, quantity: 3 },
      ]

      const result = calculateTotal(items)

      expect(result).toBe(35) // (10*2) + (5*3) = 35
    })

    it('should return 0 for an empty array', () => {
      const result = calculateTotal([])
      expect(result).toBe(0)
    })

    it('should handle decimal quantities', () => {
      const items = [{ price: 2.5, quantity: 1.5 }]
      const result = calculateTotal(items)
      expect(result).toBeCloseTo(3.75)
    })
  })

  describe('formatPrice', () => {
    it('should format price with 2 decimals and euro symbol by default', () => {
      const result = formatPrice(10.5)
      expect(result).toBe('10.50 €')
    })

    it('should allow specifying a different currency', () => {
      const result = formatPrice(25.99, '$')
      expect(result).toBe('25.99 $')
    })

    it('should round to 2 decimal places', () => {
      const result = formatPrice(10.556)
      expect(result).toBe('10.56 €')
    })
  })

  describe('needsRestock', () => {
    it('should return true when current stock is less than minimum', () => {
      const result = needsRestock(5, 10)
      expect(result).toBe(true)
    })

    it('should return true when current stock equals minimum', () => {
      const result = needsRestock(10, 10)
      expect(result).toBe(true)
    })

    it('should return false when current stock is greater than minimum', () => {
      const result = needsRestock(15, 10)
      expect(result).toBe(false)
    })
  })
})
