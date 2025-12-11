import { Pencil, Trash2, TrendingDown } from 'lucide-react';
import { ProductId } from '../../domain/model/ProductId';
import { UnitType } from '../../domain/model/UnitType';
import { Product } from '../../domain/model/Product';
import { StockLevel } from '../../domain/model/StockLevel';
import { StockLevelIndicator } from './StockLevelIndicator';
import type { Product as ProductType } from '../../domain/model/Product';

export interface ProductListItemProps {
  id: string;
  name: string;
  quantity: number;
  unitType: string;
  stockLevel?: StockLevel;
  onEdit?: (product: ProductType) => void;
  onDelete?: (productId: string) => void;
  onUpdateStockLevel?: (productId: string) => void;
}

export function ProductListItem({
  id,
  name,
  quantity,
  unitType,
  stockLevel,
  onEdit,
  onDelete,
  onUpdateStockLevel
}: ProductListItemProps) {
  const formatQuantity = () => {
    const unitLabels: Record<string, string> = {
      units: 'ud',
      kg: 'kg',
      liters: 'l',
    };
    const label = unitLabels[unitType] || unitType;
    return `${quantity} ${label}`;
  };

  const handleEdit = () => {
    if (onEdit) {
      // Create Product domain object to pass to onEdit
      const productId = ProductId.fromString(id);
      const unit = UnitType.create(unitType);
      const product = new Product(productId, name, unit);
      onEdit(product);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(id);
    }
  };

  const handleUpdateStockLevel = () => {
    if (onUpdateStockLevel) {
      onUpdateStockLevel(id);
    }
  };

  return (
    <div
      data-testid="product-list-item"
      className="bg-white border border-gray-200 rounded-lg py-4 px-4 shadow-sm hover:shadow-md transition-shadow"
      style={{ minHeight: '60px' }}
    >
      <div className="flex flex-col gap-2">
        {/* Top row: Name and actions */}
        <div className="flex items-center justify-between">
          <h3
            data-testid="product-list-item-name"
            className="text-base font-semibold text-gray-900"
          >
            {name}
          </h3>
          <div className="flex items-center gap-3">
            <span
              data-testid="product-list-item-quantity"
              className="text-sm font-medium text-gray-600"
            >
              {formatQuantity()}
            </span>
            {onUpdateStockLevel && (
              <button
                data-testid="update-stock-level-button"
                onClick={handleUpdateStockLevel}
                className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
                aria-label={`Actualizar stock de ${name}`}
                title="Actualizar stock"
              >
                <TrendingDown className="w-4 h-4" />
              </button>
            )}
            {onEdit && (
              <button
                data-testid="edit-product-button"
                onClick={handleEdit}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={`Editar ${name}`}
              >
                <Pencil className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                data-testid="delete-product-button"
                onClick={handleDelete}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label={`Eliminar ${name}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Bottom row: Stock level indicator */}
        {stockLevel && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Stock:</span>
            <StockLevelIndicator level={stockLevel} size="small" showLabel={true} />
          </div>
        )}
      </div>
    </div>
  );
}