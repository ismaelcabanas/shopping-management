import type { ShoppingListRepository } from '../../domain/repositories/ShoppingListRepository'

export class StartShopping {
  constructor(private readonly shoppingListRepository: ShoppingListRepository) {}

  async execute(): Promise<void> {
    const items = await this.shoppingListRepository.findAll()

    for (const item of items) {
      await this.shoppingListRepository.updateChecked(item.productId, false)
    }
  }
}
