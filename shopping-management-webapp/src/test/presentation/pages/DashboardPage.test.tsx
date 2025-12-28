import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { DashboardPage } from '../../../presentation/pages/DashboardPage'

describe('DashboardPage - Integration Tests', () => {
  it('should render the dashboard title', () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    )

    expect(screen.getByText('Dashboard - Mis Productos')).toBeInTheDocument()
  })

  it('should render the ShoppingList component', () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    )

    expect(screen.getByTestId('cart-header')).toBeInTheDocument()
  })

  it('should display the 4 example products', () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    )

    expect(screen.getByText('Leche')).toBeInTheDocument()
    expect(screen.getByText('Pan')).toBeInTheDocument()
    expect(screen.getByText('Huevos')).toBeInTheDocument()
    expect(screen.getByText('Manzanas')).toBeInTheDocument()
  })

  it('should display the products grid', () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    )

    expect(screen.getByTestId('products-grid')).toBeInTheDocument()
  })

  it('should show empty state when no products', () => {
    render(
      <MemoryRouter>
        <DashboardPage products={[]} />
      </MemoryRouter>
    )

    expect(screen.getByText(/no hay productos/i)).toBeInTheDocument()
  })
})
