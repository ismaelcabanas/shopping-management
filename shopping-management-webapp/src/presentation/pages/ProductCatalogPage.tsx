import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductList, type ProductWithInventory } from '../components/ProductList';
import { GetProductsWithInventory } from '../../application/use-cases/GetProductsWithInventory';
import { LocalStorageProductRepository } from '../../infrastructure/repositories/LocalStorageProductRepository';
import { LocalStorageInventoryRepository } from '../../infrastructure/repositories/LocalStorageInventoryRepository';

export function ProductCatalogPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductWithInventory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);

      // Initialize repositories and use case
      const productRepository = new LocalStorageProductRepository();
      const inventoryRepository = new LocalStorageInventoryRepository();
      const getProductsWithInventory = new GetProductsWithInventory(
        productRepository,
        inventoryRepository
      );

      // Execute use case - single point of entry
      const productsWithInventory = await getProductsWithInventory.execute();

      setProducts(productsWithInventory);
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = () => {
    navigate('/catalog/add');
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            <button
              data-testid="back-button"
              onClick={handleBack}
              className="text-gray-600 hover:text-gray-900 font-medium"
              style={{ minHeight: '44px' }}
            >
              ← Volver
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Mi Despensa</h1>
            <div style={{ width: '80px' }}></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Product count */}
        {!isLoading && products.length > 0 && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-700">
              📋 Productos en Despensa ({products.length})
            </h2>
          </div>
        )}

        {/* Product List */}
        <ProductList products={products} isLoading={isLoading} />
      </div>

      {/* FAB (Floating Action Button) */}
      <button
        data-testid="fab-add-product"
        onClick={handleAddProduct}
        className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
        style={{
          minWidth: '56px',
          minHeight: '56px',
          width: '56px',
          height: '56px',
        }}
        aria-label="Añadir producto"
      >
        <span className="text-2xl font-bold">+</span>
      </button>
    </div>
  );
}