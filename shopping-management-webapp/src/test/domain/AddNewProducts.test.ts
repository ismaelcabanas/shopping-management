import { describe, it, expect } from 'vitest';
import { Product } from '../../domain/model/Product';
import { InventoryItem } from '../../domain/model/InventoryItem';
import { ProductId } from '../../domain/model/ProductId';
import { UnitType } from '../../domain/model/UnitType';
import { Quantity } from '../../domain/model/Quantity';

describe('Product Domain - Add Products Feature', () => {
  describe('Creating a new product', () => {
    it('should create a product with valid UUID and name', () => {
      // Arrange
      const uuid = 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d';
      const productId = ProductId.fromString(uuid);
      const name = 'Leche';
      const unitType = UnitType.units();

      // Act
      const product = new Product(productId, name, unitType);

      // Assert
      expect(product.id).toBe(productId);
      expect(product.name).toBe(name);
      expect(product.unitType).toBe(unitType);
    });

    it('should reject product with empty name', () => {
      // Arrange
      const uuid = 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d';
      const productId = ProductId.fromString(uuid);
      const emptyName = '';
      const unitType = UnitType.units();

      // Act & Assert
      expect(() => new Product(productId, emptyName, unitType)).toThrow('Product name cannot be empty');
    });

    it('should reject product with name shorter than 2 characters', () => {
      // Arrange
      const uuid = 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d';
      const productId = ProductId.fromString(uuid);
      const shortName = 'L';
      const unitType = UnitType.units();

      // Act & Assert
      expect(() => new Product(productId, shortName, unitType)).toThrow('Product name must be at least 2 characters');
    });

    it('should reject invalid unit types (not "units")', () => {
      // Act & Assert
      expect(() => UnitType.create('liters')).toThrow('Only "units" is supported in this iteration');
      expect(() => UnitType.create('kg')).toThrow('Only "units" is supported in this iteration');
    });
  });

  describe('ProductId value object', () => {
    it('should create ProductId from valid UUID provided by client', () => {
      // Arrange
      const uuid = 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d';

      // Act
      const productId = ProductId.fromString(uuid);

      // Assert
      expect(productId.value).toBe(uuid);
    });

    it('should reject invalid UUID format', () => {
      // Arrange
      const invalidUuid = 'not-a-uuid';

      // Act & Assert
      expect(() => ProductId.fromString(invalidUuid)).toThrow('Invalid UUID format');
    });

    it('should compare ProductIds by value', () => {
      // Arrange
      const uuid = 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d';
      const productId1 = ProductId.fromString(uuid);
      const productId2 = ProductId.fromString(uuid);

      // Act & Assert
      expect(productId1.equals(productId2)).toBe(true);
    });
  });

  describe('Creating an inventory item for a product', () => {
    it('should create inventory item with initial quantity', () => {
      // Arrange
      const uuid = 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d';
      const productId = ProductId.fromString(uuid);
      const initialQuantity = Quantity.create(10);
      const unitType = UnitType.units();

      // Act
      const inventoryItem = new InventoryItem(productId, initialQuantity, unitType);

      // Assert
      expect(inventoryItem.productId).toBe(productId);
      expect(inventoryItem.currentStock.value).toBe(10);
      expect(inventoryItem.unitType).toBe(unitType);
    });

    it('should create inventory item with zero initial quantity', () => {
      // Arrange
      const uuid = 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d';
      const productId = ProductId.fromString(uuid);
      const zeroQuantity = Quantity.create(0);
      const unitType = UnitType.units();

      // Act
      const inventoryItem = new InventoryItem(productId, zeroQuantity, unitType);

      // Assert
      expect(inventoryItem.currentStock.value).toBe(0);
    });

    it('should reject negative quantities', () => {
      // Act & Assert
      expect(() => Quantity.create(-5)).toThrow('Quantity cannot be negative');
    });

    it('should update inventory stock immutably', () => {
      // Arrange
      const uuid = 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d';
      const productId = ProductId.fromString(uuid);
      const initialQuantity = Quantity.create(10);
      const unitType = UnitType.units();
      const inventoryItem = new InventoryItem(productId, initialQuantity, unitType);

      // Act
      const updatedInventoryItem = inventoryItem.updateStock(Quantity.create(15));

      // Assert
      expect(inventoryItem.currentStock.value).toBe(10); // Original unchanged
      expect(updatedInventoryItem.currentStock.value).toBe(15); // New instance with updated stock
    });
  });

  describe('Complete workflow: adding a product with inventory', () => {
    it('should create a product and its inventory item together', () => {
      // Arrange - UUID provided by client
      const uuid = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
      const productId = ProductId.fromString(uuid);
      const productName = 'Pan';
      const unitType = UnitType.units();
      const initialQuantity = Quantity.create(5);

      // Act - Create product
      const product = new Product(productId, productName, unitType);

      // Act - Create inventory item for the product
      const inventoryItem = new InventoryItem(product.id, initialQuantity, product.unitType);

      // Assert
      expect(product.name).toBe('Pan');
      expect(inventoryItem.productId.equals(product.id)).toBe(true);
      expect(inventoryItem.currentStock.value).toBe(5);
      expect(inventoryItem.unitType.value).toBe('units');
    });
  });
});