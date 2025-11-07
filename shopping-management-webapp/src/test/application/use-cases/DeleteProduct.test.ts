import { describe, it, expect, beforeEach } from 'vitest';
import { DeleteProduct } from '../../../application/use-cases/DeleteProduct';
import type { ProductRepository } from '../../../domain/repositories/ProductRepository';
import { Product } from '../../../domain/model/Product';
import { ProductId } from '../../../domain/model/ProductId';
import { UnitType } from '../../../domain/model/UnitType';

describe('DeleteProduct Use Case', () => {
  let deleteProduct: DeleteProduct;
  let productRepository: ProductRepository;
  let products: Product[];

  beforeEach(() => {
    // Create in-memory mock repository
    products = [];

    productRepository = {
      save: async (product: Product) => {
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
      delete: async (id: ProductId) => {
        const index = products.findIndex(p => p.id.equals(id));
        if (index === -1) {
          throw new Error('Product not found');
        }
        products.splice(index, 1);
      },
    };

    deleteProduct = new DeleteProduct(productRepository);
  });

  it('should delete an existing product successfully', async () => {
    // Arrange
    const productId = ProductId.fromString('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d');
    const product = new Product(productId, 'Leche', UnitType.liters());
    await productRepository.save(product);

    // Act
    await deleteProduct.execute(productId.value);

    // Assert
    const allProducts = await productRepository.findAll();
    expect(allProducts).toHaveLength(0);
  });

  it('should throw error when product does not exist', async () => {
    // Arrange
    const nonExistentId = 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d';

    // Act & Assert
    await expect(
      deleteProduct.execute(nonExistentId)
    ).rejects.toThrow('Product not found');
  });

  it('should throw error when product ID is invalid', async () => {
    // Arrange
    const invalidId = 'invalid-id';

    // Act & Assert
    await expect(
      deleteProduct.execute(invalidId)
    ).rejects.toThrow('Invalid UUID format');
  });

  it('should remove only the specified product', async () => {
    // Arrange
    const productId1 = ProductId.fromString('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d');
    const productId2 = ProductId.fromString('b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e');
    const productId3 = ProductId.fromString('c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f');

    await productRepository.save(new Product(productId1, 'Leche', UnitType.liters()));
    await productRepository.save(new Product(productId2, 'Pan', UnitType.units()));
    await productRepository.save(new Product(productId3, 'Arroz', UnitType.kg()));

    // Act - Delete only the middle product
    await deleteProduct.execute(productId2.value);

    // Assert
    const allProducts = await productRepository.findAll();
    expect(allProducts).toHaveLength(2);
    expect(allProducts.find(p => p.id.equals(productId1))).toBeDefined();
    expect(allProducts.find(p => p.id.equals(productId2))).toBeUndefined();
    expect(allProducts.find(p => p.id.equals(productId3))).toBeDefined();
  });

  it('should verify product exists before attempting to delete', async () => {
    // Arrange
    const productId = ProductId.fromString('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d');
    const product = new Product(productId, 'Leche', UnitType.liters());
    await productRepository.save(product);

    // Act
    await deleteProduct.execute(productId.value);

    // Assert - Verify it was deleted
    const deletedProduct = await productRepository.findById(productId);
    expect(deletedProduct).toBeNull();
  });
});
