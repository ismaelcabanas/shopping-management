// Application Use Case: Get Shopping List
import type { ShoppingListRepository } from '../../domain/repositories/ShoppingListRepository';
import type { ShoppingListItem } from '../../domain/entities/ShoppingListItem';

export class GetShoppingListUseCase {
  constructor(private readonly repository: ShoppingListRepository) {}

  async execute(): Promise<ShoppingListItem[]> {
    return await this.repository.findAll();
  }

  async getNeededItems(): Promise<ShoppingListItem[]> {
    const allItems = await this.repository.findAll();
    return allItems.filter(item => item.status.isNeeded());
  }

  async getBoughtItems(): Promise<ShoppingListItem[]> {
    const allItems = await this.repository.findAll();
    return allItems.filter(item => item.status.isBought());
  }
}