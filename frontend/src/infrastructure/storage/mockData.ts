import type { ShoppingListItem } from '../../domain/entities/ShoppingListItem';
import { Quantity } from '../../domain/value-objects/Quantity';
import { ItemStatusVO } from '../../domain/value-objects/ItemStatus';

// Initial mock data for MVP
export const initialShoppingList: ShoppingListItem[] = [
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