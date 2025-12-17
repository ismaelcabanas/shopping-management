import { describe, it, expect, beforeEach } from 'vitest'
import { RecalculateShoppingList } from '../../../application/use-cases/RecalculateShoppingList'
import { LocalStorageShoppingListRepository } from '../../../infrastructure/repositories/LocalStorageShoppingListRepository'
import { LocalStorageInventoryRepository } from '../../../infrastructure/repositories/LocalStorageInventoryRepository'
import { ShoppingListItem } from '../../../domain/model/ShoppingListItem'
import { InventoryItem } from '../../../domain/model/InventoryItem'
import { ProductId } from '../../../domain/model/ProductId'
import { Quantity } from '../../../domain/model/Quantity'
import { UnitType } from '../../../domain/model/UnitType'
import { StockLevel } from '../../../domain/model/StockLevel'

describe('RecalculateShoppingList', () => {
  let shoppingListRepository: LocalStorageShoppingListRepository
  let inventoryRepository: LocalStorageInventoryRepository
  let useCase: RecalculateShoppingList

  beforeEach(() => {
    localStorage.clear()
    shoppingListRepository = new LocalStorageShoppingListRepository()
    inventoryRepository = new LocalStorageInventoryRepository()
    useCase = new RecalculateShoppingList(shoppingListRepository, inventoryRepository)
  })

  it('should clear existing shopping list', async () => {
    const productId = ProductId.fromString('123e4567-e89b-12d3-a456-426614174000')
    const item = ShoppingListItem.createManual(productId)

    await shoppingListRepository.add(item)

    await useCase.execute()

    const items = await shoppingListRepository.findAll()
    expect(items).toHaveLength(0)
  })

  it('should add items with stock "low" to list', async () => {
    const productId = ProductId.fromString('123e4567-e89b-12d3-a456-426614174000')
    const inventoryItem = new InventoryItem(
      productId,
      Quantity.create(5),
      UnitType.units(),
      StockLevel.create('low'),
      new Date()
    )

    await inventoryRepository.save(inventoryItem)

    await useCase.execute()

    const items = await shoppingListRepository.findAll()
    expect(items).toHaveLength(1)
    expect(items[0].productId.value).toBe('123e4567-e89b-12d3-a456-426614174000')
    expect(items[0].reason).toBe('auto')
    expect(items[0].stockLevel).toBe('low')
    expect(items[0].checked).toBe(false)
  })

  it('should add items with stock "empty" to list', async () => {
    const productId = ProductId.fromString('123e4567-e89b-12d3-a456-426614174000')
    const inventoryItem = new InventoryItem(
      productId,
      Quantity.create(0),
      UnitType.units(),
      StockLevel.create('empty'),
      new Date()
    )

    await inventoryRepository.save(inventoryItem)

    await useCase.execute()

    const items = await shoppingListRepository.findAll()
    expect(items).toHaveLength(1)
    expect(items[0].productId.value).toBe('123e4567-e89b-12d3-a456-426614174000')
    expect(items[0].reason).toBe('auto')
    expect(items[0].stockLevel).toBe('empty')
    expect(items[0].checked).toBe(false)
  })

  it('should NOT add items with "medium" or "high" stock', async () => {
    const productId1 = ProductId.fromString('123e4567-e89b-12d3-a456-426614174000')
    const productId2 = ProductId.fromString('123e4567-e89b-12d3-a456-426614174001')
    const inventoryItem1 = new InventoryItem(
      productId1,
      Quantity.create(15),
      UnitType.units(),
      StockLevel.create('medium'),
      new Date()
    )
    const inventoryItem2 = new InventoryItem(
      productId2,
      Quantity.create(30),
      UnitType.units(),
      StockLevel.create('high'),
      new Date()
    )

    await inventoryRepository.save(inventoryItem1)
    await inventoryRepository.save(inventoryItem2)

    await useCase.execute()

    const items = await shoppingListRepository.findAll()
    expect(items).toHaveLength(0)
  })

  it('should mark new items as reason="auto" and checked=false', async () => {
    const productId1 = ProductId.fromString('123e4567-e89b-12d3-a456-426614174000')
    const productId2 = ProductId.fromString('123e4567-e89b-12d3-a456-426614174001')
    const inventoryItem1 = new InventoryItem(
      productId1,
      Quantity.create(5),
      UnitType.units(),
      StockLevel.create('low'),
      new Date()
    )
    const inventoryItem2 = new InventoryItem(
      productId2,
      Quantity.create(0),
      UnitType.units(),
      StockLevel.create('empty'),
      new Date()
    )

    await inventoryRepository.save(inventoryItem1)
    await inventoryRepository.save(inventoryItem2)

    await useCase.execute()

    const items = await shoppingListRepository.findAll()
    expect(items).toHaveLength(2)

    items.forEach(item => {
      expect(item.reason).toBe('auto')
      expect(item.checked).toBe(false)
    })
  })

  it('should query inventory for low/empty stock', async () => {
    const productId1 = ProductId.fromString('123e4567-e89b-12d3-a456-426614174000')
    const productId2 = ProductId.fromString('123e4567-e89b-12d3-a456-426614174001')
    const productId3 = ProductId.fromString('123e4567-e89b-12d3-a456-426614174002')
    const productId4 = ProductId.fromString('123e4567-e89b-12d3-a456-426614174003')

    const item1 = new InventoryItem(productId1, Quantity.create(5), UnitType.units(), StockLevel.create('low'), new Date())
    const item2 = new InventoryItem(productId2, Quantity.create(0), UnitType.units(), StockLevel.create('empty'), new Date())
    const item3 = new InventoryItem(productId3, Quantity.create(15), UnitType.units(), StockLevel.create('medium'), new Date())
    const item4 = new InventoryItem(productId4, Quantity.create(30), UnitType.units(), StockLevel.create('high'), new Date())

    await inventoryRepository.save(item1)
    await inventoryRepository.save(item2)
    await inventoryRepository.save(item3)
    await inventoryRepository.save(item4)

    await useCase.execute()

    const items = await shoppingListRepository.findAll()
    expect(items).toHaveLength(2)

    const productIds = items.map(item => item.productId.value)
    expect(productIds).toContain('123e4567-e89b-12d3-a456-426614174000') // low
    expect(productIds).toContain('123e4567-e89b-12d3-a456-426614174001') // empty
    expect(productIds).not.toContain('123e4567-e89b-12d3-a456-426614174002') // medium
    expect(productIds).not.toContain('123e4567-e89b-12d3-a456-426614174003') // high
  })
})
