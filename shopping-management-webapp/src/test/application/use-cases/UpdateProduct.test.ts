import { describe, it, expect, beforeEach } from 'vitest';
import { UpdateProduct } from '../../../application/use-cases/UpdateProduct';
import type { ProductRepository } from '../../../domain/repositories/ProductRepository';
import { Product } from '../../../domain/model/Product';
import { ProductId } from '../../../domain/model/ProductId';
import { UnitType } from '../../../domain/model/UnitType';

describe('UpdateProduct Use Case', () => {
  let updateProduct: UpdateProduct;
  let productRepository: ProductRepository;
  let products: Product[];

  beforeEach(() => {
    // Create in-memory mock repository
    products = [];

    productRepository = {
      save: async (product: Product) => {
        // Upsert: update if exists, insert if not
        const index = products.findIndex(p => p.id.equals(product.id));
        if (index !== -1) {
          products[index] = product;
        } else {
          products.push(product);
        }
      },
      findAll: async () => products,
      findById: async (id: ProductId) => {
        return products.find(p => p.id.equals(id)) || null;
      },
      findByName: async (name: string) => {
        return products.find(p => p.name.toLowerCase() === name.toLowerCase()) || null;
      },
    };

    updateProduct = new UpdateProduct(productRepository);
  });

  it('should update an existing product successfully', async () => {
    // Arrange
    const productId = ProductId.fromString('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d');
    const originalProduct = new Product(productId, 'Leche', UnitType.liters());
    await productRepository.save(originalProduct);

    // Act
    await updateProduct.execute({
      id: productId.value,
      name: 'Leche Desnatada',
      unitType: 'liters',
    });

    // Assert
    const updatedProduct = await productRepository.findById(productId);
    expect(updatedProduct).not.toBeNull();
    expect(updatedProduct?.name).toBe('Leche Desnatada');
    expect(updatedProduct?.unitType.value).toBe('liters');
  });

  it('should throw error when product does not exist', async () => {
    // Arrange
    const nonExistentId = 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d';

    // Act & Assert
    await expect(
      updateProduct.execute({
        id: nonExistentId,
        name: 'Product',
        unitType: 'units',
      })
    ).rejects.toThrow('Product not found');
  });

  it('should throw error when new name already exists in another product', async () => {
    // Arrange
    const productId1 = ProductId.fromString('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d');
    const productId2 = ProductId.fromString('b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e');

    await productRepository.save(new Product(productId1, 'Leche', UnitType.liters()));
    await productRepository.save(new Product(productId2, 'Pan', UnitType.units()));

    // Act & Assert
    await expect(
      updateProduct.execute({
        id: productId1.value,
        name: 'Pan', // This name already exists
        unitType: 'liters',
      })
    ).rejects.toThrow('Product name already exists');
  });

  it('should allow updating product with same name (no change in name)', async () => {
    // Arrange
    const productId = ProductId.fromString('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d');
    await productRepository.save(new Product(productId, 'Leche', UnitType.liters()));

    // Act
    await updateProduct.execute({
      id: productId.value,
      name: 'Leche', // Same name, just changing unit
      unitType: 'liters',
    });

    // Assert
    const updatedProduct = await productRepository.findById(productId);
    expect(updatedProduct).not.toBeNull();
    expect(updatedProduct?.name).toBe('Leche');
  });

  it('should validate product name (minimum 2 characters)', async () => {
    // Arrange
    const productId = ProductId.fromString('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d');
    await productRepository.save(new Product(productId, 'Leche', UnitType.liters()));

    // Act & Assert
    await expect(
      updateProduct.execute({
        id: productId.value,
        name: 'A', // Less than 2 characters
        unitType: 'liters',
      })
    ).rejects.toThrow('Product name must be at least 2 characters');
  });

  it('should validate unit type', async () => {
    // Arrange
    const productId = ProductId.fromString('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d');
    await productRepository.save(new Product(productId, 'Leche', UnitType.liters()));

    // Act & Assert
    await expect(
      updateProduct.execute({
        id: productId.value,
        name: 'Leche',
        unitType: 'invalid-unit', // Invalid unit type
      })
    ).rejects.toThrow();
  });
});