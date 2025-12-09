import { describe, it, expect } from 'vitest'
import { InventoryItem } from '../../../domain/model/InventoryItem'
import { ProductId } from '../../../domain/model/ProductId'
import { Quantity } from '../../../domain/model/Quantity'
import { UnitType } from '../../../domain/model/UnitType'
import { StockLevel } from '../../../domain/model/StockLevel'

describe('InventoryItem', () => {
  const productId = ProductId.fromString('123e4567-e89b-12d3-a456-426614174000')
  const quantity = Quantity.create(10)
  const unitType = UnitType.units()

  it('should create InventoryItem with stock level and last updated', () => {
    const stockLevel = StockLevel.create('high')
    const lastUpdated = new Date('2025-12-09T10:00:00')

    const item = new InventoryItem(productId, quantity, unitType, stockLevel, lastUpdated)

    expect(item.productId).toBe(productId)
    expect(item.currentStock).toBe(quantity)
    expect(item.unitType).toBe(unitType)
    expect(item.stockLevel.equals(stockLevel)).toBe(true)
    expect(item.lastUpdated).toEqual(lastUpdated)
  })

  it('should default to high stock level and current date if not provided', () => {
    const before = new Date()

    const item = new InventoryItem(productId, quantity, unitType)

    const after = new Date()

    expect(item.stockLevel.value).toBe('high')
    expect(item.lastUpdated.getTime()).toBeGreaterThanOrEqual(before.getTime())
    expect(item.lastUpdated.getTime()).toBeLessThanOrEqual(after.getTime())
  })

  it('should update stock level', () => {
    const initialLevel = StockLevel.create('high')
    const item = new InventoryItem(productId, quantity, unitType, initialLevel, new Date())

    const newLevel = StockLevel.create('low')
    const updatedItem = item.updateStockLevel(newLevel)

    expect(updatedItem.stockLevel.equals(newLevel)).toBe(true)
    expect(updatedItem.productId).toBe(productId)
    expect(updatedItem.currentStock).toBe(quantity)
  })

  it('should update lastUpdated when updating stock level', () => {
    const oldDate = new Date('2025-12-08T10:00:00')
    const item = new InventoryItem(productId, quantity, unitType, StockLevel.create('high'), oldDate)

    const before = new Date()
    const newLevel = StockLevel.create('medium')
    const updatedItem = item.updateStockLevel(newLevel)
    const after = new Date()

    expect(updatedItem.lastUpdated.getTime()).toBeGreaterThanOrEqual(before.getTime())
    expect(updatedItem.lastUpdated.getTime()).toBeLessThanOrEqual(after.getTime())
    expect(updatedItem.lastUpdated).not.toEqual(oldDate)
  })

  it('should maintain existing updateStock method', () => {
    const item = new InventoryItem(productId, quantity, unitType)
    const newQuantity = Quantity.create(20)

    const updatedItem = item.updateStock(newQuantity)

    expect(updatedItem.currentStock).toBe(newQuantity)
    expect(updatedItem.productId).toBe(productId)
  })
})