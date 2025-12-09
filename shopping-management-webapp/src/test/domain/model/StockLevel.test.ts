import { describe, it, expect } from 'vitest'
import { StockLevel } from '../../../domain/model/StockLevel'

describe('StockLevel', () => {
  it('should create StockLevel with valid high value', () => {
    const level = StockLevel.create('high')

    expect(level.value).toBe('high')
  })

  it('should create StockLevel with valid medium value', () => {
    const level = StockLevel.create('medium')

    expect(level.value).toBe('medium')
  })

  it('should create StockLevel with valid low value', () => {
    const level = StockLevel.create('low')

    expect(level.value).toBe('low')
  })

  it('should create StockLevel with valid empty value', () => {
    const level = StockLevel.create('empty')

    expect(level.value).toBe('empty')
  })

  it('should throw error for invalid stock level', () => {
    expect(() => StockLevel.create('invalid')).toThrow('Invalid stock level')
  })

  it('should be equal to another StockLevel with same value', () => {
    const level1 = StockLevel.create('high')
    const level2 = StockLevel.create('high')

    expect(level1.equals(level2)).toBe(true)
  })

  it('should not be equal to another StockLevel with different value', () => {
    const level1 = StockLevel.create('high')
    const level2 = StockLevel.create('low')

    expect(level1.equals(level2)).toBe(false)
  })

  it('should return string representation', () => {
    const level = StockLevel.create('medium')

    expect(level.toString()).toBe('medium')
  })
})