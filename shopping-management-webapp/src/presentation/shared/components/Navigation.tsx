import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Package, LayoutDashboard, ShoppingCart, ShoppingBag, Menu, X } from 'lucide-react'

export function Navigation() {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const hamburgerButtonRef = useRef<HTMLButtonElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev)
  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  // Body scroll lock when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  // Escape key to close mobile menu
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        closeMobileMenu()
      }
    }

    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isMobileMenuOpen])

  // Focus management: move focus to close button when menu opens, restore to hamburger when closes
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Move focus to close button when menu opens
      closeButtonRef.current?.focus()
    } else {
      // Return focus to hamburger button when menu closes
      hamburgerButtonRef.current?.focus()
    }
  }, [isMobileMenuOpen])

  return (
    <>
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
              <span className="hidden md:inline" data-testid="brand-text">
                Shopping Manager
              </span>
            </Link>
          </div>

          {/* Hamburger button - visible only on mobile */}
          <button
            ref={hamburgerButtonRef}
            onClick={toggleMobileMenu}
            className="md:hidden p-2 min-h-touch focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
            aria-label="Abrir menú de navegación"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            data-testid="hamburger-button"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>

          {/* Desktop navigation - hidden on mobile */}
          <div className="hidden md:flex space-x-2" data-testid="desktop-nav">
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

      {/* Mobile Menu - only render when open */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop with fade animation */}
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-250 ease-in-out"
            aria-hidden="true"
            data-testid="mobile-menu-backdrop"
          />

          {/* Mobile Menu Drawer with slide-in animation */}
          <nav
            id="mobile-menu"
            className="fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white shadow-2xl z-50 transition-transform duration-250 ease-in-out"
            role="navigation"
            aria-label="Navegación principal móvil"
            data-testid="mobile-menu-drawer"
          >
            {/* Close button */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-6 h-6 text-primary" />
                <span className="text-lg font-bold text-gray-800">Shopping Manager</span>
              </div>
              <button
                ref={closeButtonRef}
                onClick={closeMobileMenu}
                className="p-2 min-h-touch focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
                aria-label="Cerrar menú"
                data-testid="mobile-menu-close"
              >
                <X className="w-6 h-6 text-gray-700" />
              </button>
            </div>

            {/* Mobile navigation links */}
            <div className="flex flex-col py-4">
              <Link
                to="/"
                onClick={closeMobileMenu}
                className={`flex items-center gap-3 px-6 py-4 min-h-touch-lg transition-colors ${
                  isActive('/')
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Home className="w-5 h-5" />
                <span className="text-base">Inicio</span>
              </Link>
              <Link
                to="/catalog"
                onClick={closeMobileMenu}
                className={`flex items-center gap-3 px-6 py-4 min-h-touch-lg transition-colors ${
                  isActive('/catalog')
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Package className="w-5 h-5" />
                <span className="text-base">Mi Despensa</span>
              </Link>
              <Link
                to="/shopping-list"
                onClick={closeMobileMenu}
                className={`flex items-center gap-3 px-6 py-4 min-h-touch-lg transition-colors ${
                  isActive('/shopping-list')
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="text-base">Lista de Compras</span>
              </Link>
              <Link
                to="/dashboard"
                onClick={closeMobileMenu}
                className={`flex items-center gap-3 px-6 py-4 min-h-touch-lg transition-colors ${
                  isActive('/dashboard')
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span className="text-base">Dashboard</span>
              </Link>
            </div>
          </nav>
        </>
      )}
    </>
  )
}