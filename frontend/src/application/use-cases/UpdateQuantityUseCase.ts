// Application Use Case: Update Quantity
import type { ShoppingListRepository } from '../../domain/repositories/ShoppingListRepository';
import { Quantity } from '../../domain/value-objects/Quantity';

export class UpdateQuantityUseCase {
  constructor(private readonly repository: ShoppingListRepository) {}

  async execute(itemId: string, newQuantity: number): Promise<void> {
    const item = await this.repository.findById(itemId);

    if (!item) {
      throw new Error(`Shopping list item with id ${itemId} not found`);
    }

    const quantity = Quantity.create(newQuantity);

    const updatedItem = {
      ...item,
      quantity,
      updatedAt: new Date()
    };

    await this.repository.update(updatedItem);
  }
}