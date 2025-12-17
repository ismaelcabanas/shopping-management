import { useShoppingList } from '../hooks/useShoppingList'
import { useNavigate } from 'react-router-dom'
import { ShoppingListView } from '../components/ShoppingListView'

export function ActiveShoppingPage() {
  const { items, isLoading, error, toggleChecked } = useShoppingList()
  const navigate = useNavigate()

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

  const handleCancel = () => {
    navigate('/shopping-list')
  }

  const handleScanTicket = () => {
    // TODO: Open TicketScanModal
    console.log('Open TicketScanModal')
  }

  const handleRegisterManual = () => {
    // TODO: Open RegisterPurchaseModal
    console.log('Open RegisterPurchaseModal')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with title and cancel button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🛒 Comprando...</h1>
        <button
          onClick={handleCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors"
        >
          Cancelar
        </button>
      </div>

      {/* Shopping list with checkboxes enabled */}
      <ShoppingListView items={items} readonly={false} onToggleChecked={toggleChecked} />

      {/* Action buttons */}
      {items.length > 0 && (
        <div className="mt-6 flex gap-4 justify-center">
          <button
            onClick={handleScanTicket}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            📸 Escanear Ticket
          </button>
          <button
            onClick={handleRegisterManual}
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            ✏️ Registrar Manual
          </button>
        </div>
      )}

      {/* TODO: Add TicketScanModal */}
      {/* TODO: Add RegisterPurchaseModal */}
    </div>
  )
}
