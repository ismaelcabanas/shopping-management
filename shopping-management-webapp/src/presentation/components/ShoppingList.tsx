import { useState } from 'react'
import { ProductCard } from './ProductCard'

export interface Product {
  id: string
  name: string
  price: number
  stock: number
  minimumStock: number
}

export interface ShoppingListProps {
  products: Product[]
}

export function ShoppingList({ products }: ShoppingListProps) {
  const [shoppingCart, setShoppingCart] = useState<string[]>([])

  const handleAddToCart = (productId: string) => {
    setShoppingCart(prev => [...prev, productId])
  }

  const handleRemoveFromCart = (productId: string) => {
    setShoppingCart(prev => prev.filter(id => id !== productId))
  }

  const cartCount = shoppingCart.length

  return (
    <div>
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-bold" data-testid="cart-header">
          Lista de Compras
        </h2>
        <p data-testid="cart-count">
          Productos en la lista: {cartCount}
        </p>
        {cartCount > 0 && (
          <div className="mt-2">
            <h3 className="font-semibold">Productos agregados:</h3>
            <ul data-testid="cart-items">
              {shoppingCart.map((productId, index) => {
                const product = products.find(p => p.id === productId)
                return (
                  <li key={`${productId}-${index}`} className="flex justify-between items-center py-1">
                    <span>{product?.name}</span>
                    <button
                      onClick={() => handleRemoveFromCart(productId)}
                      className="text-red-600 text-sm"
                      data-testid={`remove-${productId}`}
                    >
                      Eliminar
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-testid="products-grid">
        {products.map(product => (
          <ProductCard
            key={product.id}
            name={product.name}
            price={product.price}
            stock={product.stock}
            minimumStock={product.minimumStock}
            onAddToCart={() => handleAddToCart(product.id)}
          />
        ))}
      </div>
    </div>
  )
}
