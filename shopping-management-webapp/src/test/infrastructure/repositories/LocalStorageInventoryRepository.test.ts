import { describe, it, expect, beforeEach } from 'vitest';
import { LocalStorageInventoryRepository } from '../../../infrastructure/repositories/LocalStorageInventoryRepository';
import { InventoryItem } from '../../../domain/model/InventoryItem';
import { ProductId } from '../../../domain/model/ProductId';
import { Quantity } from '../../../domain/model/Quantity';
import { UnitType } from '../../../domain/model/UnitType';

describe('LocalStorageInventoryRepository', () => {
  let repository: LocalStorageInventoryRepository;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    repository = new LocalStorageInventoryRepository();
  });

  describe('save()', () => {
    it('should save an inventory item to localStorage', async () => {
      // Arrange
      const productId = ProductId.fromString('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d');
      const quantity = Quantity.create(10);
      const unitType = UnitType.units();
      const item = new InventoryItem(productId, quantity, unitType);

      // Act
      await repository.save(item);

      // Assert
      const stored = localStorage.getItem('shopping_manager_inventory');
      expect(stored).not.toBeNull();

      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].productId).toBe('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d');
      expect(parsed[0].currentStock).toBe(10);
      expect(parsed[0].unitType).toBe('units');
    });

    it('should update an existing inventory item with the same productId', async () => {
      // Arrange
      const productId = ProductId.fromString('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d');
      const unitType = UnitType.units();

      const originalItem = new InventoryItem(productId, Quantity.create(10), unitType);
      await repository.save(originalItem);

      const updatedItem = new InventoryItem(productId, Quantity.create(5), unitType);

      // Act
      await repository.save(updatedItem);

      // Assert
      const allItems = await repository.findAll();
      expect(allItems).toHaveLength(1);
      expect(allItems[0].currentStock.value).toBe(5);
    });

    it('should save multiple different inventory items', async () => {
      // Arrange
      const productId1 = ProductId.fromString('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d');
      const productId2 = ProductId.fromString('b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e');
      const unitType = UnitType.units();

      const item1 = new InventoryItem(productId1, Quantity.create(10), unitType);
      const item2 = new InventoryItem(productId2, Quantity.create(20), unitType);

      // Act
      await repository.save(item1);
      await repository.save(item2);

      // Assert
      const allItems = await repository.findAll();
      expect(allItems).toHaveLength(2);
    });
  });

  describe('findAll()', () => {
    it('should return an empty array when no inventory items exist', async () => {
      // Act
      const items = await repository.findAll();

      // Assert
      expect(items).toEqual([]);
    });

    it('should return all saved inventory items', async () => {
      // Arrange
      const productId1 = ProductId.fromString('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d');
      const productId2 = ProductId.fromString('b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e');
      const unitType = UnitType.units();

      await repository.save(new InventoryItem(productId1, Quantity.create(10), unitType));
      await repository.save(new InventoryItem(productId2, Quantity.create(20), unitType));

      // Act
      const items = await repository.findAll();

      // Assert
      expect(items).toHaveLength(2);
      expect(items[0]).toBeInstanceOf(InventoryItem);
      expect(items[1]).toBeInstanceOf(InventoryItem);
      expect(items[0].currentStock.value).toBe(10);
      expect(items[1].currentStock.value).toBe(20);
    });

    it('should return inventory items with correct value objects', async () => {
      // Arrange
      const productId = ProductId.fromString('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d');
      const quantity = Quantity.create(15);
      const unitType = UnitType.units();
      const item = new InventoryItem(productId, quantity, unitType);

      await repository.save(item);

      // Act
      const items = await repository.findAll();

      // Assert
      expect(items[0].productId).toBeInstanceOf(ProductId);
      expect(items[0].productId.value).toBe('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d');
      expect(items[0].currentStock).toBeInstanceOf(Quantity);
      expect(items[0].currentStock.value).toBe(15);
      expect(items[0].unitType).toBeInstanceOf(UnitType);
      expect(items[0].unitType.value).toBe('units');
    });
  });

  describe('findByProductId()', () => {
    it('should return null when inventory item does not exist', async () => {
      // Arrange
      const productId = ProductId.fromString('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d');

      // Act
      const item = await repository.findByProductId(productId);

      // Assert
      expect(item).toBeNull();
    });

    it('should return the inventory item when it exists', async () => {
      // Arrange
      const productId = ProductId.fromString('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d');
      const quantity = Quantity.create(10);
      const unitType = UnitType.units();
      const savedItem = new InventoryItem(productId, quantity, unitType);

      await repository.save(savedItem);

      // Act
      const item = await repository.findByProductId(productId);

      // Assert
      expect(item).not.toBeNull();
      expect(item).toBeInstanceOf(InventoryItem);
      expect(item!.productId.value).toBe('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d');
      expect(item!.currentStock.value).toBe(10);
    });

    it('should return the correct inventory item when multiple items exist', async () => {
      // Arrange
      const productId1 = ProductId.fromString('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d');
      const productId2 = ProductId.fromString('b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e');
      const unitType = UnitType.units();

      await repository.save(new InventoryItem(productId1, Quantity.create(10), unitType));
      await repository.save(new InventoryItem(productId2, Quantity.create(20), unitType));

      // Act
      const item = await repository.findByProductId(productId2);

      // Assert
      expect(item).not.toBeNull();
      expect(item!.currentStock.value).toBe(20);
    });
  });
});