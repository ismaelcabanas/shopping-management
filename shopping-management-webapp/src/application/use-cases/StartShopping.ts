import type { ShoppingListRepository } from '../../domain/repositories/ShoppingListRepository'

export class StartShopping {
  private shoppingListRepository: ShoppingListRepository

  constructor(shoppingListRepository: ShoppingListRepository) {
    this.shoppingListRepository = shoppingListRepository
  }

  async execute(): Promise<void> {
    const items = await this.shoppingListRepository.findAll()

    for (const item of items) {
      await this.shoppingListRepository.updateChecked(item.productId, false)
    }
  }
}
