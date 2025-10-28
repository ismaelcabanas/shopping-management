import { describe, it, expect, beforeEach } from 'vitest';
import { GetProductsWithInventory } from '../../../application/use-cases/GetProductsWithInventory';
import type { ProductRepository } from '../../../domain/repositories/ProductRepository';
import type { InventoryRepository } from '../../../domain/repositories/InventoryRepository';
import { Product } from '../../../domain/model/Product';
import { InventoryItem } from '../../../domain/model/InventoryItem';
import { ProductId } from '../../../domain/model/ProductId';
import { UnitType } from '../../../domain/model/UnitType';
import { Quantity } from '../../../domain/model/Quantity';

describe('GetProductsWithInventory - Use Case Tests (TDD)', () => {
  let productRepository: ProductRepository;
  let inventoryRepository: InventoryRepository;
  let useCase: GetProductsWithInventory;

  beforeEach(() => {
    // Create in-memory mock repositories
    const products: Product[] = [];
    const inventory: InventoryItem[] = [];

    productRepository = {
      save: async (product: Product) => {
        products.push(product);
      },
      findAll: async () => products,
      findById: async (id: ProductId) => {
        return products.find(p => p.id.equals(id)) || null;
      },
      findByName: async (name: string) => {
        return products.find(p => p.name.toLowerCase() === name.toLowerCase()) || null;
      },
    };

    inventoryRepository = {
      save: async (item: InventoryItem) => {
        inventory.push(item);
      },
      findByProductId: async (productId: ProductId) => {
        return inventory.find(i => i.productId.equals(productId)) || null;
      },
      findAll: async () => inventory,
    };

    useCase = new GetProductsWithInventory(productRepository, inventoryRepository);
  });

  it('should return empty array when no products exist', async () => {
    const result = await useCase.execute();

    expect(result).toEqual([]);
  });

  it('should return products with their inventory quantities', async () => {
    // Arrange: Add products
    const product1 = new Product(ProductId.fromString('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d'), 'Leche', UnitType.units());
    const product2 = new Product(ProductId.fromString('b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e'), 'Pan', UnitType.units());

    await productRepository.save(product1);
    await productRepository.save(product2);

    // Arrange: Add inventory
    const inventory1 = new InventoryItem(product1.id, Quantity.create(2), UnitType.units());
    const inventory2 = new InventoryItem(product2.id, Quantity.create(3), UnitType.units());

    await inventoryRepository.save(inventory1);
    await inventoryRepository.save(inventory2);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
      name: 'Leche',
      quantity: 2,
      unitType: 'units',
    });
    expect(result[1]).toEqual({
      id: 'b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e',
      name: 'Pan',
      quantity: 3,
      unitType: 'units',
    });
  });

  it('should return products sorted alphabetically by name', async () => {
    // Arrange: Add products in non-alphabetical order
    const product1 = new Product(ProductId.fromString('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d'), 'Zumo', UnitType.units());
    const product2 = new Product(ProductId.fromString('b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e'), 'Azúcar', UnitType.units());
    const product3 = new Product(ProductId.fromString('c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f'), 'Pan', UnitType.units());

    await productRepository.save(product1);
    await productRepository.save(product2);
    await productRepository.save(product3);

    // Arrange: Add inventory
    await inventoryRepository.save(new InventoryItem(product1.id, Quantity.create(5), UnitType.units()));
    await inventoryRepository.save(new InventoryItem(product2.id, Quantity.create(10), UnitType.units()));
    await inventoryRepository.save(new InventoryItem(product3.id, Quantity.create(3), UnitType.units()));

    // Act
    const result = await useCase.execute();

    // Assert: Should be sorted alphabetically
    expect(result[0].name).toBe('Azúcar');
    expect(result[1].name).toBe('Pan');
    expect(result[2].name).toBe('Zumo');
  });

  it('should return 0 quantity when product has no inventory', async () => {
    // Arrange: Add product without inventory
    const product = new Product(ProductId.fromString('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d'), 'Leche', UnitType.units());
    await productRepository.save(product);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0].quantity).toBe(0);
  });

  it('should handle multiple products with mixed inventory states', async () => {
    // Arrange: Products
    const product1 = new Product(ProductId.fromString('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d'), 'Leche', UnitType.units());
    const product2 = new Product(ProductId.fromString('b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e'), 'Pan', UnitType.units());
    const product3 = new Product(ProductId.fromString('c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f'), 'Huevos', UnitType.units());

    await productRepository.save(product1);
    await productRepository.save(product2);
    await productRepository.save(product3);

    // Arrange: Inventory - only for product1 and product3
    await inventoryRepository.save(new InventoryItem(product1.id, Quantity.create(2), UnitType.units()));
    await inventoryRepository.save(new InventoryItem(product3.id, Quantity.create(12), UnitType.units()));

    // Act
    const result = await useCase.execute();

    // Assert
    expect(result).toHaveLength(3);
    const leche = result.find(p => p.name === 'Leche');
    const pan = result.find(p => p.name === 'Pan');
    const huevos = result.find(p => p.name === 'Huevos');

    expect(leche?.quantity).toBe(2);
    expect(pan?.quantity).toBe(0); // No inventory
    expect(huevos?.quantity).toBe(12);
  });

  it('should return correct ProductWithInventory structure', async () => {
    // Arrange
    const product = new Product(ProductId.fromString('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d'), 'Café', UnitType.units());
    await productRepository.save(product);
    await inventoryRepository.save(new InventoryItem(product.id, Quantity.create(5), UnitType.units()));

    // Act
    const result = await useCase.execute();

    // Assert: Verify structure
    expect(result[0]).toHaveProperty('id');
    expect(result[0]).toHaveProperty('name');
    expect(result[0]).toHaveProperty('quantity');
    expect(result[0]).toHaveProperty('unitType');
    expect(typeof result[0].id).toBe('string');
    expect(typeof result[0].name).toBe('string');
    expect(typeof result[0].quantity).toBe('number');
    expect(result[0].unitType).toBe('units');
  });
});