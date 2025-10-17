import { formatPrice } from '../../../domain/utils/priceCalculator'

export interface ProductCardProps {
  name: string
  price: number
  stock: number
  minimumStock: number
  onAddToCart?: () => void
}

export function ProductCard({
  name,
  price,
  stock,
  minimumStock,
  onAddToCart
}: ProductCardProps) {
  const lowStock = stock <= minimumStock

  return (
    <div className="border rounded-lg p-4 shadow-sm" data-testid="product-card">
      <h3 className="text-lg font-semibold" data-testid="product-name">
        {name}
      </h3>

      <p className="text-gray-600 mt-2" data-testid="product-price">
        {formatPrice(price)}
      </p>

      <div className="mt-2 flex items-center gap-2">
        <span data-testid="product-stock">Stock: {stock}</span>
        {lowStock && (
          <span
            className="text-red-600 text-sm font-semibold"
            data-testid="low-stock-warning"
          >
            ⚠️ Stock bajo
          </span>
        )}
      </div>

      <button
        onClick={onAddToCart}
        disabled={stock === 0}
        className={`mt-4 w-full py-2 px-4 rounded ${
          stock === 0
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
        data-testid="add-to-cart-button"
      >
        {stock === 0 ? 'Sin stock' : 'Agregar a la lista'}
      </button>
    </div>
  )
}
