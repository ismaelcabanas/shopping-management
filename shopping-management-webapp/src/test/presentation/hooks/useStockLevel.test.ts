import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useStockLevel } from '../../../presentation/hooks/useStockLevel';
import { ProductId } from '../../../domain/model/ProductId';
import { StockLevel } from '../../../domain/model/StockLevel';
import { InventoryItem } from '../../../domain/model/InventoryItem';
import { Quantity } from '../../../domain/model/Quantity';
import { UnitType } from '../../../domain/model/UnitType';

// Mock repository methods
const mockInventoryRepositoryFindByProductId = vi.fn();
const mockInventoryRepositorySave = vi.fn();
const mockInventoryRepositoryFindAll = vi.fn();
const mockProductRepositoryFindById = vi.fn();

vi.mock('../../../infrastructure/repositories/LocalStorageInventoryRepository', () => ({
  LocalStorageInventoryRepository: vi.fn().mockImplementation(() => ({
    findByProductId: mockInventoryRepositoryFindByProductId,
    save: mockInventoryRepositorySave,
    findAll: mockInventoryRepositoryFindAll,
  })),
}));

vi.mock('../../../infrastructure/repositories/LocalStorageProductRepository', () => ({
  LocalStorageProductRepository: vi.fn().mockImplementation(() => ({
    findById: mockProductRepositoryFindById,
  })),
}));

describe('useStockLevel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should initialize with default state', () => {
      // Act
      const { result } = renderHook(() => useStockLevel());

      // Assert
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('updateStockLevel', () => {
    it('should handle update errors', async () => {
      // Arrange
      const productId = ProductId.fromString('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d');
      const newLevel = StockLevel.create('low');

      mockProductRepositoryFindById.mockResolvedValue(null); // Product not found
      mockInventoryRepositoryFindByProductId.mockResolvedValue(null);

      const { result } = renderHook(() => useStockLevel());

      // Act & Assert
      await act(async () => {
        await expect(result.current.updateStockLevel(productId, newLevel)).rejects.toThrow();
      });

      expect(result.current.error).not.toBeNull();
    });
  });

  describe('getProductsNeedingRestock', () => {
    it('should get products needing restock successfully', async () => {
      // Arrange
      const productId1 = ProductId.fromString('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d');
      const productId2 = ProductId.fromString('b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e');

      const lowStockItem = new InventoryItem(
        productId1,
        Quantity.create(2),
        UnitType.units(),
        StockLevel.create('low')
      );

      const highStockItem = new InventoryItem(
        productId2,
        Quantity.create(10),
        UnitType.units(),
        StockLevel.create('high')
      );

      mockInventoryRepositoryFindAll.mockResolvedValue([lowStockItem, highStockItem]);

      const { result } = renderHook(() => useStockLevel());

      // Act
      let products: InventoryItem[] = [];
      await act(async () => {
        products = await result.current.getProductsNeedingRestock();
      });

      // Assert
      expect(products).toHaveLength(1);
      expect(products[0].stockLevel.value).toBe('low');
      expect(result.current.error).toBeNull();
    });

    it('should handle fetch errors', async () => {
      // Arrange
      mockInventoryRepositoryFindAll.mockRejectedValue(new Error('Database error'));

      const { result } = renderHook(() => useStockLevel());

      // Act & Assert
      await act(async () => {
        await expect(result.current.getProductsNeedingRestock()).rejects.toThrow();
      });

      expect(result.current.error).not.toBeNull();
    });
  });
});