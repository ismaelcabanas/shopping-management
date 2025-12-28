import { ProductListItem } from './ProductListItem';
import { EmptyState } from '../shared/components/EmptyState';
import { Skeleton } from '../shared/components/Skeleton';
import type { Product } from '../../domain/model/Product';
import type { StockLevel } from '../../domain/model/StockLevel';

export interface ProductWithInventory {
  id: string;
  name: string;
  quantity: number;
  unitType: string;
  stockLevel?: StockLevel;
}

export interface ProductListProps {
  products: ProductWithInventory[];
  isLoading?: boolean;
  onEditProduct?: (product: Product) => void;
  onDeleteProduct?: (productId: string) => void;
  onUpdateStockLevel?: (productId: string) => void;
  onAddToShoppingList?: (productId: string) => void;
  productsInShoppingList?: Set<string>;
}

export function ProductList({
  products,
  isLoading = false,
  onEditProduct,
  onDeleteProduct,
  onUpdateStockLevel,
  onAddToShoppingList,
  productsInShoppingList = new Set()
}: ProductListProps) {
  if (isLoading) {
    return (
      <div data-testid="product-list-container" className="space-y-3">
        <Skeleton
          variant="card"
          height="60px"
          data-testid="skeleton-loader"
        />
        <Skeleton
          variant="card"
          height="60px"
          data-testid="skeleton-loader"
        />
        <Skeleton
          variant="card"
          height="60px"
          data-testid="skeleton-loader"
        />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        title="No hay productos en tu despensa"
        description="Añade tu primer producto pulsando el botón +"
        icon={<span data-testid="empty-state-icon" className="text-6xl">📦</span>}
        data-testid="empty-state"
      />
    );
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
          stockLevel={product.stockLevel}
          onEdit={onEditProduct}
          onDelete={onDeleteProduct}
          onUpdateStockLevel={onUpdateStockLevel}
          onAddToShoppingList={onAddToShoppingList}
          isInShoppingList={productsInShoppingList.has(product.id)}
        />
      ))}
    </div>
  );
}