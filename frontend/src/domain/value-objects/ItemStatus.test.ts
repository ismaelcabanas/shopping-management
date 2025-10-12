import { describe, it, expect } from 'vitest'
import { ItemStatusVO } from './ItemStatus'

describe('ItemStatus Value Object', () => {
  describe('Factory Methods', () => {
    it('should create needed status', () => {
      const status = ItemStatusVO.needed()

      expect(status.getValue()).toBe('needed')
      expect(status.isNeeded()).toBe(true)
      expect(status.isBought()).toBe(false)
    })

    it('should create bought status', () => {
      const status = ItemStatusVO.bought()

      expect(status.getValue()).toBe('bought')
      expect(status.isBought()).toBe(true)
      expect(status.isNeeded()).toBe(false)
    })
  })

  describe('String Creation', () => {
    it('should create from valid string "needed"', () => {
      const status = ItemStatusVO.fromString('needed')

      expect(status.getValue()).toBe('needed')
      expect(status.isNeeded()).toBe(true)
    })

    it('should create from valid string "bought"', () => {
      const status = ItemStatusVO.fromString('bought')

      expect(status.getValue()).toBe('bought')
      expect(status.isBought()).toBe(true)
    })

    it('should throw error for invalid status', () => {
      expect(() => ItemStatusVO.fromString('invalid')).toThrow('Invalid status: invalid')
      expect(() => ItemStatusVO.fromString('')).toThrow('Invalid status: ')
      expect(() => ItemStatusVO.fromString('NEEDED')).toThrow('Invalid status: NEEDED')
    })
  })

  describe('Status Checking', () => {
    it('should correctly identify needed status', () => {
      const needed = ItemStatusVO.needed()

      expect(needed.isNeeded()).toBe(true)
      expect(needed.isBought()).toBe(false)
    })

    it('should correctly identify bought status', () => {
      const bought = ItemStatusVO.bought()

      expect(bought.isBought()).toBe(true)
      expect(bought.isNeeded()).toBe(false)
    })
  })

  describe('Toggle Functionality', () => {
    it('should toggle from needed to bought', () => {
      const needed = ItemStatusVO.needed()
      const toggled = needed.toggle()

      expect(toggled.getValue()).toBe('bought')
      expect(toggled.isBought()).toBe(true)
      expect(toggled.isNeeded()).toBe(false)
    })

    it('should toggle from bought to needed', () => {
      const bought = ItemStatusVO.bought()
      const toggled = bought.toggle()

      expect(toggled.getValue()).toBe('needed')
      expect(toggled.isNeeded()).toBe(true)
      expect(toggled.isBought()).toBe(false)
    })

    it('should not mutate original status when toggling', () => {
      const original = ItemStatusVO.needed()
      const toggled = original.toggle()

      expect(original.isNeeded()).toBe(true)
      expect(toggled.isBought()).toBe(true)
    })
  })

  describe('Equality', () => {
    it('should consider same statuses as equal', () => {
      const needed1 = ItemStatusVO.needed()
      const needed2 = ItemStatusVO.needed()
      const bought1 = ItemStatusVO.bought()
      const bought2 = ItemStatusVO.bought()

      expect(needed1.equals(needed2)).toBe(true)
      expect(bought1.equals(bought2)).toBe(true)
    })

    it('should consider different statuses as not equal', () => {
      const needed = ItemStatusVO.needed()
      const bought = ItemStatusVO.bought()

      expect(needed.equals(bought)).toBe(false)
      expect(bought.equals(needed)).toBe(false)
    })

    it('should handle string-created and factory-created instances equally', () => {
      const neededFromFactory = ItemStatusVO.needed()
      const neededFromString = ItemStatusVO.fromString('needed')

      expect(neededFromFactory.equals(neededFromString)).toBe(true)
    })
  })
})