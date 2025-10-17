// Application Use Case: Bulk Actions
import type { ShoppingListRepository } from '../../domain/repositories/ShoppingListRepository';

export class BulkActionsUseCase {
  constructor(private readonly repository: ShoppingListRepository) {}

  async markAllAsBought(): Promise<void> {
    await this.repository.markAllAsBought();
  }

  async clearList(): Promise<void> {
    await this.repository.markAllAsNeeded();
  }
}