import { useShoppingList } from '../hooks/useShoppingList'
import { useNavigate } from 'react-router-dom'
import { ShoppingListView } from '../components/ShoppingListView'
import { StartShopping } from '../../application/use-cases/StartShopping'
import { LocalStorageShoppingListRepository } from '../../infrastructure/repositories/LocalStorageShoppingListRepository'

export function ShoppingListPage() {
  const { items, isLoading, error } = useShoppingList()
  const navigate = useNavigate()

  const handleIniciarCompra = async () => {
    const repository = new LocalStorageShoppingListRepository()
    const startShopping = new StartShopping(repository)
    await startShopping.execute()
    navigate('/shopping/start')
  }

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Lista de Compras</h1>

      <ShoppingListView items={items} readonly={true} />

      {items.length > 0 && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleIniciarCompra}
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            🛒 Iniciar Compra
          </button>
        </div>
      )}
    </div>
  )
}
