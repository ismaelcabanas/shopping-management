// Types for Shopping Manager MVP

export interface ShoppingListItem {
  id: string;
  productName: string;
  quantity: number;
  unit: string;
  status: 'needed' | 'bought';
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  defaultUnit: string;
}