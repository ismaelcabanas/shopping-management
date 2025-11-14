import { describe, it, expect } from 'vitest';
import { Purchase } from '../../../domain/model/Purchase';
import { PurchaseId } from '../../../domain/model/PurchaseId';
import { PurchaseItem } from '../../../domain/model/PurchaseItem';
import { ProductId } from '../../../domain/model/ProductId';
import { Quantity } from '../../../domain/model/Quantity';

describe('Purchase', () => {
  describe('constructor', () => {
    it('should create a valid Purchase', () => {
      const purchaseId = PurchaseId.generate();
      const purchaseDate = new Date();
      const items = [
        new PurchaseItem(
          ProductId.fromString('123e4567-e89b-12d3-a456-426614174000'),
          Quantity.create(5)
        ),
      ];

      const purchase = new Purchase(purchaseId, purchaseDate, items);

      expect(purchase.id).toBe(purchaseId);
      expect(purchase.purchaseDate).toBe(purchaseDate);
      expect(purchase.items).toBe(items);
    });
  });

  describe('totalQuantity', () => {
    it('should return sum of all item quantities', () => {
      const purchaseId = PurchaseId.generate();
      const purchaseDate = new Date();
      const items = [
        new PurchaseItem(
          ProductId.fromString('123e4567-e89b-12d3-a456-426614174000'),
          Quantity.create(5)
        ),
        new PurchaseItem(
          ProductId.fromString('223e4567-e89b-12d3-a456-426614174000'),
          Quantity.create(3)
        ),
        new PurchaseItem(
          ProductId.fromString('323e4567-e89b-12d3-a456-426614174000'),
          Quantity.create(2)
        ),
      ];

      const purchase = new Purchase(purchaseId, purchaseDate, items);

      expect(purchase.totalQuantity).toBe(10);
    });

    it('should return 0 for empty items', () => {
      const purchaseId = PurchaseId.generate();
      const purchaseDate = new Date();
      const items: PurchaseItem[] = [];

      const purchase = new Purchase(purchaseId, purchaseDate, items);

      expect(purchase.totalQuantity).toBe(0);
    });
  });

  describe('validate', () => {
    it('should not throw error for valid purchase with items', () => {
      const purchaseId = PurchaseId.generate();
      const purchaseDate = new Date();
      const items = [
        new PurchaseItem(
          ProductId.fromString('123e4567-e89b-12d3-a456-426614174000'),
          Quantity.create(5)
        ),
      ];

      const purchase = new Purchase(purchaseId, purchaseDate, items);

      expect(() => purchase.validate()).not.toThrow();
    });

    it('should throw error when purchase has no items', () => {
      const purchaseId = PurchaseId.generate();
      const purchaseDate = new Date();
      const items: PurchaseItem[] = [];

      const purchase = new Purchase(purchaseId, purchaseDate, items);

      expect(() => purchase.validate()).toThrow('Purchase must have at least one item');
    });
  });
});
