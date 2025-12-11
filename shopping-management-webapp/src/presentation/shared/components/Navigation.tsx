import { Link, useLocation } from 'react-router-dom'
import { Home, Package, LayoutDashboard, ShoppingCart, ShoppingBag } from 'lucide-react'

export function Navigation() {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <nav className="bg-white shadow-card mb-8" data-testid="navigation">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-primary" />
            <Link
              to="/"
              className="text-xl font-bold text-gray-800 hover:text-primary transition-colors"
              data-testid="nav-home-link"
            >
              Shopping Manager
            </Link>
          </div>

          <div className="flex space-x-2">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                isActive('/')
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              data-testid="nav-home"
            >
              <Home className="w-4 h-4" />
              <span>Inicio</span>
            </Link>
            <Link
              to="/catalog"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                isActive('/catalog')
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              data-testid="nav-catalog"
            >
              <Package className="w-4 h-4" />
              <span>Mi Despensa</span>
            </Link>
            <Link
              to="/shopping-list"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                isActive('/shopping-list')
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              data-testid="nav-shopping-list"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Lista de Compras</span>
            </Link>
            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                isActive('/dashboard')
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              data-testid="nav-dashboard"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}