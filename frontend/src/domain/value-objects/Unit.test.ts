import { describe, it, expect } from 'vitest'
import { Unit } from './Unit'

describe('Unit Value Object', () => {
  describe('Creation', () => {
    it('should create unit with valid value', () => {
      const unit = Unit.create('kg')

      expect(unit.getValue()).toBe('kg')
    })

    it('should reject invalid unit values', () => {
      expect(() => Unit.create('invalid')).toThrow('Invalid unit: invalid. Valid units: ud, kg, L, g, ml')
      expect(() => Unit.create('')).toThrow('Invalid unit: . Valid units: ud, kg, L, g, ml')
      expect(() => Unit.create('KG')).toThrow('Invalid unit: KG. Valid units: ud, kg, L, g, ml')
    })

    it('should be case sensitive', () => {
      expect(() => Unit.create('l')).toThrow('Invalid unit: l. Valid units: ud, kg, L, g, ml')
      expect(() => Unit.create('G')).toThrow('Invalid unit: G. Valid units: ud, kg, L, g, ml')
    })
  })

  describe('Factory Methods', () => {
    it('should create units factory method', () => {
      const unit = Unit.units()

      expect(unit.getValue()).toBe('ud')
    })

    it('should create kilograms factory method', () => {
      const unit = Unit.kilograms()

      expect(unit.getValue()).toBe('kg')
    })

    it('should create liters factory method', () => {
      const unit = Unit.liters()

      expect(unit.getValue()).toBe('L')
    })

    it('should create grams factory method', () => {
      const unit = Unit.grams()

      expect(unit.getValue()).toBe('g')
    })

    it('should create milliliters factory method', () => {
      const unit = Unit.milliliters()

      expect(unit.getValue()).toBe('ml')
    })
  })

  describe('Valid Units', () => {
    it('should accept all valid unit types', () => {
      const validUnits = ['ud', 'kg', 'L', 'g', 'ml']

      validUnits.forEach(unitValue => {
        expect(() => Unit.create(unitValue)).not.toThrow()

        const unit = Unit.create(unitValue)
        expect(unit.getValue()).toBe(unitValue)
      })
    })

    it('should provide list of valid units', () => {
      const validUnits = Unit.getValidUnits()

      expect(validUnits).toEqual(['ud', 'kg', 'L', 'g', 'ml'])
      expect(validUnits).toHaveLength(5)
    })

    it('should return readonly array of valid units', () => {
      const validUnits = Unit.getValidUnits()

      // This should not compile if the array is truly readonly,
      // but we can test that it contains the expected values
      expect(Array.isArray(validUnits)).toBe(true)
      expect(validUnits.includes('ud')).toBe(true)
      expect(validUnits.includes('kg')).toBe(true)
      expect(validUnits.includes('L')).toBe(true)
      expect(validUnits.includes('g')).toBe(true)
      expect(validUnits.includes('ml')).toBe(true)
    })
  })

  describe('Equality', () => {
    it('should consider units with same value as equal', () => {
      const unit1 = Unit.create('kg')
      const unit2 = Unit.create('kg')

      expect(unit1.equals(unit2)).toBe(true)
    })

    it('should consider units with different values as not equal', () => {
      const unit1 = Unit.create('kg')
      const unit2 = Unit.create('L')

      expect(unit1.equals(unit2)).toBe(false)
    })

    it('should handle equality between factory and create methods', () => {
      const unitFromFactory = Unit.kilograms()
      const unitFromCreate = Unit.create('kg')

      expect(unitFromFactory.equals(unitFromCreate)).toBe(true)
    })

    it('should test all factory methods for equality', () => {
      expect(Unit.units().equals(Unit.create('ud'))).toBe(true)
      expect(Unit.kilograms().equals(Unit.create('kg'))).toBe(true)
      expect(Unit.liters().equals(Unit.create('L'))).toBe(true)
      expect(Unit.grams().equals(Unit.create('g'))).toBe(true)
      expect(Unit.milliliters().equals(Unit.create('ml'))).toBe(true)
    })
  })

  describe('String Representation', () => {
    it('should convert unit to string', () => {
      const unit = Unit.create('kg')

      expect(unit.toString()).toBe('kg')
    })

    it('should handle all unit types in string conversion', () => {
      const units = ['ud', 'kg', 'L', 'g', 'ml']

      units.forEach(unitValue => {
        const unit = Unit.create(unitValue)
        expect(unit.toString()).toBe(unitValue)
      })
    })

    it('should match getValue() output with toString()', () => {
      const unit = Unit.liters()

      expect(unit.toString()).toBe(unit.getValue())
    })
  })
})