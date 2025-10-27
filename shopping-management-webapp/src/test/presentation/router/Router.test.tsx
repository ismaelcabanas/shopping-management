import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { Navigation } from '../../../presentation/shared/components/Navigation'
import { HomePage } from '../../../presentation/pages/HomePage'
import { DashboardPage } from '../../../presentation/pages/DashboardPage'

// Helper component that simulates the complete app structure
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
  describe('Basic navigation', () => {
    it('should render home page by default', () => {
      render(<AppWithRouter />)

      expect(screen.getByText('Bienvenido a Shopping Manager')).toBeInTheDocument()
    })

    it('should render dashboard when initial route is /dashboard', () => {
      render(<AppWithRouter initialRoute="/dashboard" />)

      expect(screen.getByText('Dashboard - Mis Productos')).toBeInTheDocument()
    })

    it('should show navigation on all pages', () => {
      render(<AppWithRouter />)

      expect(screen.getByTestId('navigation')).toBeInTheDocument()
      expect(screen.getByTestId('nav-home')).toBeInTheDocument()
      expect(screen.getByTestId('nav-dashboard')).toBeInTheDocument()
    })
  })

  describe('Navigation between pages', () => {
    it('should navigate from Home to Dashboard when clicking nav link', async () => {
      render(<AppWithRouter />)

      expect(screen.getByText('Bienvenido a Shopping Manager')).toBeInTheDocument()

      const dashboardNavLink = screen.getByTestId('nav-dashboard')
      fireEvent.click(dashboardNavLink)

      await waitFor(() => {
        expect(screen.getByText('Dashboard - Mis Productos')).toBeInTheDocument()
      })
    })

    it('should navigate from Dashboard to Home when clicking nav link', async () => {
      render(<AppWithRouter initialRoute="/dashboard" />)

      expect(screen.getByText('Dashboard - Mis Productos')).toBeInTheDocument()

      const homeNavLink = screen.getByTestId('nav-home')
      fireEvent.click(homeNavLink)

      await waitFor(() => {
        expect(screen.getByText('Bienvenido a Shopping Manager')).toBeInTheDocument()
      })
    })

    it('should navigate to Dashboard using "Go to Dashboard" button from HomePage', async () => {
      render(<AppWithRouter />)

      expect(screen.getByText('Bienvenido a Shopping Manager')).toBeInTheDocument()

      const goToDashboardButton = screen.getByTestId('go-to-dashboard')
      fireEvent.click(goToDashboardButton)

      await waitFor(() => {
        expect(screen.getByText('Dashboard - Mis Productos')).toBeInTheDocument()
      })
    })
  })

  describe('Active navigation styles', () => {
    it('should mark Home link as active when on /', () => {
      render(<AppWithRouter initialRoute="/" />)

      const homeLink = screen.getByTestId('nav-home')
      expect(homeLink).toHaveClass('bg-blue-600')
      expect(homeLink).toHaveClass('text-white')
    })

    it('should mark Dashboard link as active when on /dashboard', () => {
      render(<AppWithRouter initialRoute="/dashboard" />)

      const dashboardLink = screen.getByTestId('nav-dashboard')
      expect(dashboardLink).toHaveClass('bg-blue-600')
      expect(dashboardLink).toHaveClass('text-white')
    })

    it('should change active style when navigating', async () => {
      render(<AppWithRouter />)

      let homeLink = screen.getByTestId('nav-home')
      let dashboardLink = screen.getByTestId('nav-dashboard')

      expect(homeLink).toHaveClass('bg-blue-600')
      expect(dashboardLink).not.toHaveClass('bg-blue-600')

      fireEvent.click(dashboardLink)

      await waitFor(() => {
        homeLink = screen.getByTestId('nav-home')
        dashboardLink = screen.getByTestId('nav-dashboard')

        expect(dashboardLink).toHaveClass('bg-blue-600')
        expect(homeLink).not.toHaveClass('bg-blue-600')
      })
    })
  })

  describe('Navigation logo', () => {
    it('should have a link to home in the logo', () => {
      render(<AppWithRouter initialRoute="/dashboard" />)

      const logoLink = screen.getByTestId('nav-home-link')
      expect(logoLink).toHaveTextContent('🛒 Shopping Manager')
    })

    it('should navigate to home when clicking logo from dashboard', async () => {
      render(<AppWithRouter initialRoute="/dashboard" />)

      expect(screen.getByText('Dashboard - Mis Productos')).toBeInTheDocument()

      const logoLink = screen.getByTestId('nav-home-link')
      fireEvent.click(logoLink)

      await waitFor(() => {
        expect(screen.getByText('Bienvenido a Shopping Manager')).toBeInTheDocument()
      })
    })
  })
})
