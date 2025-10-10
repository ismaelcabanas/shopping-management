// Application Service: Facade for React components
import type { ShoppingListItem as LegacyShoppingListItem } from '../../types';
import { GetShoppingListUseCase } from '../use-cases/GetShoppingListUseCase';
import { UpdateQuantityUseCase } from '../use-cases/UpdateQuantityUseCase';
import { ToggleItemStatusUseCase } from '../use-cases/ToggleItemStatusUseCase';
import { BulkActionsUseCase } from '../use-cases/BulkActionsUseCase';
import { ShoppingListAdapter } from '../../infrastructure/adapters/ShoppingListAdapter';
import type { ShoppingListRepository } from '../../domain/repositories/ShoppingListRepository';

export class ShoppingListService {
  private getShoppingListUseCase: GetShoppingListUseCase;
  private updateQuantityUseCase: UpdateQuantityUseCase;
  private toggleItemStatusUseCase: ToggleItemStatusUseCase;
  private bulkActionsUseCase: BulkActionsUseCase;

  constructor(private readonly repository: ShoppingListRepository) {
    this.getShoppingListUseCase = new GetShoppingListUseCase(repository);
    this.updateQuantityUseCase = new UpdateQuantityUseCase(repository);
    this.toggleItemStatusUseCase = new ToggleItemStatusUseCase(repository);
    this.bulkActionsUseCase = new BulkActionsUseCase(repository);
  }

  async getAllItems(): Promise<LegacyShoppingListItem[]> {
    const domainItems = await this.getShoppingListUseCase.execute();
    return ShoppingListAdapter.toLegacyArray(domainItems);
  }

  async getNeededItems(): Promise<LegacyShoppingListItem[]> {
    const domainItems = await this.getShoppingListUseCase.getNeededItems();
    return ShoppingListAdapter.toLegacyArray(domainItems);
  }

  async getBoughtItems(): Promise<LegacyShoppingListItem[]> {
    const domainItems = await this.getShoppingListUseCase.getBoughtItems();
    return ShoppingListAdapter.toLegacyArray(domainItems);
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