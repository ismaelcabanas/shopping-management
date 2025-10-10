// Domain Entity: ShoppingListItem
import type { ItemStatus } from '../value-objects/ItemStatus';
import type { Quantity } from '../value-objects/Quantity';

export interface ShoppingListItem {
  id: string;
  productName: string;
  quantity: Quantity;
  unit: string;
  status: ItemStatus;
  createdAt: Date;
  updatedAt: Date;
}