import { useState, useEffect, useCallback, useRef } from 'react';
import { Product } from '../../domain/model/Product';
import { GetAllProducts } from '../../application/use-cases/GetAllProducts';
import { UpdateProduct } from '../../application/use-cases/UpdateProduct';
import { DeleteProduct } from '../../application/use-cases/DeleteProduct';
import type { UpdateProductCommand } from '../../application/use-cases/UpdateProduct';
import { LocalStorageProductRepository } from '../../infrastructure/repositories/LocalStorageProductRepository';

export interface UseProductsReturn {
  products: Product[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  updateProduct: (command: UpdateProductCommand) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
}

/**
 * Custom hook to manage products
 *
 * This hook encapsulates the logic for fetching and managing products,
 * following Clean Architecture principles by using the application layer's use cases.
 *
 * @returns {UseProductsReturn} An object containing products, loading state, error, and refetch function
 *
 * @example
 * ```tsx
 * function ProductsPage() {
 *   const { products, isLoading, error, refetch } = useProducts();
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return (
 *     <div>
 *       {products.map(product => (
 *         <ProductCard key={product.id.value} product={product} />
 *       ))}
 *       <button onClick={refetch}>Refresh</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useProducts(): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef<boolean>(true);

  /**
   * Loads products from the repository using the GetAllProducts use case
   */
  const loadProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Initialize repository and use case
      const productRepository = new LocalStorageProductRepository();
      const getAllProducts = new GetAllProducts(productRepository);

      // Execute use case
      const fetchedProducts = await getAllProducts.execute();

      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setProducts(fetchedProducts);
      }
    } catch (err) {
      // Only update state if component is still mounted
      if (isMountedRef.current) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        setProducts([]);
      }
    } finally {
      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  /**
   * Refetches products from the repository
   */
  const refetch = useCallback(async () => {
    await loadProducts();
  }, [loadProducts]);

  /**
   * Updates an existing product
   */
  const updateProduct = useCallback(async (command: UpdateProductCommand) => {
    try {
      setError(null);

      // Initialize repository and use case
      const productRepository = new LocalStorageProductRepository();
      const updateProductUseCase = new UpdateProduct(productRepository);

      // Execute use case
      await updateProductUseCase.execute(command);

      // Refetch products to update the list
      await loadProducts();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error; // Re-throw so the caller can handle it
    }
  }, [loadProducts]);

  /**
   * Deletes a product
   */
  const deleteProduct = useCallback(async (productId: string) => {
    try {
      setError(null);

      // Initialize repository and use case
      const productRepository = new LocalStorageProductRepository();
      const deleteProductUseCase = new DeleteProduct(productRepository);

      // Execute use case
      await deleteProductUseCase.execute(productId);

      // Refetch products to update the list
      await loadProducts();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error; // Re-throw so the caller can handle it
    }
  }, [loadProducts]);

  // Load products on mount
  useEffect(() => {
    loadProducts();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMountedRef.current = false;
    };
  }, [loadProducts]);

  return {
    products,
    isLoading,
    error,
    refetch,
    updateProduct,
    deleteProduct,
  };
}