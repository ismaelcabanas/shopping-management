import { ProductListItem } from './ProductListItem';
import type { Product } from '../../domain/model/Product';

export interface ProductWithInventory {
  id: string;
  name: string;
  quantity: number;
  unitType: string;
}

export interface ProductListProps {
  products: ProductWithInventory[];
  isLoading?: boolean;
  onEditProduct?: (product: Product) => void;
}

function SkeletonLoader() {
  return (
    <div
      data-testid="skeleton-loader"
      className="bg-white border border-gray-200 rounded-lg py-4 px-4 shadow-sm animate-pulse"
      style={{ minHeight: '60px' }}
    >
      <div className="flex items-center justify-between">
        <div className="h-4 bg-gray-300 rounded w-32"></div>
        <div className="h-4 bg-gray-300 rounded w-16"></div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div data-testid="empty-state" className="text-center py-12 px-4">
      <div data-testid="empty-state-icon" className="text-6xl mb-4">
        📦
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        No hay productos en tu despensa
      </h3>
      <p className="text-gray-500">
        Añade tu primer producto pulsando el botón +
      </p>
    </div>
  );
}

export function ProductList({ products, isLoading = false, onEditProduct }: ProductListProps) {
  if (isLoading) {
    return (
      <div data-testid="product-list-container" className="space-y-3">
        <SkeletonLoader />
        <SkeletonLoader />
        <SkeletonLoader />
      </div>
    );
  }

  if (products.length === 0) {
    return <EmptyState />;
  }

  return (
    <div data-testid="product-list-container" className="space-y-3">
      {products.map((product) => (
        <ProductListItem
          key={product.id}
          id={product.id}
          name={product.name}
          quantity={product.quantity}
          unitType={product.unitType}
          onEdit={onEditProduct}
        />
      ))}
    </div>
  );
}