// Infrastructure: Adapter to connect Clean Architecture with React components
import type { ShoppingListItem as DomainShoppingListItem } from '../../domain/entities/ShoppingListItem';
import type { ShoppingListItem as LegacyShoppingListItem } from '../../types';
import { ItemStatusVO } from '../../domain/value-objects/ItemStatus';
import { Quantity } from '../../domain/value-objects/Quantity';

export class ShoppingListAdapter {
  // Convert from Domain entity to Legacy type (for React components)
  static toLegacy(domainItem: DomainShoppingListItem): LegacyShoppingListItem {
    return {
      id: domainItem.id,
      productName: domainItem.productName,
      quantity: domainItem.quantity.getValue(),
      unit: domainItem.unit,
      status: domainItem.status.getValue(),
      createdAt: domainItem.createdAt,
      updatedAt: domainItem.updatedAt
    };
  }

  // Convert from Legacy type to Domain entity
  static toDomain(legacyItem: LegacyShoppingListItem): DomainShoppingListItem {
    return {
      id: legacyItem.id,
      productName: legacyItem.productName,
      quantity: Quantity.create(legacyItem.quantity),
      unit: legacyItem.unit,
      status: ItemStatusVO.fromString(legacyItem.status),
      createdAt: legacyItem.createdAt,
      updatedAt: legacyItem.updatedAt
    };
  }

  // Convert array from Domain to Legacy
  static toLegacyArray(domainItems: DomainShoppingListItem[]): LegacyShoppingListItem[] {
    return domainItems.map(this.toLegacy);
  }

  // Convert array from Legacy to Domain
  static toDomainArray(legacyItems: LegacyShoppingListItem[]): DomainShoppingListItem[] {
    return legacyItems.map(this.toDomain);
  }
}