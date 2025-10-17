import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { Navigation } from '../components/Navigation'
import { HomePage } from '../pages/HomePage'
import { DashboardPage } from '../pages/DashboardPage'

// Componente helper que simula la estructura completa de la app
function AppWithRouter({ initialRoute = '/' }: { initialRoute?: string }) {
  return (
    <MemoryRouter initialEntries={[initialRoute]}>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('Router - Integration Tests', () => {
  describe('Navegación básica', () => {
    it('debería renderizar la página de inicio por defecto', () => {
      render(<AppWithRouter />)

      expect(screen.getByText('Bienvenido a Shopping Manager')).toBeInTheDocument()
    })

    it('debería renderizar el dashboard cuando la ruta inicial es /dashboard', () => {
      render(<AppWithRouter initialRoute="/dashboard" />)

      expect(screen.getByText('Dashboard - Mis Productos')).toBeInTheDocument()
    })

    it('debería mostrar la navegación en todas las páginas', () => {
      render(<AppWithRouter />)

      expect(screen.getByTestId('navigation')).toBeInTheDocument()
      expect(screen.getByTestId('nav-home')).toBeInTheDocument()
      expect(screen.getByTestId('nav-dashboard')).toBeInTheDocument()
    })
  })

  describe('Navegación entre páginas', () => {
    it('debería navegar de Home a Dashboard al hacer click en el enlace de la nav', async () => {
      render(<AppWithRouter />)

      // Verificar que estamos en Home
      expect(screen.getByText('Bienvenido a Shopping Manager')).toBeInTheDocument()

      // Click en el enlace de Dashboard en la navegación
      const dashboardNavLink = screen.getByTestId('nav-dashboard')
      fireEvent.click(dashboardNavLink)

      // Verificar que ahora estamos en Dashboard
      await waitFor(() => {
        expect(screen.getByText('Dashboard - Mis Productos')).toBeInTheDocument()
      })
    })

    it('debería navegar de Dashboard a Home al hacer click en el enlace de la nav', async () => {
      render(<AppWithRouter initialRoute="/dashboard" />)

      // Verificar que estamos en Dashboard
      expect(screen.getByText('Dashboard - Mis Productos')).toBeInTheDocument()

      // Click en el enlace de Home en la navegación
      const homeNavLink = screen.getByTestId('nav-home')
      fireEvent.click(homeNavLink)

      // Verificar que ahora estamos en Home
      await waitFor(() => {
        expect(screen.getByText('Bienvenido a Shopping Manager')).toBeInTheDocument()
      })
    })

    it('debería navegar al Dashboard usando el botón "Ir al Dashboard" de la HomePage', async () => {
      render(<AppWithRouter />)

      // Verificar que estamos en Home
      expect(screen.getByText('Bienvenido a Shopping Manager')).toBeInTheDocument()

      // Click en el botón de la tarjeta
      const goToDashboardButton = screen.getByTestId('go-to-dashboard')
      fireEvent.click(goToDashboardButton)

      // Verificar que navegamos al Dashboard
      await waitFor(() => {
        expect(screen.getByText('Dashboard - Mis Productos')).toBeInTheDocument()
      })
    })
  })

  describe('Estilos de navegación activa', () => {
    it('debería marcar como activo el enlace Home cuando estamos en /', () => {
      render(<AppWithRouter initialRoute="/" />)

      const homeLink = screen.getByTestId('nav-home')
      expect(homeLink).toHaveClass('bg-blue-600')
      expect(homeLink).toHaveClass('text-white')
    })

    it('debería marcar como activo el enlace Dashboard cuando estamos en /dashboard', () => {
      render(<AppWithRouter initialRoute="/dashboard" />)

      const dashboardLink = screen.getByTestId('nav-dashboard')
      expect(dashboardLink).toHaveClass('bg-blue-600')
      expect(dashboardLink).toHaveClass('text-white')
    })

    it('debería cambiar el estilo activo al navegar', async () => {
      render(<AppWithRouter />)

      // Inicialmente Home debe estar activo
      let homeLink = screen.getByTestId('nav-home')
      let dashboardLink = screen.getByTestId('nav-dashboard')

      expect(homeLink).toHaveClass('bg-blue-600')
      expect(dashboardLink).not.toHaveClass('bg-blue-600')

      // Navegar a Dashboard
      fireEvent.click(dashboardLink)

      // Ahora Dashboard debe estar activo
      await waitFor(() => {
        homeLink = screen.getByTestId('nav-home')
        dashboardLink = screen.getByTestId('nav-dashboard')

        expect(dashboardLink).toHaveClass('bg-blue-600')
        expect(homeLink).not.toHaveClass('bg-blue-600')
      })
    })
  })

  describe('Logo de navegación', () => {
    it('debería tener un enlace al home en el logo', () => {
      render(<AppWithRouter initialRoute="/dashboard" />)

      const logoLink = screen.getByTestId('nav-home-link')
      expect(logoLink).toHaveTextContent('🛒 Shopping Manager')
    })

    it('debería navegar al home al hacer click en el logo desde el dashboard', async () => {
      render(<AppWithRouter initialRoute="/dashboard" />)

      // Verificar que estamos en Dashboard
      expect(screen.getByText('Dashboard - Mis Productos')).toBeInTheDocument()

      // Click en el logo
      const logoLink = screen.getByTestId('nav-home-link')
      fireEvent.click(logoLink)

      // Verificar que navegamos a Home
      await waitFor(() => {
        expect(screen.getByText('Bienvenido a Shopping Manager')).toBeInTheDocument()
      })
    })
  })
})

