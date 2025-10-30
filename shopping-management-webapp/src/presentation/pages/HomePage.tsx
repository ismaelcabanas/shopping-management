import { Link } from 'react-router-dom'
import { Package, ShoppingCart, DollarSign, BarChart3 } from 'lucide-react'
import { Button } from '../shared/components/Button'
import { Card } from '../shared/components/Card'

export function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-page">
      <div className="container mx-auto px-4 max-w-6xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Bienvenido a Shopping Manager
          </h1>
          <p className="text-gray-600 mb-6">
            Sistema de gestión de inventario personal y optimización de compras
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  Gestión de Inventario
                </h2>
                <p className="text-gray-600">
                  Lleva un registro del stock de productos que habitualmente compras
                </p>
              </div>
            </div>
            <Link to="/dashboard">
              <Button variant="primary" fullWidth data-testid="go-to-dashboard">
                Ir al Dashboard
              </Button>
            </Link>
          </Card>

          <Card>
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-success/10 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-success" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  Lista de Compras
                </h2>
                <p className="text-gray-600">
                  Genera automáticamente tu lista basada en el stock actual
                </p>
              </div>
            </div>
            <Button variant="secondary" fullWidth disabled>
              Próximamente
            </Button>
          </Card>

          <Card>
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-warning/10 rounded-lg">
                <DollarSign className="w-6 h-6 text-warning" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  Optimización de Precios
                </h2>
                <p className="text-gray-600">
                  Compara precios en diferentes tiendas para ahorrar
                </p>
              </div>
            </div>
            <Button variant="secondary" fullWidth disabled>
              Próximamente
            </Button>
          </Card>

          <Card>
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  Estadísticas
                </h2>
                <p className="text-gray-600">
                  Analiza tus patrones de compra e históricos de precios
                </p>
              </div>
            </div>
            <Button variant="secondary" fullWidth disabled>
              Próximamente
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
