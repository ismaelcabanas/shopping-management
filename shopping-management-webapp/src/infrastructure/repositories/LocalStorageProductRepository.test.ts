import { describe, it, expect, beforeEach } from 'vitest';
import { LocalStorageProductRepository } from './LocalStorageProductRepository';
import { Product } from '../../domain/model/Product';
import { ProductId } from '../../domain/model/ProductId';
import { UnitType } from '../../domain/model/UnitType';

describe('LocalStorageProductRepository', () => {
  let repository: LocalStorageProductRepository;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    repository = new LocalStorageProductRepository();
  });

  describe('save()', () => {
    it('should save a product to localStorage', async () => {
      // Arrange
      const productId = ProductId.fromString('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d');
      const unitType = UnitType.units();
      const product = new Product(productId, 'Leche', unitType);

      // Act
      await repository.save(product);

      // Assert
      const stored = localStorage.getItem('shopping_manager_products');
      expect(stored).not.toBeNull();

      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].id).toBe('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d');
      expect(parsed[0].name).toBe('Leche');
      expect(parsed[0].unitType).toBe('units');
    });

    it('should update an existing product with the same id', async () => {
      // Arrange
      const productId = ProductId.fromString('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d');
      const unitType = UnitType.units();

      const originalProduct = new Product(productId, 'Leche', unitType);
      await repository.save(originalProduct);

      const updatedProduct = new Product(productId, 'Leche Desnatada', unitType);

      // Act
      await repository.save(updatedProduct);

      // Assert
      const allProducts = await repository.findAll();
      expect(allProducts).toHaveLength(1);
      expect(allProducts[0].name).toBe('Leche Desnatada');
    });

    it('should save multiple different products', async () => {
      // Arrange
      const productId1 = ProductId.fromString('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d');
      const productId2 = ProductId.fromString('b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e');
      const unitType = UnitType.units();

      const product1 = new Product(productId1, 'Leche', unitType);
      const product2 = new Product(productId2, 'Pan', unitType);

      // Act
      await repository.save(product1);
      await repository.save(product2);

      // Assert
      const allProducts = await repository.findAll();
      expect(allProducts).toHaveLength(2);
    });
  });

  describe('findAll()', () => {
    it('should return an empty array when no products exist', async () => {
      // Act
      const products = await repository.findAll();

      // Assert
      expect(products).toEqual([]);
    });

    it('should return all saved products', async () => {
      // Arrange
      const productId1 = ProductId.fromString('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d');
      const productId2 = ProductId.fromString('b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e');
      const unitType = UnitType.units();

      await repository.save(new Product(productId1, 'Leche', unitType));
      await repository.save(new Product(productId2, 'Pan', unitType));

      // Act
      const products = await repository.findAll();

      // Assert
      expect(products).toHaveLength(2);
      expect(products[0]).toBeInstanceOf(Product);
      expect(products[1]).toBeInstanceOf(Product);
      expect(products[0].name).toBe('Leche');
      expect(products[1].name).toBe('Pan');
    });

    it('should return products with correct value objects', async () => {
      // Arrange
      const productId = ProductId.fromString('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d');
      const unitType = UnitType.units();
      const product = new Product(productId, 'Leche', unitType);

      await repository.save(product);

      // Act
      const products = await repository.findAll();

      // Assert
      expect(products[0].id).toBeInstanceOf(ProductId);
      expect(products[0].id.value).toBe('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d');
      expect(products[0].unitType).toBeInstanceOf(UnitType);
      expect(products[0].unitType.value).toBe('units');
    });
  });

  describe('findById()', () => {
    it('should return null when product does not exist', async () => {
      // Arrange
      const productId = ProductId.fromString('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d');

      // Act
      const product = await repository.findById(productId);

      // Assert
      expect(product).toBeNull();
    });

    it('should return the product when it exists', async () => {
      // Arrange
      const productId = ProductId.fromString('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d');
      const unitType = UnitType.units();
      const savedProduct = new Product(productId, 'Leche', unitType);

      await repository.save(savedProduct);

      // Act
      const product = await repository.findById(productId);

      // Assert
      expect(product).not.toBeNull();
      expect(product).toBeInstanceOf(Product);
      expect(product!.id.value).toBe('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d');
      expect(product!.name).toBe('Leche');
    });

    it('should return the correct product when multiple products exist', async () => {
      // Arrange
      const productId1 = ProductId.fromString('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d');
      const productId2 = ProductId.fromString('b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e');
      const unitType = UnitType.units();

      await repository.save(new Product(productId1, 'Leche', unitType));
      await repository.save(new Product(productId2, 'Pan', unitType));

      // Act
      const product = await repository.findById(productId2);

      // Assert
      expect(product).not.toBeNull();
      expect(product!.name).toBe('Pan');
    });
  });

  describe('findByName()', () => {
    it('should return null when product with name does not exist', async () => {
      // Act
      const product = await repository.findByName('Nonexistent');

      // Assert
      expect(product).toBeNull();
    });

    it('should return the product when it exists', async () => {
      // Arrange
      const productId = ProductId.fromString('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d');
      const unitType = UnitType.units();
      await repository.save(new Product(productId, 'Leche', unitType));

      // Act
      const product = await repository.findByName('Leche');

      // Assert
      expect(product).not.toBeNull();
      expect(product).toBeInstanceOf(Product);
      expect(product!.name).toBe('Leche');
    });

    it('should be case insensitive', async () => {
      // Arrange
      const productId = ProductId.fromString('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d');
      const unitType = UnitType.units();
      await repository.save(new Product(productId, 'Leche', unitType));

      // Act
      const product1 = await repository.findByName('leche');
      const product2 = await repository.findByName('LECHE');
      const product3 = await repository.findByName('LeCHe');

      // Assert
      expect(product1).not.toBeNull();
      expect(product2).not.toBeNull();
      expect(product3).not.toBeNull();
      expect(product1!.name).toBe('Leche');
      expect(product2!.name).toBe('Leche');
      expect(product3!.name).toBe('Leche');
    });
  });
});