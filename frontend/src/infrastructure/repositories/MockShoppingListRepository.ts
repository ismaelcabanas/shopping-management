// Infrastructure: Mock Repository Implementation
import type { ShoppingListRepository } from '../../domain/repositories/ShoppingListRepository';
import type { ShoppingListItem } from '../../domain/entities/ShoppingListItem';
import { ItemStatusVO } from '../../domain/value-objects/ItemStatus';
import { Quantity } from '../../domain/value-objects/Quantity';

export class MockShoppingListRepository implements ShoppingListRepository {
  private items: ShoppingListItem[] = [
    {
      id: '1',
      productName: 'Pan',
      quantity: Quantity.create(2),
      unit: 'ud',
      status: ItemStatusVO.needed(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      productName: 'Leche Entera',
      quantity: Quantity.create(1),
      unit: 'L',
      status: ItemStatusVO.needed(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      productName: 'Tomates',
      quantity: Quantity.create(1),
      unit: 'kg',
      status: ItemStatusVO.needed(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '4',
      productName: 'Brócoli',
      quantity: Quantity.create(1),
      unit: 'ud',
      status: ItemStatusVO.needed(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '5',
      productName: 'Plátanos',
      quantity: Quantity.create(6),
      unit: 'ud',
      status: ItemStatusVO.needed(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  async findAll(): Promise<ShoppingListItem[]> {
    return [...this.items];
  }

  async findById(id: string): Promise<ShoppingListItem | null> {
    const item = this.items.find(item => item.id === id);
    return item || null;
  }

  async save(item: ShoppingListItem): Promise<void> {
    this.items.push(item);
  }

  async update(item: ShoppingListItem): Promise<void> {
    const index = this.items.findIndex(i => i.id === item.id);
    if (index !== -1) {
      this.items[index] = item;
    }
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter(item => item.id !== id);
  }

  async markAllAsBought(): Promise<void> {
    this.items = this.items.map(item => ({
      ...item,
      status: ItemStatusVO.bought(),
      updatedAt: new Date()
    }));
  }

  async markAllAsNeeded(): Promise<void> {
    this.items = this.items.map(item => ({
      ...item,
      status: ItemStatusVO.needed(),
      updatedAt: new Date()
    }));
  }
}