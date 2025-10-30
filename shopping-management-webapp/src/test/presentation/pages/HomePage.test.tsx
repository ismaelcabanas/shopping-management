import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HomePage } from '../../../presentation/pages/HomePage'

describe('HomePage - Integration Tests', () => {
  it('should render the main title', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    expect(screen.getByText('Bienvenido a Shopping Manager')).toBeInTheDocument()
  })

  it('should render the 4 feature cards', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    expect(screen.getByText('Gestión de Inventario')).toBeInTheDocument()
    expect(screen.getByText('Lista de Compras')).toBeInTheDocument()
    expect(screen.getByText('Optimización de Precios')).toBeInTheDocument()
    expect(screen.getByText('Estadísticas')).toBeInTheDocument()
  })

  it('should have a link to dashboard', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    const dashboardButton = screen.getByTestId('go-to-dashboard')
    expect(dashboardButton).toBeInTheDocument()
    expect(dashboardButton.closest('a')).toHaveAttribute('href', '/dashboard')
  })

  it('should show 3 disabled buttons for future features', () => {
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
