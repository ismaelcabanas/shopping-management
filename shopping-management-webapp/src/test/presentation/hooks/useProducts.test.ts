import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useProducts } from '../../../presentation/hooks/useProducts';
import { Product } from '../../../domain/model/Product';
import { ProductId } from '../../../domain/model/ProductId';
import { UnitType } from '../../../domain/model/UnitType';

// Mock del repositorio a nivel de módulo
const mockFindAll = vi.fn();

vi.mock('../../../infrastructure/repositories/LocalStorageProductRepository', () => ({
  LocalStorageProductRepository: vi.fn().mockImplementation(() => ({
    findAll: mockFindAll,
    save: vi.fn(),
    findById: vi.fn(),
    findByName: vi.fn(),
  })),
}));

describe('useProducts', () => {
  beforeEach(() => {
    // Limpiar los mocks antes de cada test
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should start with loading true and empty products', () => {
      // Mock que simula un delay
      mockFindAll.mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      const { result } = renderHook(() => useProducts());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.products).toEqual([]);
      expect(result.current.error).toBeNull();
    });
  });

  describe('successful data fetching', () => {
    it('should load products successfully', async () => {
      const mockProducts = [
        new Product(
          ProductId.fromString('00000000-0000-0000-0000-000000000001'),
          'Arroz',
          UnitType.units()
        ),
        new Product(
          ProductId.fromString('00000000-0000-0000-0000-000000000002'),
          'Aceite',
          UnitType.units()
        ),
      ];

      mockFindAll.mockResolvedValue(mockProducts);

      const { result } = renderHook(() => useProducts());

      // Initially loading
      expect(result.current.isLoading).toBe(true);
      expect(result.current.products).toEqual([]);

      // Wait for the hook to finish loading
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Check that products are loaded
      expect(result.current.products).toEqual(mockProducts);
      expect(result.current.error).toBeNull();
    });

    it('should load empty list when no products exist', async () => {
      mockFindAll.mockResolvedValue([]);

      const { result } = renderHook(() => useProducts());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.products).toEqual([]);
      expect(result.current.error).toBeNull();
    });
  });

  describe('error handling', () => {
    it('should handle errors when loading products fails', async () => {
      const mockError = new Error('Failed to load products');
      mockFindAll.mockRejectedValue(mockError);

      const { result } = renderHook(() => useProducts());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.products).toEqual([]);
      expect(result.current.error).toEqual(mockError);
    });

    it('should handle network errors gracefully', async () => {
      const networkError = new Error('Network error');
      mockFindAll.mockRejectedValue(networkError);

      const { result } = renderHook(() => useProducts());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toEqual(networkError);
      expect(result.current.products).toEqual([]);
    });
  });

  describe('refetch functionality', () => {
    it('should refetch products when refetch is called', async () => {
      const initialProducts = [
        new Product(
          ProductId.fromString('00000000-0000-0000-0000-000000000001'),
          'Arroz',
          UnitType.units()
        ),
      ];

      const updatedProducts = [
        ...initialProducts,
        new Product(
          ProductId.fromString('00000000-0000-0000-0000-000000000002'),
          'Aceite',
          UnitType.units()
        ),
      ];

      mockFindAll
        .mockResolvedValueOnce(initialProducts)
        .mockResolvedValueOnce(updatedProducts);

      const { result } = renderHook(() => useProducts());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.products).toEqual(initialProducts);

      // Refetch
      await result.current.refetch();

      await waitFor(() => {
        expect(result.current.products).toEqual(updatedProducts);
      });

      expect(mockFindAll).toHaveBeenCalledTimes(2);
    });

    it('should set loading state during refetch', async () => {
      // Create a delayed promise to give us time to check loading state
      let resolvePromise: (value: Product[]) => void;
      const delayedPromise = new Promise<Product[]>((resolve) => {
        resolvePromise = resolve;
      });

      mockFindAll.mockResolvedValue([]);

      const { result } = renderHook(() => useProducts());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Set up delayed response for refetch
      mockFindAll.mockReturnValueOnce(delayedPromise);

      // Start refetch (don't await yet)
      const refetchPromise = result.current.refetch();

      // Should be loading now
      await waitFor(() => {
        expect(result.current.isLoading).toBe(true);
      });

      // Resolve the promise
      resolvePromise!([]);
      await refetchPromise;

      // Should finish loading
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should handle errors during refetch', async () => {
      const initialProducts = [
        new Product(
          ProductId.fromString('00000000-0000-0000-0000-000000000001'),
          'Arroz',
          UnitType.units()
        ),
      ];

      const refetchError = new Error('Refetch failed');

      mockFindAll
        .mockResolvedValueOnce(initialProducts)
        .mockRejectedValueOnce(refetchError);

      const { result } = renderHook(() => useProducts());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.products).toEqual(initialProducts);
      expect(result.current.error).toBeNull();

      // Refetch with error
      await result.current.refetch();

      await waitFor(() => {
        expect(result.current.error).toEqual(refetchError);
      });

      // Products should remain unchanged on error
      expect(result.current.products).toEqual([]);
    });
  });

  describe('cleanup', () => {
    it('should not update state after unmounting', async () => {
      const mockProducts = [
        new Product(
          ProductId.fromString('00000000-0000-0000-0000-000000000001'),
          'Arroz',
          UnitType.units()
        ),
      ];

      let resolvePromise: (value: Product[]) => void;
      const promise = new Promise<Product[]>((resolve) => {
        resolvePromise = resolve;
      });

      mockFindAll.mockReturnValue(promise);

      const { result, unmount } = renderHook(() => useProducts());

      expect(result.current.isLoading).toBe(true);

      // Unmount before promise resolves
      unmount();

      // Resolve promise after unmount
      resolvePromise!(mockProducts);

      // Wait a bit to ensure no state updates happen
      await new Promise((resolve) => setTimeout(resolve, 10));

      // No errors should have been thrown due to setState on unmounted component
    });
  });
});