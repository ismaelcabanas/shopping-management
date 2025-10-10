// Domain Repository Interface
import type { ShoppingListItem } from '../entities/ShoppingListItem';

export interface ShoppingListRepository {
  findAll(): Promise<ShoppingListItem[]>;
  findById(id: string): Promise<ShoppingListItem | null>;
  save(item: ShoppingListItem): Promise<void>;
  update(item: ShoppingListItem): Promise<void>;
  delete(id: string): Promise<void>;
  markAllAsBought(): Promise<void>;
  markAllAsNeeded(): Promise<void>;
}