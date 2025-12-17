import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { ShoppingListPage } from '../../../presentation/pages/ShoppingListPage'
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

describe('ShoppingListPage', () => {
  beforeEach(() => {
    localStorage.clear()
    mockNavigate.mockClear()
  })

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>)
  }

  it('should display empty state when no items in shopping list', async () => {
    render(<ShoppingListPage />)

    await waitFor(() => {
      expect(screen.getByText('Lista de Compras')).toBeInTheDocument()
    })

    expect(screen.getByText('No hay productos en la lista de compras')).toBeInTheDocument()
    expect(screen.getByText(/Los productos con stock bajo se agregarán automáticamente/i)).toBeInTheDocument()
  })

  it('should display shopping list items without checkbox in readonly mode', async () => {
    // Setup: Add product and shopping list item
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

    renderWithRouter(<ShoppingListPage />)

    await waitFor(() => {
      expect(screen.getByText('1 producto')).toBeInTheDocument()
    })

    // No checkboxes in readonly mode
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    // But "Iniciar Compra" button should be present
    expect(screen.getByRole('button', { name: /Iniciar Compra/i })).toBeInTheDocument()
  })

  it('should display "Stock bajo" badge for low stock items', async () => {
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

    render(<ShoppingListPage />)

    await waitFor(() => {
      expect(screen.getByText('Stock bajo')).toBeInTheDocument()
    })
  })

  it('should display "Sin stock" badge for empty stock items', async () => {
    const productId = '123e4567-e89b-12d3-a456-426614174000'

    localStorage.setItem('shopping_manager_products', JSON.stringify([{
      id: productId,
      name: 'Café',
      unitType: 'units'
    }]))

    localStorage.setItem('shopping_manager_shopping-list', JSON.stringify([{
      productId: productId,
      reason: 'auto',
      stockLevel: 'empty',
      addedAt: new Date().toISOString()
    }]))

    render(<ShoppingListPage />)

    await waitFor(() => {
      expect(screen.getByText('Sin stock')).toBeInTheDocument()
    })
  })

  // Removed: Checkbox tests moved to ActiveShoppingPage (interactive mode)

  it('should display multiple items', async () => {
    const productId1 = '123e4567-e89b-12d3-a456-426614174000'
    const productId2 = '123e4567-e89b-12d3-a456-426614174001'

    localStorage.setItem('shopping_manager_products', JSON.stringify([
      { id: productId1, name: 'Huevos', unitType: 'units' },
      { id: productId2, name: 'Leche', unitType: 'liters' }
    ]))

    localStorage.setItem('shopping_manager_shopping-list', JSON.stringify([
      {
        productId: productId1,
        reason: 'auto',
        stockLevel: 'low',
        addedAt: new Date().toISOString()
      },
      {
        productId: productId2,
        reason: 'auto',
        stockLevel: 'empty',
        addedAt: new Date().toISOString()
      }
    ]))

    render(<ShoppingListPage />)

    await waitFor(() => {
      expect(screen.getByText('2 productos')).toBeInTheDocument()
    })

    // Both stock level badges should be present
    expect(screen.getByText('Stock bajo')).toBeInTheDocument()
    expect(screen.getByText('Sin stock')).toBeInTheDocument()
  })

  it('should display loading state initially', () => {
    render(<ShoppingListPage />)

    expect(screen.getByText('Cargando lista de compras...')).toBeInTheDocument()
  })

  // Removed: Checkbox styling tests moved to ActiveShoppingPage (interactive mode)

  describe('Readonly mode with "Iniciar Compra" button', () => {
    it('should render "Iniciar Compra" button', async () => {
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

      renderWithRouter(<ShoppingListPage />)

      await waitFor(() => {
        expect(screen.getByText('1 producto')).toBeInTheDocument()
      })

      expect(screen.getByRole('button', { name: /Iniciar Compra/i })).toBeInTheDocument()
    })

    it('should NOT render checkboxes in readonly mode', async () => {
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

      renderWithRouter(<ShoppingListPage />)

      await waitFor(() => {
        expect(screen.getByText('1 producto')).toBeInTheDocument()
      })

      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    })

    it('should navigate to /shopping/start when "Iniciar Compra" button clicked', async () => {
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
        addedAt: new Date().toISOString(),
        checked: true
      }]))

      renderWithRouter(<ShoppingListPage />)

      await waitFor(() => {
        expect(screen.getByText('1 producto')).toBeInTheDocument()
      })

      const button = screen.getByRole('button', { name: /Iniciar Compra/i })
      await user.click(button)

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/shopping/start')
      })
    })

    it('should show empty state message when no items', async () => {
      renderWithRouter(<ShoppingListPage />)

      await waitFor(() => {
        expect(screen.getByText('Lista de Compras')).toBeInTheDocument()
      })

      expect(screen.getByText('No hay productos en la lista de compras')).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /Iniciar Compra/i })).not.toBeInTheDocument()
    })
  })
})
