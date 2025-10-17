import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Bienvenido a Shopping Manager
          </h1>
          <p className="text-gray-600 mb-6">
            Sistema de gestión de inventario personal y optimización de compras
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-3">📦 Gestión de Inventario</h2>
            <p className="text-gray-600 mb-4">
              Lleva un registro del stock de productos que habitualmente compras
            </p>
            <Link
              to="/dashboard"
              className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              data-testid="go-to-dashboard"
            >
              Ir al Dashboard
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-3">🛒 Lista de Compras</h2>
            <p className="text-gray-600 mb-4">
              Genera automáticamente tu lista basada en el stock actual
            </p>
            <button
              className="px-4 py-2 bg-gray-300 text-gray-600 rounded cursor-not-allowed"
              disabled
            >
              Próximamente
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-3">💰 Optimización de Precios</h2>
            <p className="text-gray-600 mb-4">
              Compara precios en diferentes tiendas para ahorrar
            </p>
            <button
              className="px-4 py-2 bg-gray-300 text-gray-600 rounded cursor-not-allowed"
              disabled
            >
              Próximamente
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-3">📊 Estadísticas</h2>
            <p className="text-gray-600 mb-4">
              Analiza tus patrones de compra e históricos de precios
            </p>
            <button
              className="px-4 py-2 bg-gray-300 text-gray-600 rounded cursor-not-allowed"
              disabled
            >
              Próximamente
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
