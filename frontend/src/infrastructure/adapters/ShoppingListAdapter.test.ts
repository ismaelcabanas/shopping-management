import { describe, it, expect } from 'vitest'
import { ShoppingListAdapter } from './ShoppingListAdapter'
import type { ShoppingListItem as DomainShoppingListItem } from '../../domain/entities/ShoppingListItem'
import type { ShoppingListItem as LegacyShoppingListItem } from '../../../types'
import { ItemStatusVO } from '../../domain/value-objects/ItemStatus'
import { Quantity } from '../../domain/value-objects/Quantity'

describe('ShoppingListAdapter', () => {
  // Test data factories
  const createDomainItem = (
    id: string = '1',
    productName: string = 'Test Product',
    quantity: number = 5,
    unit: string = 'ud',
    status: 'needed' | 'bought' = 'needed'
  ): DomainShoppingListItem => ({
    id,
    productName,
    quantity: Quantity.create(quantity),
    unit,
    status: status === 'needed' ? ItemStatusVO.needed() : ItemStatusVO.bought(),
    createdAt: new Date('2024-01-01T10:00:00Z'),
    updatedAt: new Date('2024-01-02T15:30:00Z')
  })

  const createLegacyItem = (
    id: string = '1',
    productName: string = 'Test Product',
    quantity: number = 5,
    unit: string = 'ud',
    status: 'needed' | 'bought' = 'needed'
  ): LegacyShoppingListItem => ({
    id,
    productName,
    quantity,
    unit,
    status,
    createdAt: new Date('2024-01-01T10:00:00Z'),
    updatedAt: new Date('2024-01-02T15:30:00Z')
  })

  describe('Domain to Legacy Conversion', () => {
    it('should convert domain item to legacy format', () => {
      const domainItem = createDomainItem('1', 'Apples', 10, 'kg', 'needed')

      const legacyItem = ShoppingListAdapter.toLegacy(domainItem)

      expect(legacyItem).toEqual({
        id: '1',
        productName: 'Apples',
        quantity: 10,
        unit: 'kg',
        status: 'needed',
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-02T15:30:00Z')
      })

      // Verify it's plain objects, not Value Objects
      expect(typeof legacyItem.quantity).toBe('number')
      expect(typeof legacyItem.status).toBe('string')
    })

    it('should handle bought status conversion', () => {
      const domainItem = createDomainItem('2', 'Bread', 2, 'ud', 'bought')

      const legacyItem = ShoppingListAdapter.toLegacy(domainItem)

      expect(legacyItem.status).toBe('bought')
      expect(legacyItem.quantity).toBe(2)
    })

    it('should preserve all field values during conversion', () => {
      const specificDate1 = new Date('2023-05-15T08:30:00Z')
      const specificDate2 = new Date('2023-05-15T14:45:00Z')

      const domainItem: DomainShoppingListItem = {
        id: 'specific-id',
        productName: 'Specific Product',
        quantity: Quantity.create(7),
        unit: 'L',
        status: ItemStatusVO.bought(),
        createdAt: specificDate1,
        updatedAt: specificDate2
      }

      const legacyItem = ShoppingListAdapter.toLegacy(domainItem)

      expect(legacyItem.id).toBe('specific-id')
      expect(legacyItem.productName).toBe('Specific Product')
      expect(legacyItem.quantity).toBe(7)
      expect(legacyItem.unit).toBe('L')
      expect(legacyItem.status).toBe('bought')
      expect(legacyItem.createdAt).toBe(specificDate1)
      expect(legacyItem.updatedAt).toBe(specificDate2)
    })

    it('should handle edge cases in domain to legacy conversion', () => {
      const domainItem = createDomainItem('edge', 'Edge Case Product', 1, 'ml', 'needed')

      const legacyItem = ShoppingListAdapter.toLegacy(domainItem)

      expect(legacyItem.quantity).toBe(1)
      expect(legacyItem.unit).toBe('ml')
      expect(legacyItem.status).toBe('needed')
    })
  })

  describe('Legacy to Domain Conversion', () => {
    it('should convert legacy item to domain format', () => {
      const legacyItem = createLegacyItem('3', 'Milk', 2, 'L', 'needed')

      const domainItem = ShoppingListAdapter.toDomain(legacyItem)

      expect(domainItem.id).toBe('3')
      expect(domainItem.productName).toBe('Milk')
      expect(domainItem.quantity.getValue()).toBe(2)
      expect(domainItem.unit).toBe('L')
      expect(domainItem.status.getValue()).toBe('needed')
      expect(domainItem.status.isNeeded()).toBe(true)
      expect(domainItem.createdAt).toEqual(new Date('2024-01-01T10:00:00Z'))
      expect(domainItem.updatedAt).toEqual(new Date('2024-01-02T15:30:00Z'))

      // Verify it creates proper Value Objects
      expect(domainItem.quantity).toBeInstanceOf(Quantity)
      expect(domainItem.status).toBeInstanceOf(ItemStatusVO)
    })

    it('should handle bought status conversion to domain', () => {
      const legacyItem = createLegacyItem('4', 'Cheese', 1, 'kg', 'bought')

      const domainItem = ShoppingListAdapter.toDomain(legacyItem)

      expect(domainItem.status.getValue()).toBe('bought')
      expect(domainItem.status.isBought()).toBe(true)
      expect(domainItem.status.isNeeded()).toBe(false)
    })

    it('should create valid Quantity Value Objects', () => {
      const legacyItem = createLegacyItem('5', 'Bananas', 6, 'ud', 'needed')

      const domainItem = ShoppingListAdapter.toDomain(legacyItem)

      expect(domainItem.quantity.getValue()).toBe(6)
      expect(domainItem.quantity.toString()).toBe('6')

      // Test Quantity operations work
      const doubled = domainItem.quantity.add(domainItem.quantity)
      expect(doubled.getValue()).toBe(12)
    })

    it('should create valid ItemStatus Value Objects', () => {
      const neededLegacy = createLegacyItem('6', 'Product1', 1, 'ud', 'needed')
      const boughtLegacy = createLegacyItem('7', 'Product2', 1, 'ud', 'bought')

      const neededDomain = ShoppingListAdapter.toDomain(neededLegacy)
      const boughtDomain = ShoppingListAdapter.toDomain(boughtLegacy)

      // Test status operations work
      expect(neededDomain.status.toggle().getValue()).toBe('bought')
      expect(boughtDomain.status.toggle().getValue()).toBe('needed')
    })
  })

  describe('Array Conversions', () => {
    it('should convert domain array to legacy array', () => {
      const domainItems = [
        createDomainItem('1', 'Item1', 1, 'ud', 'needed'),
        createDomainItem('2', 'Item2', 2, 'kg', 'bought'),
        createDomainItem('3', 'Item3', 3, 'L', 'needed')
      ]

      const legacyItems = ShoppingListAdapter.toLegacyArray(domainItems)

      expect(legacyItems).toHaveLength(3)

      expect(legacyItems[0]).toEqual(createLegacyItem('1', 'Item1', 1, 'ud', 'needed'))
      expect(legacyItems[1]).toEqual(createLegacyItem('2', 'Item2', 2, 'kg', 'bought'))
      expect(legacyItems[2]).toEqual(createLegacyItem('3', 'Item3', 3, 'L', 'needed'))

      // Verify all are plain objects
      legacyItems.forEach(item => {
        expect(typeof item.quantity).toBe('number')
        expect(typeof item.status).toBe('string')
      })
    })

    it('should convert legacy array to domain array', () => {
      const legacyItems = [
        createLegacyItem('1', 'Item1', 1, 'ud', 'needed'),
        createLegacyItem('2', 'Item2', 2, 'kg', 'bought')
      ]

      const domainItems = ShoppingListAdapter.toDomainArray(legacyItems)

      expect(domainItems).toHaveLength(2)

      expect(domainItems[0].id).toBe('1')
      expect(domainItems[0].quantity.getValue()).toBe(1)
      expect(domainItems[0].status.isNeeded()).toBe(true)

      expect(domainItems[1].id).toBe('2')
      expect(domainItems[1].quantity.getValue()).toBe(2)
      expect(domainItems[1].status.isBought()).toBe(true)

      // Verify all have proper Value Objects
      domainItems.forEach(item => {
        expect(item.quantity).toBeInstanceOf(Quantity)
        expect(item.status).toBeInstanceOf(ItemStatusVO)
      })
    })

    it('should handle empty arrays', () => {
      const emptyDomainArray = ShoppingListAdapter.toLegacyArray([])
      const emptyLegacyArray = ShoppingListAdapter.toDomainArray([])

      expect(emptyDomainArray).toEqual([])
      expect(emptyLegacyArray).toEqual([])
    })

    it('should handle large arrays efficiently', () => {
      const largeDomainArray = Array.from({ length: 100 }, (_, i) =>
        createDomainItem(`item-${i}`, `Product ${i}`, i + 1, 'ud', i % 2 === 0 ? 'needed' : 'bought')
      )

      const legacyArray = ShoppingListAdapter.toLegacyArray(largeDomainArray)
      const backToDomainArray = ShoppingListAdapter.toDomainArray(legacyArray)

      expect(legacyArray).toHaveLength(100)
      expect(backToDomainArray).toHaveLength(100)

      // Verify first and last items maintain integrity
      expect(backToDomainArray[0].quantity.getValue()).toBe(1)
      expect(backToDomainArray[99].quantity.getValue()).toBe(100)
    })
  })

  describe('Bidirectional Conversion Integrity', () => {
    it('should maintain data integrity in round-trip conversions', () => {
      const originalDomain = createDomainItem('round-trip', 'Round Trip Product', 42, 'kg', 'bought')

      // Convert to legacy and back to domain
      const legacy = ShoppingListAdapter.toLegacy(originalDomain)
      const backToDomain = ShoppingListAdapter.toDomain(legacy)

      // Verify all properties are preserved
      expect(backToDomain.id).toBe(originalDomain.id)
      expect(backToDomain.productName).toBe(originalDomain.productName)
      expect(backToDomain.quantity.getValue()).toBe(originalDomain.quantity.getValue())
      expect(backToDomain.unit).toBe(originalDomain.unit)
      expect(backToDomain.status.getValue()).toBe(originalDomain.status.getValue())
      expect(backToDomain.createdAt).toEqual(originalDomain.createdAt)
      expect(backToDomain.updatedAt).toEqual(originalDomain.updatedAt)
    })

    it('should maintain data integrity in reverse round-trip conversions', () => {
      const originalLegacy = createLegacyItem('reverse-trip', 'Reverse Trip Product', 25, 'ml', 'needed')

      // Convert to domain and back to legacy
      const domain = ShoppingListAdapter.toDomain(originalLegacy)
      const backToLegacy = ShoppingListAdapter.toLegacy(domain)

      // Verify all properties are preserved
      expect(backToLegacy).toEqual(originalLegacy)
    })

    it('should handle multiple round-trip conversions', () => {
      let current = createDomainItem('multi-trip', 'Multi Trip Product', 15, 'g', 'bought')

      // Perform multiple round trips
      for (let i = 0; i < 5; i++) {
        const legacy = ShoppingListAdapter.toLegacy(current)
        current = ShoppingListAdapter.toDomain(legacy)
      }

      // Verify data integrity is maintained
      expect(current.id).toBe('multi-trip')
      expect(current.productName).toBe('Multi Trip Product')
      expect(current.quantity.getValue()).toBe(15)
      expect(current.unit).toBe('g')
      expect(current.status.getValue()).toBe('bought')
    })
  })

  describe('Value Object Behavior Preservation', () => {
    it('should preserve domain behavior after conversion', () => {
      const legacyItem = createLegacyItem('behavior-test', 'Behavior Test', 5, 'ud', 'needed')

      const domainItem = ShoppingListAdapter.toDomain(legacyItem)

      // Test that Value Object methods work correctly
      expect(domainItem.quantity.add(Quantity.create(3)).getValue()).toBe(8)
      expect(domainItem.status.toggle().getValue()).toBe('bought')
      expect(domainItem.status.isNeeded()).toBe(true)
    })

    it('should create independent Value Object instances', () => {
      const legacyItem1 = createLegacyItem('independent-1', 'Product 1', 5, 'ud', 'needed')
      const legacyItem2 = createLegacyItem('independent-2', 'Product 2', 5, 'ud', 'needed')

      const domainItem1 = ShoppingListAdapter.toDomain(legacyItem1)
      const domainItem2 = ShoppingListAdapter.toDomain(legacyItem2)

      // Modify one item's quantity
      const newQuantity1 = domainItem1.quantity.add(Quantity.create(2))

      // Other item should be unaffected
      expect(domainItem1.quantity.getValue()).toBe(5) // Original unchanged
      expect(domainItem2.quantity.getValue()).toBe(5) // Other unchanged
      expect(newQuantity1.getValue()).toBe(7) // New instance correct
    })
  })
})