// Legacy types for React components compatibility
// These represent the "plain" data structures used by UI components
// before Clean Architecture implementation

export interface ShoppingListItem {
  id: string
  productName: string
  quantity: number  // Plain number (not Value Object)
  unit: string
  status: 'needed' | 'bought'  // Plain string (not Value Object)
  createdAt: Date
  updatedAt: Date
}