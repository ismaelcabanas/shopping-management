import { describe, it, expect, beforeEach, vi } from 'vitest'
import { AddManualShoppingListItem } from '../../../application/use-cases/AddManualShoppingListItem'
import type { ShoppingListRepository } from '../../../domain/repositories/ShoppingListRepository'
import type { ProductRepository } from '../../../domain/repositories/ProductRepository'
import { ProductId } from '../../../domain/model/ProductId'
import { Product } from '../../../domain/model/Product'
import { UnitType } from '../../../domain/model/UnitType'
import type { ShoppingListItem } from '../../../domain/model/ShoppingListItem'

describe('AddManualShoppingListItem', () => {
  let shoppingListRepository: ShoppingListRepository
  let productRepository: ProductRepository
  let useCase: AddManualShoppingListItem

  const productId = ProductId.fromString('123e4567-e89b-12d3-a456-426614174000')
  const existingProduct = new Product(productId, 'Test Product', UnitType.units())

  beforeEach(() => {
    productRepository = {
      findById: vi.fn().mockResolvedValue(existingProduct),
      findAll: vi.fn(),
      findByName: vi.fn(),
      save: vi.fn(),
      delete: vi.fn()
    }

    shoppingListRepository = {
      findAll: vi.fn(),
      findByProductId: vi.fn().mockResolvedValue(null),
      add: vi.fn(),
      remove: vi.fn(),
      exists: vi.fn().mockResolvedValue(false),
      toggleChecked: vi.fn(),
      getCheckedItems: vi.fn(),
      clear: vi.fn(),
      updateChecked: vi.fn()
    }

    useCase = new AddManualShoppingListItem(productRepository, shoppingListRepository)
  })

  it('should add manual shopping list item successfully', async () => {
    await useCase.execute({ productId: productId.value })

    expect(shoppingListRepository.add).toHaveBeenCalledOnce()
    const addedItem = vi.mocked(shoppingListRepository.add).mock.calls[0][0] as ShoppingListItem
    expect(addedItem.productId.equals(productId)).toBe(true)
    expect(addedItem.reason).toBe('manual')
    expect(addedItem.stockLevel).toBeUndefined()
    expect(addedItem.addedAt).toBeInstanceOf(Date)
  })

  it('should throw error when product already in shopping list', async () => {
    vi.mocked(shoppingListRepository.exists).mockResolvedValue(true)

    await expect(useCase.execute({ productId: productId.value }))
      .rejects.toThrow('Product already in shopping list')
  })

  it('should validate product exists via repository check', async () => {
    vi.mocked(productRepository.findById).mockResolvedValue(null)

    await expect(useCase.execute({ productId: productId.value }))
      .rejects.toThrow('Product not found')
  })

  it('should create item with reason=manual', async () => {
    await useCase.execute({ productId: productId.value })

    const addedItem = vi.mocked(shoppingListRepository.add).mock.calls[0][0] as ShoppingListItem
    expect(addedItem.reason).toBe('manual')
  })

  it('should preserve addedAt timestamp', async () => {
    const before = new Date()
    await useCase.execute({ productId: productId.value })
    const after = new Date()

    const addedItem = vi.mocked(shoppingListRepository.add).mock.calls[0][0] as ShoppingListItem
    expect(addedItem.addedAt.getTime()).toBeGreaterThanOrEqual(before.getTime())
    expect(addedItem.addedAt.getTime()).toBeLessThanOrEqual(after.getTime())
  })

  it('should check for duplicates before adding', async () => {
    await useCase.execute({ productId: productId.value })

    expect(shoppingListRepository.exists).toHaveBeenCalledWith(productId)
    expect(shoppingListRepository.exists).toHaveBeenCalledBefore(
      vi.mocked(shoppingListRepository.add)
    )
  })

  it('should validate product exists before checking duplicates', async () => {
    await useCase.execute({ productId: productId.value })

    expect(productRepository.findById).toHaveBeenCalledWith(productId)
    expect(productRepository.findById).toHaveBeenCalledBefore(
      vi.mocked(shoppingListRepository.exists)
    )
  })
})