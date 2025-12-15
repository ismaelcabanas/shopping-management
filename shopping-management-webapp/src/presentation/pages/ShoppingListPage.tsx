import { useShoppingList } from '../hooks/useShoppingList'
import { cn } from '../../lib/utils'

export function ShoppingListPage() {
  const { items, isLoading, error, toggleChecked } = useShoppingList()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">Cargando lista de compras...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">Error al cargar la lista: {error.message}</div>
      </div>
    )
  }

  const getStockLevelBadge = (stockLevel?: string) => {
    if (!stockLevel) return null

    const badges = {
      low: { text: 'Stock bajo', color: 'bg-yellow-100 text-yellow-800' },
      empty: { text: 'Sin stock', color: 'bg-red-100 text-red-800' }
    }

    const badge = badges[stockLevel as keyof typeof badges]
    if (!badge) return null

    return (
      <span className={`text-xs px-2 py-1 rounded-full ${badge.color}`}>
        {badge.text}
      </span>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Lista de Compras</h1>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No hay productos en la lista de compras</p>
          <p className="text-gray-400 text-sm mt-2">
            Los productos con stock bajo se agregarán automáticamente
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-3 border-b">
            <p className="text-sm text-gray-600">
              {items.length} {items.length === 1 ? 'producto' : 'productos'}
            </p>
          </div>
          <ul className="divide-y">
            {items.map((item) => (
              <li
                key={item.productId.value}
                className="px-4 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleChecked(item.productId)}
                    className="w-5 h-5 min-w-[44px] min-h-[44px] cursor-pointer rounded border-gray-300 text-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    aria-label={`Marcar ${item.productName} como comprado`}
                  />

                  {/* Product info with conditional styling */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3
                        className={cn(
                          "text-lg font-medium text-gray-900",
                          item.checked && "line-through opacity-60"
                        )}
                      >
                        {item.productName}
                      </h3>
                      {/* Badge always visible (opacity-100) */}
                      <span className="opacity-100">
                        {getStockLevelBadge(item.stockLevel)}
                      </span>
                    </div>
                    {item.stockLevel && (
                      <p
                        className={cn(
                          "text-sm text-gray-500 mt-1",
                          item.checked && "opacity-60"
                        )}
                      >
                        Agregado automáticamente
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
