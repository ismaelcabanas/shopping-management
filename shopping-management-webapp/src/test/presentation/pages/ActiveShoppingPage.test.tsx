import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { ActiveShoppingPage } from '../../../presentation/pages/ActiveShoppingPage'
import { BrowserRouter } from 'react-router-dom'

// Mock react-router-dom navigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

describe('ActiveShoppingPage', () => {
  beforeEach(() => {
    localStorage.clear()
    mockNavigate.mockClear()
  })

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>)
  }

  it('should render ShoppingListView with checkboxes enabled', async () => {
    const productId = '123e4567-e89b-12d3-a456-426614174000'

    localStorage.setItem('shopping_manager_products', JSON.stringify([{
      id: productId,
      name: 'Huevos',
      unitType: 'units'
    }]))

    localStorage.setItem('shopping_manager_shopping-list', JSON.stringify([{
      productId: productId,
      reason: 'auto',
      stockLevel: 'low',
      addedAt: new Date().toISOString()
    }]))

    renderWithRouter(<ActiveShoppingPage />)

    await waitFor(() => {
      expect(screen.getByText('1 producto')).toBeInTheDocument()
    })

    // Checkboxes should be present in active mode
    expect(screen.getByRole('checkbox', { name: /Marcar .* como comprado/i })).toBeInTheDocument()
  })

  it('should render "Escanear Ticket" button', async () => {
    const productId = '123e4567-e89b-12d3-a456-426614174000'

    localStorage.setItem('shopping_manager_products', JSON.stringify([{
      id: productId,
      name: 'Huevos',
      unitType: 'units'
    }]))

    localStorage.setItem('shopping_manager_shopping-list', JSON.stringify([{
      productId: productId,
      reason: 'auto',
      stockLevel: 'low',
      addedAt: new Date().toISOString()
    }]))

    renderWithRouter(<ActiveShoppingPage />)

    await waitFor(() => {
      expect(screen.getByText('1 producto')).toBeInTheDocument()
    })

    expect(screen.getByRole('button', { name: /Escanear Ticket/i })).toBeInTheDocument()
  })

  it('should render "Registrar Manual" button', async () => {
    const productId = '123e4567-e89b-12d3-a456-426614174000'

    localStorage.setItem('shopping_manager_products', JSON.stringify([{
      id: productId,
      name: 'Huevos',
      unitType: 'units'
    }]))

    localStorage.setItem('shopping_manager_shopping-list', JSON.stringify([{
      productId: productId,
      reason: 'auto',
      stockLevel: 'low',
      addedAt: new Date().toISOString()
    }]))

    renderWithRouter(<ActiveShoppingPage />)

    await waitFor(() => {
      expect(screen.getByText('1 producto')).toBeInTheDocument()
    })

    expect(screen.getByRole('button', { name: /Registrar Manual/i })).toBeInTheDocument()
  })

  it('should render "Cancelar" button in header', async () => {
    const productId = '123e4567-e89b-12d3-a456-426614174000'

    localStorage.setItem('shopping_manager_products', JSON.stringify([{
      id: productId,
      name: 'Huevos',
      unitType: 'units'
    }]))

    localStorage.setItem('shopping_manager_shopping-list', JSON.stringify([{
      productId: productId,
      reason: 'auto',
      stockLevel: 'low',
      addedAt: new Date().toISOString()
    }]))

    renderWithRouter(<ActiveShoppingPage />)

    await waitFor(() => {
      expect(screen.getByText('1 producto')).toBeInTheDocument()
    })

    expect(screen.getByRole('button', { name: /Cancelar/i })).toBeInTheDocument()
  })

  it('should navigate to /shopping-list when Cancel clicked', async () => {
    const user = userEvent.setup()
    const productId = '123e4567-e89b-12d3-a456-426614174000'

    localStorage.setItem('shopping_manager_products', JSON.stringify([{
      id: productId,
      name: 'Huevos',
      unitType: 'units'
    }]))

    localStorage.setItem('shopping_manager_shopping-list', JSON.stringify([{
      productId: productId,
      reason: 'auto',
      stockLevel: 'low',
      addedAt: new Date().toISOString()
    }]))

    renderWithRouter(<ActiveShoppingPage />)

    await waitFor(() => {
      expect(screen.getByText('1 producto')).toBeInTheDocument()
    })

    const cancelButton = screen.getByRole('button', { name: /Cancelar/i })
    await user.click(cancelButton)

    expect(mockNavigate).toHaveBeenCalledWith('/shopping-list')
  })

  it('should display header with "🛒 Comprando..."', async () => {
    const productId = '123e4567-e89b-12d3-a456-426614174000'

    localStorage.setItem('shopping_manager_products', JSON.stringify([{
      id: productId,
      name: 'Huevos',
      unitType: 'units'
    }]))

    localStorage.setItem('shopping_manager_shopping-list', JSON.stringify([{
      productId: productId,
      reason: 'auto',
      stockLevel: 'low',
      addedAt: new Date().toISOString()
    }]))

    renderWithRouter(<ActiveShoppingPage />)

    await waitFor(() => {
      expect(screen.getByText(/Comprando/i)).toBeInTheDocument()
    })
  })

  it('should toggle checkbox state when clicked', async () => {
    const user = userEvent.setup()
    const productId = '123e4567-e89b-12d3-a456-426614174000'

    localStorage.setItem('shopping_manager_products', JSON.stringify([{
      id: productId,
      name: 'Huevos',
      unitType: 'units'
    }]))

    localStorage.setItem('shopping_manager_shopping-list', JSON.stringify([{
      productId: productId,
      reason: 'auto',
      stockLevel: 'low',
      addedAt: new Date().toISOString()
    }]))

    renderWithRouter(<ActiveShoppingPage />)

    await waitFor(() => {
      expect(screen.getByText('1 producto')).toBeInTheDocument()
    })

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()

    await user.click(checkbox)

    await waitFor(() => {
      expect(checkbox).toBeChecked()
    })
  })

  it('should apply visual styling to checked items', async () => {
    const user = userEvent.setup()
    const productId = '123e4567-e89b-12d3-a456-426614174000'

    localStorage.setItem('shopping_manager_products', JSON.stringify([{
      id: productId,
      name: 'Huevos',
      unitType: 'units'
    }]))

    localStorage.setItem('shopping_manager_shopping-list', JSON.stringify([{
      productId: productId,
      reason: 'auto',
      stockLevel: 'low',
      addedAt: new Date().toISOString()
    }]))

    renderWithRouter(<ActiveShoppingPage />)

    await waitFor(() => {
      expect(screen.getByText('1 producto')).toBeInTheDocument()
    })

    const checkbox = screen.getByRole('checkbox')
    const productName = screen.getByText('Huevos')

    // Initially not checked - no strikethrough
    expect(productName).not.toHaveClass('line-through')

    await user.click(checkbox)

    await waitFor(() => {
      expect(checkbox).toBeChecked()
    })

    // After checking - should have strikethrough and reduced opacity
    await waitFor(() => {
      const checkedName = screen.getByText('Huevos')
      expect(checkedName).toHaveClass('line-through')
      expect(checkedName).toHaveClass('opacity-60')
    })
  })
})
