import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { DashboardPage } from './DashboardPage'

describe('DashboardPage - Integration Tests', () => {
  it('debería renderizar el título del dashboard', () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    )

    expect(screen.getByText('Dashboard - Mis Productos')).toBeInTheDocument()
  })

  it('debería renderizar el componente ShoppingList', () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    )

    // Verificar que se muestra el header de la lista de compras
    expect(screen.getByTestId('cart-header')).toBeInTheDocument()
  })

  it('debería mostrar los 4 productos de ejemplo', () => {
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

  it('debería mostrar el grid de productos', () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    )

    expect(screen.getByTestId('products-grid')).toBeInTheDocument()
  })
})

