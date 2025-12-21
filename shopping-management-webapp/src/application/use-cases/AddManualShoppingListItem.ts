import type { ProductRepository } from '../../domain/repositories/ProductRepository'
import type { ShoppingListRepository } from '../../domain/repositories/ShoppingListRepository'
import { ProductId } from '../../domain/model/ProductId'
import { ShoppingListItem } from '../../domain/model/ShoppingListItem'

export interface AddManualShoppingListItemCommand {
  productId: string
}

/**
 * Use case for manually adding a product to the shopping list.
 *
 * This use case allows users to proactively add products to their shopping list
 * independent of automatic stock-level triggers. Manual items are marked with
 * reason='manual' to distinguish them from auto-generated items.
 *
 * Validation:
 * - Ensures the product exists in the product repository
 * - Prevents duplicate additions (product already in shopping list)
 *
 * @example
 * ```typescript
 * const useCase = new AddManualShoppingListItem(productRepo, shoppingListRepo)
 * await useCase.execute({ productId: '123e4567-e89b-12d3-a456-426614174000' })
 * ```
 */
export class AddManualShoppingListItem {
  private readonly productRepository: ProductRepository
  private readonly shoppingListRepository: ShoppingListRepository

  constructor(
    productRepository: ProductRepository,
    shoppingListRepository: ShoppingListRepository
  ) {
    this.productRepository = productRepository
    this.shoppingListRepository = shoppingListRepository
  }

  async execute(command: AddManualShoppingListItemCommand): Promise<void> {
    const productId = ProductId.fromString(command.productId)

    // Validate product exists
    const product = await this.productRepository.findById(productId)
    if (!product) {
      throw new Error('Product not found')
    }

    // Check for duplicates
    const exists = await this.shoppingListRepository.exists(productId)
    if (exists) {
      throw new Error('Product already in shopping list')
    }

    // Create and add manual shopping list item
    const item = ShoppingListItem.createManual(productId)
    await this.shoppingListRepository.add(item)
  }
}