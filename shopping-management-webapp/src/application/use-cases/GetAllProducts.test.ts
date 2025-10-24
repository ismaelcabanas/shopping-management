import { describe, it, expect, beforeEach } from 'vitest';
import { GetAllProducts } from './GetAllProducts';
import type { ProductRepository } from '../../domain/repositories/ProductRepository';
import { Product } from '../../domain/model/Product';
import { ProductId } from '../../domain/model/ProductId';
import { UnitType } from '../../domain/model/UnitType';

describe('GetAllProducts Use Case', () => {
  let getAllProducts: GetAllProducts;
  let productRepository: ProductRepository;

  beforeEach(() => {
    // Create in-memory mock repository
    const products: Product[] = [];

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

    getAllProducts = new GetAllProducts(productRepository);
  });

  it('should return an empty array when no products exist', async () => {
    // Act
    const products = await getAllProducts.execute();

    // Assert
    expect(products).toEqual([]);
    expect(products.length).toBe(0);
  });

  it('should return all products from repository', async () => {
    // Arrange - Add some products to repository
    const productId1 = ProductId.fromString('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d');
    const productId2 = ProductId.fromString('b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e');
    const productId3 = ProductId.fromString('c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f');

    const unitType = UnitType.units();

    await productRepository.save(new Product(productId1, 'Leche', unitType));
    await productRepository.save(new Product(productId2, 'Pan', unitType));
    await productRepository.save(new Product(productId3, 'Huevos', unitType));

    // Act
    const products = await getAllProducts.execute();

    // Assert
    expect(products.length).toBe(3);
    expect(products[0].name).toBe('Leche');
    expect(products[1].name).toBe('Pan');
    expect(products[2].name).toBe('Huevos');
  });

  it('should return products with correct properties', async () => {
    // Arrange
    const productId = ProductId.fromString('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d');
    const unitType = UnitType.units();
    const product = new Product(productId, 'Leche', unitType);

    await productRepository.save(product);

    // Act
    const products = await getAllProducts.execute();

    // Assert
    expect(products.length).toBe(1);
    expect(products[0].id.value).toBe('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d');
    expect(products[0].name).toBe('Leche');
    expect(products[0].unitType.value).toBe('units');
  });
});