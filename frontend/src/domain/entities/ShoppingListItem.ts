// Domain Entity: ShoppingListItem
import type { ItemStatusVO } from '../value-objects/ItemStatus';
import type { Quantity } from '../value-objects/Quantity';

export interface ShoppingListItem {
  id: string;
  productName: string;
  quantity: Quantity;
  unit: string;
  status: ItemStatusVO;
  createdAt: Date;
  updatedAt: Date;
}