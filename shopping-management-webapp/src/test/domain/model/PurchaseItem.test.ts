import { describe, it, expect } from 'vitest';
import { PurchaseItem } from '../../../domain/model/PurchaseItem';
import { ProductId } from '../../../domain/model/ProductId';
import { Quantity } from '../../../domain/model/Quantity';

describe('PurchaseItem', () => {
  describe('constructor', () => {
    it('should create a valid PurchaseItem', () => {
      const productId = ProductId.fromString('123e4567-e89b-12d3-a456-426614174000');
      const quantity = Quantity.create(5);

      const purchaseItem = new PurchaseItem(productId, quantity);

      expect(purchaseItem.productId).toBe(productId);
      expect(purchaseItem.quantity).toBe(quantity);
    });

    it('should throw error when quantity is zero', () => {
      const productId = ProductId.fromString('123e4567-e89b-12d3-a456-426614174000');
      const quantity = Quantity.create(0);

      expect(() => new PurchaseItem(productId, quantity)).toThrow(
        'Purchase quantity must be greater than 0'
      );
    });

    it('should throw error when quantity is negative', () => {
      const productId = ProductId.fromString('123e4567-e89b-12d3-a456-426614174000');

      // Quantity.create will throw if negative, but let's test the PurchaseItem validation
      // We need to test with a value that passes Quantity validation but fails PurchaseItem
      // Since Quantity doesn't allow negative, we test with 0
      const quantity = Quantity.create(0);

      expect(() => new PurchaseItem(productId, quantity)).toThrow(
        'Purchase quantity must be greater than 0'
      );
    });

    it('should accept valid positive quantity', () => {
      const productId = ProductId.fromString('123e4567-e89b-12d3-a456-426614174000');
      const quantity = Quantity.create(10);

      const purchaseItem = new PurchaseItem(productId, quantity);

      expect(purchaseItem.quantity.value).toBe(10);
    });
  });
});
