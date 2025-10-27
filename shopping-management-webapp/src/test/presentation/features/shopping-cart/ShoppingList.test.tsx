import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ShoppingList } from '../../../../presentation/features/shopping-cart/ShoppingList'
import type { Product } from '../../../../presentation/features/shopping-cart/ShoppingList'

describe('ShoppingList - Integration Tests', () => {
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Leche',
      price: 1.5,
      stock: 10,
      minimumStock: 5,
    },
    {
      id: '2',
      name: 'Pan',
      price: 0.8,
      stock: 3,
      minimumStock: 5,
    },
    {
      id: '3',
      name: 'Huevos',
      price: 2.5,
      stock: 0,
      minimumStock: 6,
    },
  ]

  it('should render all products', () => {
    render(<ShoppingList products={mockProducts} />)

    expect(screen.getByText('Leche')).toBeInTheDocument()
    expect(screen.getByText('Pan')).toBeInTheDocument()
    expect(screen.getByText('Huevos')).toBeInTheDocument()
  })

  it('should show cart count as 0 initially', () => {
    render(<ShoppingList products={mockProducts} />)

    expect(screen.getByTestId('cart-count')).toHaveTextContent('Productos en la lista: 0')
  })

  it('should add a product to the list when button is clicked', () => {
    render(<ShoppingList products={mockProducts} />)

    // Buscar todos los botones "Agregar a la lista"
    const addButtons = screen.getAllByTestId('add-to-cart-button')

    // Click en el primer botón (Leche)
    fireEvent.click(addButtons[0])

    expect(screen.getByTestId('cart-count')).toHaveTextContent('Productos en la lista: 1')
  })

  it('should display added products in the list', () => {
    render(<ShoppingList products={mockProducts} />)

    const addButtons = screen.getAllByTestId('add-to-cart-button')

    // Agregar Leche
    fireEvent.click(addButtons[0])

    // Agregar Pan
    fireEvent.click(addButtons[1])

    expect(screen.getByTestId('cart-count')).toHaveTextContent('Productos en la lista: 2')

    const cartItems = screen.getByTestId('cart-items')
    expect(cartItems).toHaveTextContent('Leche')
    expect(cartItems).toHaveTextContent('Pan')
  })

  it('should remove a product from the list', () => {
    render(<ShoppingList products={mockProducts} />)

    const addButtons = screen.getAllByTestId('add-to-cart-button')

    // Agregar Leche
    fireEvent.click(addButtons[0])

    expect(screen.getByTestId('cart-count')).toHaveTextContent('Productos en la lista: 1')

    // Eliminar Leche
    const removeButton = screen.getByTestId('remove-1')
    fireEvent.click(removeButton)

    expect(screen.getByTestId('cart-count')).toHaveTextContent('Productos en la lista: 0')
  })

  it('should allow adding the same product multiple times', () => {
    render(<ShoppingList products={mockProducts} />)

    const addButtons = screen.getAllByTestId('add-to-cart-button')

    // Agregar Leche tres veces
    fireEvent.click(addButtons[0])
    fireEvent.click(addButtons[0])
    fireEvent.click(addButtons[0])

    expect(screen.getByTestId('cart-count')).toHaveTextContent('Productos en la lista: 3')
  })

  it('should NOT display product list if cart is empty', () => {
    render(<ShoppingList products={mockProducts} />)

    expect(screen.queryByTestId('cart-items')).not.toBeInTheDocument()
  })

  it('should display low stock warning for products with insufficient stock', () => {
    render(<ShoppingList products={mockProducts} />)

    // Pan tiene stock=3 y minimumStock=5, debe mostrar advertencia
    const warnings = screen.getAllByTestId('low-stock-warning')
    expect(warnings.length).toBeGreaterThan(0)
  })

  it('should NOT allow adding products with zero stock', () => {
    render(<ShoppingList products={mockProducts} />)

    const addButtons = screen.getAllByTestId('add-to-cart-button')
    const huevosButton = addButtons[2] // Huevos tiene stock=0

    expect(huevosButton).toBeDisabled()
    expect(huevosButton).toHaveTextContent('Sin stock')
  })
})
