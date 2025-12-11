import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { ShoppingListPage } from '../../../presentation/pages/ShoppingListPage'

describe('ShoppingListPage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should display empty state when no items in shopping list', async () => {
    render(<ShoppingListPage />)

    await waitFor(() => {
      expect(screen.getByText('Lista de Compras')).toBeInTheDocument()
    })

    expect(screen.getByText('No hay productos en la lista de compras')).toBeInTheDocument()
    expect(screen.getByText(/Los productos con stock bajo se agregarán automáticamente/i)).toBeInTheDocument()
  })

  it('should display shopping list items', async () => {
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

    render(<ShoppingListPage />)

    await waitFor(() => {
      expect(screen.getByText('1 producto')).toBeInTheDocument()
    })

    // Product should be in the list (name may vary based on repository)
    expect(screen.getByRole('button', { name: /Marcar .* como comprado/i })).toBeInTheDocument()
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

  it('should remove item when "Comprado" button is clicked', async () => {
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

    render(<ShoppingListPage />)

    await waitFor(() => {
      expect(screen.getByText('1 producto')).toBeInTheDocument()
    })

    const compradoButton = screen.getByRole('button', { name: /Marcar .* como comprado/i })
    await user.click(compradoButton)

    await waitFor(() => {
      expect(screen.getByText('No hay productos en la lista de compras')).toBeInTheDocument()
    })
  })

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
})
