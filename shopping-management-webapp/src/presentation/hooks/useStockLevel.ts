import { useState, useCallback, useRef } from 'react';
import { ProductId } from '../../domain/model/ProductId';
import { StockLevel } from '../../domain/model/StockLevel';
import { UpdateStockLevel } from '../../application/use-cases/UpdateStockLevel';
import { GetProductsNeedingRestock } from '../../application/use-cases/GetProductsNeedingRestock';
import { LocalStorageInventoryRepository } from '../../infrastructure/repositories/LocalStorageInventoryRepository';
import { LocalStorageShoppingListRepository } from '../../infrastructure/repositories/LocalStorageShoppingListRepository';
import type { InventoryItem } from '../../domain/model/InventoryItem';

export interface UseStockLevelReturn {
  isLoading: boolean;
  error: Error | null;
  updateStockLevel: (productId: ProductId, newLevel: StockLevel) => Promise<void>;
  getProductsNeedingRestock: () => Promise<InventoryItem[]>;
}

/**
 * Custom hook to manage stock level operations
 *
 * This hook encapsulates the logic for updating stock levels and getting products
 * that need restocking, following Clean Architecture principles by using the
 * application layer's use cases.
 *
 * @returns {UseStockLevelReturn} An object containing loading state, error, and action functions
 *
 * @example
 * ```tsx
 * function ProductCatalog() {
 *   const { isLoading, error, updateStockLevel, getProductsNeedingRestock } = useStockLevel();
 *
 *   const handleUpdateLevel = async (productId: ProductId, level: StockLevel) => {
 *     try {
 *       await updateStockLevel(productId, level);
 *       toast.success('Stock level updated');
 *     } catch (err) {
 *       toast.error('Failed to update stock level');
 *     }
 *   };
 *
 *   return <div>...</div>;
 * }
 * ```
 */
export function useStockLevel(): UseStockLevelReturn {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef<boolean>(true);

  /**
   * Updates the stock level for a specific product
   * @param productId - The ID of the product to update
   * @param newLevel - The new stock level
   * @throws {Error} If the product doesn't exist or if updating fails
   */
  const updateStockLevel = useCallback(
    async (productId: ProductId, newLevel: StockLevel): Promise<void> => {
      try {
        if (isMountedRef.current) {
          setIsLoading(true);
          setError(null);
        }

        // Initialize repositories and use case
        const inventoryRepository = new LocalStorageInventoryRepository();
        const shoppingListRepository = new LocalStorageShoppingListRepository();
        const updateStockLevelUseCase = new UpdateStockLevel(
          inventoryRepository,
          shoppingListRepository
        );

        // Execute use case
        await updateStockLevelUseCase.execute({
          productId: productId.value,
          newStockLevel: newLevel.value,
        });
      } catch (err) {
        // Only update state if component is still mounted
        if (isMountedRef.current) {
          const error = err instanceof Error ? err : new Error('Unknown error');
          setError(error);
        }
        // Re-throw the error so the caller can handle it
        throw err;
      } finally {
        // Only update state if component is still mounted
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    },
    []
  );

  /**
   * Gets all products that need restocking (low or empty stock levels)
   * @returns {Promise<InventoryItem[]>} Array of inventory items needing restock
   * @throws {Error} If fetching fails
   */
  const getProductsNeedingRestock = useCallback(async (): Promise<InventoryItem[]> => {
    try {
      if (isMountedRef.current) {
        setIsLoading(true);
        setError(null);
      }

      // Initialize repositories and use case
      const inventoryRepository = new LocalStorageInventoryRepository();
      const getProductsNeedingRestockUseCase = new GetProductsNeedingRestock(inventoryRepository);

      // Execute use case
      const products = await getProductsNeedingRestockUseCase.execute();

      return products;
    } catch (err) {
      // Only update state if component is still mounted
      if (isMountedRef.current) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
      }
      // Re-throw the error so the caller can handle it
      throw err;
    } finally {
      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  return {
    isLoading,
    error,
    updateStockLevel,
    getProductsNeedingRestock,
  };
}