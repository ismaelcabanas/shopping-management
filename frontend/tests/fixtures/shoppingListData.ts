import { ShoppingListItem } from '../../src/domain/entities/ShoppingListItem'
import { ItemStatusVO } from '../../src/domain/value-objects/ItemStatus'
import { Quantity } from '../../src/domain/value-objects/Quantity'

/**
 * Test fixtures for shopping list data
 * Provides consistent test data across integration and e2e tests
 */

export const createTestShoppingListItem = (
  overrides: Partial<ShoppingListItem> = {}
): ShoppingListItem => ({
  id: 'test-item-1',
  productName: 'Test Product',
  quantity: Quantity.create(1),
  unit: 'ud',
  status: ItemStatusVO.needed(),
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: new Date('2024-01-01T00:00:00Z'),
  ...overrides
})

export const testShoppingListItems: ShoppingListItem[] = [
  createTestShoppingListItem({
    id: '1',
    productName: 'Apples',
    quantity: Quantity.create(6),
    unit: 'ud',
    status: ItemStatusVO.needed()
  }),
  createTestShoppingListItem({
    id: '2',
    productName: 'Bread',
    quantity: Quantity.create(2),
    unit: 'ud',
    status: ItemStatusVO.bought()
  }),
  createTestShoppingListItem({
    id: '3',
    productName: 'Milk',
    quantity: Quantity.create(1),
    unit: 'l',
    status: ItemStatusVO.needed()
  }),
  createTestShoppingListItem({
    id: '4',
    productName: 'Cheese',
    quantity: Quantity.create(250),
    unit: 'g',
    status: ItemStatusVO.bought()
  }),
  createTestShoppingListItem({
    id: '5',
    productName: 'Tomatoes',
    quantity: Quantity.create(1),
    unit: 'kg',
    status: ItemStatusVO.needed()
  })
]

export const neededItems = testShoppingListItems.filter(item =>
  item.status.isNeeded()
)

export const boughtItems = testShoppingListItems.filter(item =>
  item.status.isBought()
)

// Legacy format data for adapter testing
export const legacyShoppingListItems = [
  {
    id: '1',
    productName: 'Apples',
    quantity: 6,
    unit: 'ud',
    status: 'needed',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    productName: 'Bread',
    quantity: 2,
    unit: 'ud',
    status: 'bought',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  }
]

// Edge case data for testing
export const edgeCaseItems = {
  maxQuantity: createTestShoppingListItem({
    id: 'max-qty',
    productName: 'Max Quantity Item',
    quantity: Quantity.create(999999),
    unit: 'ud',
    status: ItemStatusVO.needed()
  }),

  minQuantity: createTestShoppingListItem({
    id: 'min-qty',
    productName: 'Min Quantity Item',
    quantity: Quantity.create(1),
    unit: 'ud',
    status: ItemStatusVO.needed()
  }),

  longProductName: createTestShoppingListItem({
    id: 'long-name',
    productName: 'This is a very long product name that might cause issues with UI layout and should be handled properly by the system',
    quantity: Quantity.create(3),
    unit: 'ud',
    status: ItemStatusVO.needed()
  }),

  specialCharacters: createTestShoppingListItem({
    id: 'special-chars',
    productName: 'Piña Colada 🍹 & café ñandú',
    quantity: Quantity.create(2),
    unit: 'l',
    status: ItemStatusVO.bought()
  })
}