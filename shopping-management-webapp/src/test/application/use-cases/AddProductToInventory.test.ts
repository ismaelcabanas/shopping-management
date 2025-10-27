import { describe, it, expect, beforeEach } from 'vitest';
import { AddProductToInventory } from '../../../application/use-cases/AddProductToInventory';
import type { ProductRepository } from '../../../domain/repositories/ProductRepository';
import type { InventoryRepository } from '../../../domain/repositories/InventoryRepository';
import { Product } from '../../../domain/model/Product';
import { InventoryItem } from '../../../domain/model/InventoryItem';
import { ProductId } from '../../../domain/model/ProductId';

describe('AddProductToInventory Use Case', () => {
  let addProductToInventory: AddProductToInventory;
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

    addProductToInventory = new AddProductToInventory(
      productRepository,
      inventoryRepository
    );
  });

  it('should add a new product with initial quantity to inventory', async () => {
    // Arrange
    const input = {
      id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
      name: 'Leche',
      initialQuantity: 10,
    };

    // Act
    const product = await addProductToInventory.execute(input);

    // Assert
    expect(product.name).toBe('Leche');
    expect(product.id.value).toBe(input.id);

    // Verify product was saved in repository
    const savedProduct = await productRepository.findById(product.id);
    expect(savedProduct).not.toBeNull();
    expect(savedProduct?.name).toBe('Leche');

    // Verify inventory item was created and saved
    const inventoryItem = await inventoryRepository.findByProductId(product.id);
    expect(inventoryItem).not.toBeNull();
    expect(inventoryItem?.currentStock.value).toBe(10);
    expect(inventoryItem?.unitType.value).toBe('units');
  });

  it('should reject product with duplicate name', async () => {
    // Arrange - Add first product
    await addProductToInventory.execute({
      id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
      name: 'Leche',
      initialQuantity: 5,
    });

    // Act & Assert - Try to add product with same name
    await expect(
      addProductToInventory.execute({
        id: 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e',
        name: 'Leche',
        initialQuantity: 3,
      })
    ).rejects.toThrow('Product with name "Leche" already exists');
  });
});