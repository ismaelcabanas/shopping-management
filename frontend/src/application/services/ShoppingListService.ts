// Application Service: Facade for React components
import type { ShoppingListItem } from '../../domain/entities/ShoppingListItem';
import { GetShoppingListUseCase } from '../use-cases/GetShoppingListUseCase';
import { UpdateQuantityUseCase } from '../use-cases/UpdateQuantityUseCase';
import { ToggleItemStatusUseCase } from '../use-cases/ToggleItemStatusUseCase';
import { BulkActionsUseCase } from '../use-cases/BulkActionsUseCase';
import type { ShoppingListRepository } from '../../domain/repositories/ShoppingListRepository';

export class ShoppingListService {
  private getShoppingListUseCase: GetShoppingListUseCase;
  private updateQuantityUseCase: UpdateQuantityUseCase;
  private toggleItemStatusUseCase: ToggleItemStatusUseCase;
  private bulkActionsUseCase: BulkActionsUseCase;

  constructor(repository: ShoppingListRepository) {
    this.getShoppingListUseCase = new GetShoppingListUseCase(repository);
    this.updateQuantityUseCase = new UpdateQuantityUseCase(repository);
    this.toggleItemStatusUseCase = new ToggleItemStatusUseCase(repository);
    this.bulkActionsUseCase = new BulkActionsUseCase(repository);
  }

  async getAllItems(): Promise<ShoppingListItem[]> {
    return await this.getShoppingListUseCase.execute();
  }

  async getNeededItems(): Promise<ShoppingListItem[]> {
    return await this.getShoppingListUseCase.getNeededItems();
  }

  async getBoughtItems(): Promise<ShoppingListItem[]> {
    return await this.getShoppingListUseCase.getBoughtItems();
  }

  async updateQuantity(itemId: string, newQuantity: number): Promise<void> {
    await this.updateQuantityUseCase.execute(itemId, newQuantity);
  }

  async toggleItemStatus(itemId: string): Promise<void> {
    await this.toggleItemStatusUseCase.execute(itemId);
  }

  async markAllAsBought(): Promise<void> {
    await this.bulkActionsUseCase.markAllAsBought();
  }

  async clearList(): Promise<void> {
    await this.bulkActionsUseCase.clearList();
  }
}