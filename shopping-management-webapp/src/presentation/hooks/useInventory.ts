import { useState, useEffect, useCallback, useRef } from 'react';
import type { ProductWithInventory } from '../../application/use-cases/GetProductsWithInventory';
import { GetProductsWithInventory } from '../../application/use-cases/GetProductsWithInventory';
import type { AddProductToInventoryCommand } from '../../application/use-cases/AddProductToInventory';
import { AddProductToInventory } from '../../application/use-cases/AddProductToInventory';
import type { PurchaseItemInput } from '../../application/use-cases/RegisterPurchase';
import { RegisterPurchase } from '../../application/use-cases/RegisterPurchase';
import { LocalStorageProductRepository } from '../../infrastructure/repositories/LocalStorageProductRepository';
import { LocalStorageInventoryRepository } from '../../infrastructure/repositories/LocalStorageInventoryRepository';

export interface UseInventoryReturn {
  productsWithInventory: ProductWithInventory[];
  isLoading: boolean;
  error: Error | null;
  addProduct: (command: AddProductToInventoryCommand) => Promise<void>;
  registerPurchase: (items: PurchaseItemInput[]) => Promise<void>;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to manage inventory operations
 *
 * This hook encapsulates the logic for fetching products with inventory and adding new products,
 * following Clean Architecture principles by using the application layer's use cases.
 *
 * @returns {UseInventoryReturn} An object containing products with inventory, loading state, error, and action functions
 *
 * @example
 * ```tsx
 * function InventoryPage() {
 *   const { productsWithInventory, isLoading, error, addProduct, refetch } = useInventory();
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   const handleAddProduct = async () => {
 *     await addProduct({
 *       id: crypto.randomUUID(),
 *       name: 'New Product',
 *       initialQuantity: 10
 *     });
 *   };
 *
 *   return (
 *     <div>
 *       {productsWithInventory.map(product => (
 *         <ProductCard key={product.id} product={product} />
 *       ))}
 *       <button onClick={handleAddProduct}>Add Product</button>
 *       <button onClick={refetch}>Refresh</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useInventory(): UseInventoryReturn {
  const [productsWithInventory, setProductsWithInventory] = useState<ProductWithInventory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef<boolean>(true);

  /**
   * Loads products with inventory from the repositories using the GetProductsWithInventory use case
   */
  const loadProductsWithInventory = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Initialize repositories and use case
      const productRepository = new LocalStorageProductRepository();
      const inventoryRepository = new LocalStorageInventoryRepository();
      const getProductsWithInventory = new GetProductsWithInventory(
        productRepository,
        inventoryRepository
      );

      // Execute use case
      const products = await getProductsWithInventory.execute();

      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setProductsWithInventory(products);
      }
    } catch (err) {
      // Only update state if component is still mounted
      if (isMountedRef.current) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        setProductsWithInventory([]);
      }
    } finally {
      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  /**
   * Adds a new product to the inventory
   * @param command - The command containing product details
   * @throws {Error} If the product already exists or if saving fails
   */
  const addProduct = useCallback(
    async (command: AddProductToInventoryCommand): Promise<void> => {
      try {
        setError(null);

        // Initialize repositories and use case
        const productRepository = new LocalStorageProductRepository();
        const inventoryRepository = new LocalStorageInventoryRepository();
        const addProductToInventory = new AddProductToInventory(
          productRepository,
          inventoryRepository
        );

        // Execute use case
        await addProductToInventory.execute(command);

        // Reload products after adding
        await loadProductsWithInventory();
      } catch (err) {
        // Only update state if component is still mounted
        if (isMountedRef.current) {
          const error = err instanceof Error ? err : new Error('Unknown error');
          setError(error);
        }
        // Re-throw the error so the caller can handle it
        throw err;
      }
    },
    [loadProductsWithInventory]
  );

  /**
   * Registers a purchase and updates inventory
   * @param items - Array of purchase items with product ID and quantity
   * @throws {Error} If the purchase is invalid or if a product doesn't exist
   */
  const registerPurchase = useCallback(
    async (items: PurchaseItemInput[]): Promise<void> => {
      try {
        setError(null);

        // Initialize repositories and use case
        const productRepository = new LocalStorageProductRepository();
        const inventoryRepository = new LocalStorageInventoryRepository();
        const registerPurchaseUseCase = new RegisterPurchase(
          productRepository,
          inventoryRepository
        );

        // Execute use case
        await registerPurchaseUseCase.execute({ items });

        // Reload products after registering purchase
        await loadProductsWithInventory();
      } catch (err) {
        // Only update state if component is still mounted
        if (isMountedRef.current) {
          const error = err instanceof Error ? err : new Error('Unknown error');
          setError(error);
        }
        // Re-throw the error so the caller can handle it
        throw err;
      }
    },
    [loadProductsWithInventory]
  );

  /**
   * Refetches products with inventory from the repositories
   */
  const refetch = useCallback(async () => {
    await loadProductsWithInventory();
  }, [loadProductsWithInventory]);

  // Load products on mount
  useEffect(() => {
    loadProductsWithInventory();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMountedRef.current = false;
    };
  }, [loadProductsWithInventory]);

  return {
    productsWithInventory,
    isLoading,
    error,
    addProduct,
    registerPurchase,
    refetch,
  };
}