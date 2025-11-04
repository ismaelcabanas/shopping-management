import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useInventory } from '../../../presentation/hooks/useInventory';
import type { ProductWithInventory } from '../../../application/use-cases/GetProductsWithInventory';
import type { AddProductToInventoryCommand } from '../../../application/use-cases/AddProductToInventory';
import { Product } from '../../../domain/model/Product';
import { ProductId } from '../../../domain/model/ProductId';
import { UnitType } from '../../../domain/model/UnitType';

// Mock de los repositorios a nivel de módulo
const mockProductRepositoryFindAll = vi.fn();
const mockProductRepositoryFindByName = vi.fn();
const mockProductRepositorySave = vi.fn();
const mockInventoryRepositoryFindByProductId = vi.fn();
const mockInventoryRepositorySave = vi.fn();

vi.mock('../../../infrastructure/repositories/LocalStorageProductRepository', () => ({
  LocalStorageProductRepository: vi.fn().mockImplementation(() => ({
    findAll: mockProductRepositoryFindAll,
    findByName: mockProductRepositoryFindByName,
    save: mockProductRepositorySave,
    findById: vi.fn(),
  })),
}));

vi.mock('../../../infrastructure/repositories/LocalStorageInventoryRepository', () => ({
  LocalStorageInventoryRepository: vi.fn().mockImplementation(() => ({
    findByProductId: mockInventoryRepositoryFindByProductId,
    save: mockInventoryRepositorySave,
    findAll: vi.fn(),
  })),
}));

describe('useInventory', () => {
  beforeEach(() => {
    // Limpiar los mocks antes de cada test
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should start with loading true and empty products', () => {
      // Mock que simula un delay
      mockProductRepositoryFindAll.mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      const { result } = renderHook(() => useInventory());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.productsWithInventory).toEqual([]);
      expect(result.current.error).toBeNull();
    });
  });

  describe('successful data fetching', () => {
    it('should load products with inventory successfully', async () => {
      const mockProducts = [
        new Product(
          new ProductId('1'),
          'Arroz',
          UnitType.units()
        ),
        new Product(
          new ProductId('2'),
          'Aceite',
          UnitType.units()
        ),
      ];

      const mockInventoryItems = [
        { currentStock: { value: 10 } },
        { currentStock: { value: 5 } },
      ];

      mockProductRepositoryFindAll.mockResolvedValue(mockProducts);
      mockInventoryRepositoryFindByProductId
        .mockResolvedValueOnce(mockInventoryItems[0])
        .mockResolvedValueOnce(mockInventoryItems[1]);

      const { result } = renderHook(() => useInventory());

      // Initially loading
      expect(result.current.isLoading).toBe(true);
      expect(result.current.productsWithInventory).toEqual([]);

      // Wait for the hook to finish loading
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Check that products with inventory are loaded and sorted alphabetically
      expect(result.current.productsWithInventory).toHaveLength(2);
      expect(result.current.productsWithInventory[0].name).toBe('Aceite');
      expect(result.current.productsWithInventory[0].quantity).toBe(5);
      expect(result.current.productsWithInventory[1].name).toBe('Arroz');
      expect(result.current.productsWithInventory[1].quantity).toBe(10);
      expect(result.current.error).toBeNull();
    });

    it('should load empty list when no products exist', async () => {
      mockProductRepositoryFindAll.mockResolvedValue([]);

      const { result } = renderHook(() => useInventory());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.productsWithInventory).toEqual([]);
      expect(result.current.error).toBeNull();
    });

    it('should handle products without inventory items (quantity 0)', async () => {
      const mockProducts = [
        new Product(
          new ProductId('1'),
          'Arroz',
          UnitType.units()
        ),
      ];

      mockProductRepositoryFindAll.mockResolvedValue(mockProducts);
      mockInventoryRepositoryFindByProductId.mockResolvedValue(null);

      const { result } = renderHook(() => useInventory());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.productsWithInventory).toHaveLength(1);
      expect(result.current.productsWithInventory[0].quantity).toBe(0);
      expect(result.current.error).toBeNull();
    });
  });

  describe('error handling', () => {
    it('should handle errors when loading products fails', async () => {
      const mockError = new Error('Failed to load products');
      mockProductRepositoryFindAll.mockRejectedValue(mockError);

      const { result } = renderHook(() => useInventory());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.productsWithInventory).toEqual([]);
      expect(result.current.error).toEqual(mockError);
    });

    it('should handle errors when loading inventory fails', async () => {
      const mockProducts = [
        new Product(
          new ProductId('1'),
          'Arroz',
          UnitType.units()
        ),
      ];

      const inventoryError = new Error('Failed to load inventory');
      mockProductRepositoryFindAll.mockResolvedValue(mockProducts);
      mockInventoryRepositoryFindByProductId.mockRejectedValue(inventoryError);

      const { result } = renderHook(() => useInventory());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.productsWithInventory).toEqual([]);
      expect(result.current.error).toEqual(inventoryError);
    });
  });

  describe('addProduct functionality', () => {
    it('should add a new product to inventory', async () => {
      const initialProducts = [
        new Product(
          new ProductId('1'),
          'Arroz',
          UnitType.units()
        ),
      ];

      mockProductRepositoryFindAll.mockResolvedValue(initialProducts);
      mockInventoryRepositoryFindByProductId.mockResolvedValue({
        currentStock: { value: 10 },
      });
      mockProductRepositoryFindByName.mockResolvedValue(null); // No existing product

      const { result } = renderHook(() => useInventory());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.productsWithInventory).toHaveLength(1);

      // Prepare for adding new product
      const newProduct = new Product(
        new ProductId('2'),
        'Aceite',
        UnitType.units()
      );

      const updatedProducts = [...initialProducts, newProduct];
      mockProductRepositoryFindAll.mockResolvedValue(updatedProducts);
      mockInventoryRepositoryFindByProductId
        .mockResolvedValueOnce({ currentStock: { value: 10 } }) // Existing product
        .mockResolvedValueOnce({ currentStock: { value: 5 } }); // New product

      // Add product
      const command: AddProductToInventoryCommand = {
        id: '00000000-0000-0000-0000-000000000002',
        name: 'Aceite',
        initialQuantity: 5,
      };

      await result.current.addProduct(command);

      // Wait for the list to update
      await waitFor(() => {
        expect(result.current.productsWithInventory).toHaveLength(2);
      });

      expect(mockProductRepositorySave).toHaveBeenCalled();
      expect(mockInventoryRepositorySave).toHaveBeenCalled();
    });

    it('should handle error when adding product with duplicate name', async () => {
      mockProductRepositoryFindAll.mockResolvedValue([]);
      mockInventoryRepositoryFindByProductId.mockResolvedValue(null);

      const existingProduct = new Product(
        new ProductId('1'),
        'Arroz',
        UnitType.units()
      );
      mockProductRepositoryFindByName.mockResolvedValue(existingProduct);

      const { result } = renderHook(() => useInventory());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const command: AddProductToInventoryCommand = {
        id: '2',
        name: 'Arroz', // Duplicate name
        initialQuantity: 5,
      };

      // Should throw error
      await expect(result.current.addProduct(command)).rejects.toThrow(
        'Product with name "Arroz" already exists'
      );

      // Error state should be set
      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });

      expect(mockProductRepositorySave).not.toHaveBeenCalled();
      expect(mockInventoryRepositorySave).not.toHaveBeenCalled();
    });

    it('should handle error when saving product fails', async () => {
      mockProductRepositoryFindAll.mockResolvedValue([]);
      mockInventoryRepositoryFindByProductId.mockResolvedValue(null);
      mockProductRepositoryFindByName.mockResolvedValue(null);

      const saveError = new Error('Failed to save product');
      mockProductRepositorySave.mockRejectedValue(saveError);

      const { result } = renderHook(() => useInventory());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const command: AddProductToInventoryCommand = {
        id: '00000000-0000-0000-0000-000000000002',
        name: 'Aceite',
        initialQuantity: 5,
      };

      // Should throw error
      await expect(result.current.addProduct(command)).rejects.toThrow(
        'Failed to save product'
      );

      // Error state should be set
      await waitFor(() => {
        expect(result.current.error).toEqual(saveError);
      });
    });
  });

  describe('refetch functionality', () => {
    it('should refetch products when refetch is called', async () => {
      const initialProducts = [
        new Product(
          new ProductId('1'),
          'Arroz',
          UnitType.units()
        ),
      ];

      const updatedProducts = [
        ...initialProducts,
        new Product(
          new ProductId('2'),
          'Aceite',
          UnitType.units()
        ),
      ];

      mockProductRepositoryFindAll
        .mockResolvedValueOnce(initialProducts)
        .mockResolvedValueOnce(updatedProducts);
      mockInventoryRepositoryFindByProductId
        .mockResolvedValue({ currentStock: { value: 10 } });

      const { result } = renderHook(() => useInventory());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.productsWithInventory).toHaveLength(1);

      // Refetch
      await result.current.refetch();

      await waitFor(() => {
        expect(result.current.productsWithInventory).toHaveLength(2);
      });

      expect(mockProductRepositoryFindAll).toHaveBeenCalledTimes(2);
    });

    it('should handle errors during refetch', async () => {
      const initialProducts = [
        new Product(
          new ProductId('1'),
          'Arroz',
          UnitType.units()
        ),
      ];

      const refetchError = new Error('Refetch failed');

      mockProductRepositoryFindAll
        .mockResolvedValueOnce(initialProducts)
        .mockRejectedValueOnce(refetchError);
      mockInventoryRepositoryFindByProductId.mockResolvedValue({
        currentStock: { value: 10 },
      });

      const { result } = renderHook(() => useInventory());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.productsWithInventory).toHaveLength(1);
      expect(result.current.error).toBeNull();

      // Refetch with error
      await result.current.refetch();

      await waitFor(() => {
        expect(result.current.error).toEqual(refetchError);
      });

      // Products should be cleared on error
      expect(result.current.productsWithInventory).toEqual([]);
    });
  });

  describe('cleanup', () => {
    it('should not update state after unmounting', async () => {
      let resolvePromise: (value: Product[]) => void;
      const promise = new Promise<Product[]>((resolve) => {
        resolvePromise = resolve;
      });

      mockProductRepositoryFindAll.mockReturnValue(promise);

      const { result, unmount } = renderHook(() => useInventory());

      expect(result.current.isLoading).toBe(true);

      // Unmount before promise resolves
      unmount();

      // Resolve promise after unmount
      const mockProducts = [
        new Product(
          new ProductId('1'),
          'Arroz',
          UnitType.units()
        ),
      ];
      resolvePromise!(mockProducts);

      // Wait a bit to ensure no state updates happen
      await new Promise((resolve) => setTimeout(resolve, 10));

      // No errors should have been thrown due to setState on unmounted component
    });
  });
});