import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HomePage } from './HomePage'

describe('HomePage - Integration Tests', () => {
  it('debería renderizar el título principal', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    expect(screen.getByText('Bienvenido a Shopping Manager')).toBeInTheDocument()
  })

  it('debería renderizar las 4 tarjetas de funcionalidades', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    expect(screen.getByText('📦 Gestión de Inventario')).toBeInTheDocument()
    expect(screen.getByText('🛒 Lista de Compras')).toBeInTheDocument()
    expect(screen.getByText('💰 Optimización de Precios')).toBeInTheDocument()
    expect(screen.getByText('📊 Estadísticas')).toBeInTheDocument()
  })

  it('debería tener un enlace al dashboard', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    const dashboardLink = screen.getByTestId('go-to-dashboard')
    expect(dashboardLink).toHaveAttribute('href', '/dashboard')
  })

  it('debería mostrar 3 botones deshabilitados para funcionalidades futuras', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    const disabledButtons = screen.getAllByText('Próximamente')
    expect(disabledButtons).toHaveLength(3)
    disabledButtons.forEach(button => {
      expect(button).toBeDisabled()
    })
  })
})

