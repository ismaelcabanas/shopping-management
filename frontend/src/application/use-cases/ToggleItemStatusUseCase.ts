// Application Use Case: Toggle Item Status
import type { ShoppingListRepository } from '../../domain/repositories/ShoppingListRepository';
import { ItemStatusVO } from '../../domain/value-objects/ItemStatus';

export class ToggleItemStatusUseCase {
  constructor(private readonly repository: ShoppingListRepository) {}

  async execute(itemId: string): Promise<void> {
    const item = await this.repository.findById(itemId);

    if (!item) {
      throw new Error(`Shopping list item with id ${itemId} not found`);
    }

    // Convert current status to Value Object and toggle
    const currentStatus = ItemStatusVO.fromString(item.status.getValue());
    const newStatus = currentStatus.toggle();

    const updatedItem = {
      ...item,
      status: newStatus,
      updatedAt: new Date()
    };

    await this.repository.update(updatedItem);
  }
}