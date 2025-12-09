import { describe, it, expect, beforeEach } from 'vitest'
import { GetProductsNeedingRestock } from '../../../application/use-cases/GetProductsNeedingRestock'
import type { InventoryRepository } from '../../../domain/repositories/InventoryRepository'
import { InventoryItem } from '../../../domain/model/InventoryItem'
import { ProductId } from '../../../domain/model/ProductId'
import { Quantity } from '../../../domain/model/Quantity'
import { UnitType } from '../../../domain/model/UnitType'
import { StockLevel } from '../../../domain/model/StockLevel'

describe('GetProductsNeedingRestock', () => {
  let inventoryRepository: InventoryRepository
  let getProductsNeedingRestock: GetProductsNeedingRestock

  const highStockItem = new InventoryItem(
    ProductId.fromString('123e4567-e89b-12d3-a456-426614174001'),
    Quantity.create(10),
    UnitType.units(),
    StockLevel.create('high'),
    new Date()
  )

  const mediumStockItem = new InventoryItem(
    ProductId.fromString('123e4567-e89b-12d3-a456-426614174002'),
    Quantity.create(5),
    UnitType.units(),
    StockLevel.create('medium'),
    new Date()
  )

  const lowStockItem = new InventoryItem(
    ProductId.fromString('123e4567-e89b-12d3-a456-426614174003'),
    Quantity.create(2),
    UnitType.units(),
    StockLevel.create('low'),
    new Date()
  )

  const emptyStockItem = new InventoryItem(
    ProductId.fromString('123e4567-e89b-12d3-a456-426614174004'),
    Quantity.create(0),
    UnitType.units(),
    StockLevel.create('empty'),
    new Date()
  )

  beforeEach(() => {
    inventoryRepository = {
      findByProductId: async () => null,
      save: async () => {},
      findAll: async () => [highStockItem, mediumStockItem, lowStockItem, emptyStockItem]
    }
    getProductsNeedingRestock = new GetProductsNeedingRestock(inventoryRepository)
  })

  it('should return products with low stock level', async () => {
    const result = await getProductsNeedingRestock.execute()

    expect(result).toHaveLength(2)
    expect(result.some(item => item.productId.equals(lowStockItem.productId))).toBe(true)
    expect(result.some(item => item.productId.equals(emptyStockItem.productId))).toBe(true)
  })

  it('should not return products with high or medium stock levels', async () => {
    const result = await getProductsNeedingRestock.execute()

    expect(result.some(item => item.productId.equals(highStockItem.productId))).toBe(false)
    expect(result.some(item => item.productId.equals(mediumStockItem.productId))).toBe(false)
  })

  it('should return empty array when no products need restock', async () => {
    inventoryRepository.findAll = async () => [highStockItem, mediumStockItem]

    const result = await getProductsNeedingRestock.execute()

    expect(result).toHaveLength(0)
  })

  it('should return empty array when inventory is empty', async () => {
    inventoryRepository.findAll = async () => []

    const result = await getProductsNeedingRestock.execute()

    expect(result).toHaveLength(0)
  })
})