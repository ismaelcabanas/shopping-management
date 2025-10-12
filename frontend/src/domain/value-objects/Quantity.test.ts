import { describe, it, expect } from 'vitest'
import { Quantity } from './Quantity'

describe('Quantity Value Object', () => {
  describe('Creation', () => {
    it('should create valid positive integer quantity', () => {
      const quantity = Quantity.create(5)

      expect(quantity.getValue()).toBe(5)
    })

    it('should reject zero quantity', () => {
      expect(() => Quantity.create(0)).toThrow('Quantity must be positive')
    })

    it('should reject negative quantities', () => {
      expect(() => Quantity.create(-1)).toThrow('Quantity must be positive')
      expect(() => Quantity.create(-10)).toThrow('Quantity must be positive')
    })

    it('should reject non-integer quantities', () => {
      expect(() => Quantity.create(1.5)).toThrow('Quantity must be an integer')
      expect(() => Quantity.create(3.14)).toThrow('Quantity must be an integer')
      expect(() => Quantity.create(0.1)).toThrow('Quantity must be an integer')
    })
  })

  describe('String Creation', () => {
    it('should create quantity from valid numeric string', () => {
      const quantity = Quantity.fromString('10')

      expect(quantity.getValue()).toBe(10)
    })

    it('should handle leading zeros in strings', () => {
      const quantity = Quantity.fromString('007')

      expect(quantity.getValue()).toBe(7)
    })

    it('should reject non-numeric strings', () => {
      expect(() => Quantity.fromString('abc')).toThrow('Invalid quantity: abc')
      expect(() => Quantity.fromString('')).toThrow('Invalid quantity: ')
      expect(() => Quantity.fromString('not-a-number')).toThrow('Invalid quantity: not-a-number')
    })

    it('should handle decimal strings by truncating (parseInt behavior)', () => {
      // Note: This documents the current parseInt behavior
      // parseInt('10.5') returns 10, which then passes validation
      const quantity = Quantity.fromString('10.5')
      expect(quantity.getValue()).toBe(10)
    })

    it('should reject string representations of invalid numbers', () => {
      expect(() => Quantity.fromString('0')).toThrow('Quantity must be positive')
      expect(() => Quantity.fromString('-5')).toThrow('Quantity must be positive')
    })
  })

  describe('Addition', () => {
    it('should add quantities correctly', () => {
      const qty1 = Quantity.create(3)
      const qty2 = Quantity.create(7)
      const result = qty1.add(qty2)

      expect(result.getValue()).toBe(10)
    })

    it('should not mutate original quantities when adding', () => {
      const qty1 = Quantity.create(3)
      const qty2 = Quantity.create(7)
      const result = qty1.add(qty2)

      expect(qty1.getValue()).toBe(3)
      expect(qty2.getValue()).toBe(7)
      expect(result.getValue()).toBe(10)
    })

    it('should handle adding large quantities', () => {
      const qty1 = Quantity.create(1000)
      const qty2 = Quantity.create(5000)
      const result = qty1.add(qty2)

      expect(result.getValue()).toBe(6000)
    })
  })

  describe('Subtraction', () => {
    it('should subtract quantities correctly when result is positive', () => {
      const qty1 = Quantity.create(10)
      const qty2 = Quantity.create(3)
      const result = qty1.subtract(qty2)

      expect(result.getValue()).toBe(7)
    })

    it('should not mutate original quantities when subtracting', () => {
      const qty1 = Quantity.create(10)
      const qty2 = Quantity.create(3)
      const result = qty1.subtract(qty2)

      expect(qty1.getValue()).toBe(10)
      expect(qty2.getValue()).toBe(3)
      expect(result.getValue()).toBe(7)
    })

    it('should prevent subtraction resulting in zero', () => {
      const qty1 = Quantity.create(5)
      const qty2 = Quantity.create(5)

      expect(() => qty1.subtract(qty2)).toThrow('Resulting quantity must be positive')
    })

    it('should prevent subtraction resulting in negative numbers', () => {
      const qty1 = Quantity.create(3)
      const qty2 = Quantity.create(7)

      expect(() => qty1.subtract(qty2)).toThrow('Resulting quantity must be positive')
    })
  })

  describe('Equality', () => {
    it('should consider quantities with same value as equal', () => {
      const qty1 = Quantity.create(5)
      const qty2 = Quantity.create(5)

      expect(qty1.equals(qty2)).toBe(true)
    })

    it('should consider quantities with different values as not equal', () => {
      const qty1 = Quantity.create(5)
      const qty2 = Quantity.create(10)

      expect(qty1.equals(qty2)).toBe(false)
    })

    it('should handle equality between string-created and factory-created quantities', () => {
      const qtyFromFactory = Quantity.create(42)
      const qtyFromString = Quantity.fromString('42')

      expect(qtyFromFactory.equals(qtyFromString)).toBe(true)
    })
  })

  describe('String Representation', () => {
    it('should convert quantity to string', () => {
      const quantity = Quantity.create(25)

      expect(quantity.toString()).toBe('25')
    })

    it('should handle large numbers in string conversion', () => {
      const quantity = Quantity.create(999999)

      expect(quantity.toString()).toBe('999999')
    })
  })
})