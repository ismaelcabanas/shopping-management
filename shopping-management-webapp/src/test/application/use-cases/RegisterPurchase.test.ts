import { describe, it, expect, beforeEach } from 'vitest';
import { RegisterPurchase } from '../../../application/use-cases/RegisterPurchase';
import type { ProductRepository } from '../../../domain/repositories/ProductRepository';
import type { InventoryRepository } from '../../../domain/repositories/InventoryRepository';
import { Product } from '../../../domain/model/Product';
import { InventoryItem } from '../../../domain/model/InventoryItem';
import { ProductId } from '../../../domain/model/ProductId';
import { UnitType } from '../../../domain/model/UnitType';
import { Quantity } from '../../../domain/model/Quantity';

describe('RegisterPurchase Use Case', () => {
  let registerPurchase: RegisterPurchase;
  let productRepository: ProductRepository;
  let inventoryRepository: InventoryRepository;

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
      delete: async (id: ProductId) => {
        const index = products.findIndex(p => p.id.equals(id));
        if (index !== -1) products.splice(index, 1);
      },
    };

    inventoryRepository = {
      save: async (item: InventoryItem) => {
        // Upsert logic: update if exists, create if not
        const existingIndex = inventory.findIndex(i => i.productId.equals(item.productId));
        if (existingIndex !== -1) {
          inventory[existingIndex] = item;
        } else {
          inventory.push(item);
        }
      },
      findByProductId: async (productId: ProductId) => {
        return inventory.find(i => i.productId.equals(productId)) || null;
      },
      findAll: async () => inventory,
    };

    registerPurchase = new RegisterPurchase(
      productRepository,
      inventoryRepository
    );
  });

  it('should register purchase with one product and update inventory', async () => {
    // Arrange: Create a product first
    const productId = ProductId.fromString('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d');
    const product = new Product(productId, 'Leche', UnitType.units());
    await productRepository.save(product);

    // Create initial inventory
    const initialInventory = new InventoryItem(
      productId,
      Quantity.create(5),
      UnitType.units()
    );
    await inventoryRepository.save(initialInventory);

    // Act: Register purchase
    await registerPurchase.execute({
      items: [
        {
          productId: productId.value,
          quantity: 3,
        },
      ],
    });

    // Assert: Inventory should be updated
    const updatedInventory = await inventoryRepository.findByProductId(productId);
    expect(updatedInventory).not.toBeNull();
    expect(updatedInventory?.currentStock.value).toBe(8); // 5 + 3
  });

  it('should register purchase with multiple products', async () => {
    // Arrange: Create products
    const productId1 = ProductId.fromString('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d');
    const productId2 = ProductId.fromString('b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e');
    const product1 = new Product(productId1, 'Leche', UnitType.units());
    const product2 = new Product(productId2, 'Pan', UnitType.units());
    await productRepository.save(product1);
    await productRepository.save(product2);

    // Create initial inventory
    await inventoryRepository.save(
      new InventoryItem(productId1, Quantity.create(5), UnitType.units())
    );
    await inventoryRepository.save(
      new InventoryItem(productId2, Quantity.create(10), UnitType.units())
    );

    // Act: Register purchase
    await registerPurchase.execute({
      items: [
        { productId: productId1.value, quantity: 3 },
        { productId: productId2.value, quantity: 2 },
      ],
    });

    // Assert: Both inventories should be updated
    const inventory1 = await inventoryRepository.findByProductId(productId1);
    const inventory2 = await inventoryRepository.findByProductId(productId2);
    expect(inventory1?.currentStock.value).toBe(8); // 5 + 3
    expect(inventory2?.currentStock.value).toBe(12); // 10 + 2
  });

  it('should create inventory item if it does not exist', async () => {
    // Arrange: Create a product without inventory
    const productId = ProductId.fromString('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d');
    const product = new Product(productId, 'Leche', UnitType.units());
    await productRepository.save(product);

    // Act: Register purchase
    await registerPurchase.execute({
      items: [
        {
          productId: productId.value,
          quantity: 5,
        },
      ],
    });

    // Assert: Inventory should be created
    const inventory = await inventoryRepository.findByProductId(productId);
    expect(inventory).not.toBeNull();
    expect(inventory?.currentStock.value).toBe(5);
  });

  it('should sum quantities to existing inventory correctly', async () => {
    // Arrange: Create product with inventory
    const productId = ProductId.fromString('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d');
    const product = new Product(productId, 'Leche', UnitType.units());
    await productRepository.save(product);

    const initialInventory = new InventoryItem(
      productId,
      Quantity.create(100),
      UnitType.units()
    );
    await inventoryRepository.save(initialInventory);

    // Act: Register purchase
    await registerPurchase.execute({
      items: [{ productId: productId.value, quantity: 50 }],
    });

    // Assert: Inventory should be summed correctly
    const inventory = await inventoryRepository.findByProductId(productId);
    expect(inventory?.currentStock.value).toBe(150); // 100 + 50
  });

  it('should throw error if purchase has no items', async () => {
    // Act & Assert
    await expect(
      registerPurchase.execute({ items: [] })
    ).rejects.toThrow('Purchase must have at least one item');
  });

  it('should throw error if quantity is zero', async () => {
    // Arrange: Create a product
    const productId = ProductId.fromString('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d');
    const product = new Product(productId, 'Leche', UnitType.units());
    await productRepository.save(product);

    // Act & Assert
    await expect(
      registerPurchase.execute({
        items: [{ productId: productId.value, quantity: 0 }],
      })
    ).rejects.toThrow('Purchase quantity must be greater than 0');
  });

  it('should throw error if quantity is negative', async () => {
    // Arrange: Create a product
    const productId = ProductId.fromString('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d');
    const product = new Product(productId, 'Leche', UnitType.units());
    await productRepository.save(product);

    // Act & Assert
    await expect(
      registerPurchase.execute({
        items: [{ productId: productId.value, quantity: -5 }],
      })
    ).rejects.toThrow('Quantity cannot be negative');
  });

  it('should throw error if product does not exist', async () => {
    // Arrange: Use a product ID that doesn't exist
    const nonExistentId = 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d';

    // Act & Assert
    await expect(
      registerPurchase.execute({
        items: [{ productId: nonExistentId, quantity: 5 }],
      })
    ).rejects.toThrow(`Product with id ${nonExistentId} not found`);
  });

  it('should handle repository errors gracefully', async () => {
    // Arrange: Create a failing repository
    const failingProductRepository: ProductRepository = {
      ...productRepository,
      findById: async () => {
        throw new Error('Database connection error');
      },
    };

    const failingRegisterPurchase = new RegisterPurchase(
      failingProductRepository,
      inventoryRepository
    );

    // Act & Assert
    await expect(
      failingRegisterPurchase.execute({
        items: [
          {
            productId: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
            quantity: 5,
          },
        ],
      })
    ).rejects.toThrow('Database connection error');
  });
});
