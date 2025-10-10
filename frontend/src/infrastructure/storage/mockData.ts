import type { ShoppingListItem } from '../types';

// Initial mock data for MVP
export const initialShoppingList: ShoppingListItem[] = [
  {
    id: '1',
    productName: 'Pan',
    quantity: 2,
    unit: 'ud',
    status: 'needed',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    productName: 'Leche Entera',
    quantity: 1,
    unit: 'L',
    status: 'needed',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    productName: 'Tomates',
    quantity: 1,
    unit: 'kg',
    status: 'needed',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    productName: 'Brócoli',
    quantity: 1,
    unit: 'ud',
    status: 'needed',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '5',
    productName: 'Plátanos',
    quantity: 6,
    unit: 'ud',
    status: 'needed',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];