export interface ProductListItemProps {
  name: string;
  quantity: number;
  unitType: 'units';
}

export function ProductListItem({ name, quantity }: ProductListItemProps) {
  const formatQuantity = () => {
    return `${quantity} ud`;
  };

  return (
    <div
      data-testid="product-list-item"
      className="bg-white border border-gray-200 rounded-lg py-4 px-4 shadow-sm hover:shadow-md transition-shadow"
      style={{ minHeight: '60px' }}
    >
      <div className="flex items-center justify-between">
        <h3
          data-testid="product-list-item-name"
          className="text-base font-semibold text-gray-900"
        >
          {name}
        </h3>
        <span
          data-testid="product-list-item-quantity"
          className="text-sm font-medium text-gray-600"
        >
          {formatQuantity()}
        </span>
      </div>
    </div>
  );
}