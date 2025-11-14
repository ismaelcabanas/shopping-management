import { describe, it, expect } from 'vitest';
import { PurchaseId } from '../../../domain/model/PurchaseId';

describe('PurchaseId', () => {
  describe('generate', () => {
    it('should generate a valid PurchaseId', () => {
      const purchaseId = PurchaseId.generate();
      expect(purchaseId).toBeInstanceOf(PurchaseId);
      expect(purchaseId.value).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    });

    it('should generate unique ids', () => {
      const id1 = PurchaseId.generate();
      const id2 = PurchaseId.generate();
      expect(id1.value).not.toBe(id2.value);
    });
  });

  describe('fromString', () => {
    it('should create PurchaseId from valid UUID string', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      const purchaseId = PurchaseId.fromString(uuid);
      expect(purchaseId.value).toBe(uuid);
    });

    it('should throw error for invalid UUID format', () => {
      expect(() => PurchaseId.fromString('invalid-uuid')).toThrow('Invalid UUID format');
    });
  });

  describe('equals', () => {
    it('should return true for equal PurchaseIds', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      const id1 = PurchaseId.fromString(uuid);
      const id2 = PurchaseId.fromString(uuid);
      expect(id1.equals(id2)).toBe(true);
    });

    it('should return false for different PurchaseIds', () => {
      const id1 = PurchaseId.generate();
      const id2 = PurchaseId.generate();
      expect(id1.equals(id2)).toBe(false);
    });
  });
});
