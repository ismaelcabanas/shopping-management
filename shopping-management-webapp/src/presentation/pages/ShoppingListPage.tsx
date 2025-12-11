import { useShoppingList } from '../hooks/useShoppingList'
import { CheckCircle } from 'lucide-react'

export function ShoppingListPage() {
  const { items, isLoading, error, markAsPurchased } = useShoppingList()

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
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {item.productName}
                      </h3>
                      {getStockLevelBadge(item.stockLevel)}
                    </div>
                    {item.stockLevel && (
                      <p className="text-sm text-gray-500 mt-1">
                        Agregado automáticamente
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => markAsPurchased(item.productId)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    aria-label={`Marcar ${item.productName} como comprado`}
                  >
                    <CheckCircle size={18} />
                    <span>Comprado</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
