import { describe, it, expect, beforeEach } from 'vitest'
import { StartShopping } from '../../../application/use-cases/StartShopping'
import { LocalStorageShoppingListRepository } from '../../../infrastructure/repositories/LocalStorageShoppingListRepository'
import { ShoppingListItem } from '../../../domain/model/ShoppingListItem'
import { ProductId } from '../../../domain/model/ProductId'

describe('StartShopping', () => {
  let repository: LocalStorageShoppingListRepository
  let useCase: StartShopping

  beforeEach(() => {
    localStorage.clear()
    repository = new LocalStorageShoppingListRepository()
    useCase = new StartShopping(repository)
  })

  it('should reset all checked items to unchecked (false)', async () => {
    const productId1 = ProductId.fromString('123e4567-e89b-12d3-a456-426614174000')
    const productId2 = ProductId.fromString('123e4567-e89b-12d3-a456-426614174001')
    const item1 = ShoppingListItem.createAuto(productId1, 'low')
    const item2 = ShoppingListItem.createManual(productId2)

    await repository.add(item1)
    await repository.add(item2)
    await repository.toggleChecked(productId1) // Set to true
    await repository.toggleChecked(productId2) // Set to true

    await useCase.execute()

    const items = await repository.findAll()
    expect(items).toHaveLength(2)
    expect(items[0].checked).toBe(false)
    expect(items[1].checked).toBe(false)
  })

  it('should not modify other item properties (productId, reason, stockLevel)', async () => {
    const productId = ProductId.fromString('123e4567-e89b-12d3-a456-426614174000')
    const item = ShoppingListItem.createAuto(productId, 'low')

    await repository.add(item)
    await repository.toggleChecked(productId)

    await useCase.execute()

    const found = await repository.findByProductId(productId)
    expect(found).not.toBeNull()
    expect(found?.productId.value).toBe('123e4567-e89b-12d3-a456-426614174000')
    expect(found?.reason).toBe('auto')
    expect(found?.stockLevel).toBe('low')
    expect(found?.checked).toBe(false)
  })

  it('should work with empty shopping list (no-op)', async () => {
    await useCase.execute()

    const items = await repository.findAll()
    expect(items).toHaveLength(0)
  })

  it('should work with list where all items already unchecked', async () => {
    const productId1 = ProductId.fromString('123e4567-e89b-12d3-a456-426614174000')
    const productId2 = ProductId.fromString('123e4567-e89b-12d3-a456-426614174001')
    const item1 = ShoppingListItem.createAuto(productId1, 'low')
    const item2 = ShoppingListItem.createManual(productId2)

    await repository.add(item1)
    await repository.add(item2)

    await useCase.execute()

    const items = await repository.findAll()
    expect(items).toHaveLength(2)
    expect(items[0].checked).toBe(false)
    expect(items[1].checked).toBe(false)
  })
})
