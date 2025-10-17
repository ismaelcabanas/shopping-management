import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ShoppingList } from './ShoppingList'
import type { Product } from './ShoppingList'

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

  it('debería renderizar todos los productos', () => {
    render(<ShoppingList products={mockProducts} />)

    expect(screen.getByText('Leche')).toBeInTheDocument()
    expect(screen.getByText('Pan')).toBeInTheDocument()
    expect(screen.getByText('Huevos')).toBeInTheDocument()
  })

  it('debería mostrar el contador de la lista en 0 inicialmente', () => {
    render(<ShoppingList products={mockProducts} />)

    expect(screen.getByTestId('cart-count')).toHaveTextContent('Productos en la lista: 0')
  })

  it('debería agregar un producto a la lista cuando se hace click en el botón', () => {
    render(<ShoppingList products={mockProducts} />)

    // Buscar todos los botones "Agregar a la lista"
    const addButtons = screen.getAllByTestId('add-to-cart-button')

    // Click en el primer botón (Leche)
    fireEvent.click(addButtons[0])

    expect(screen.getByTestId('cart-count')).toHaveTextContent('Productos en la lista: 1')
  })

  it('debería mostrar los productos agregados en la lista', () => {
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

  it('debería eliminar un producto de la lista', () => {
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

  it('debería permitir agregar el mismo producto varias veces', () => {
    render(<ShoppingList products={mockProducts} />)

    const addButtons = screen.getAllByTestId('add-to-cart-button')

    // Agregar Leche tres veces
    fireEvent.click(addButtons[0])
    fireEvent.click(addButtons[0])
    fireEvent.click(addButtons[0])

    expect(screen.getByTestId('cart-count')).toHaveTextContent('Productos en la lista: 3')
  })

  it('NO debería mostrar la lista de productos si el carrito está vacío', () => {
    render(<ShoppingList products={mockProducts} />)

    expect(screen.queryByTestId('cart-items')).not.toBeInTheDocument()
  })

  it('debería mostrar advertencia de stock bajo para productos con stock insuficiente', () => {
    render(<ShoppingList products={mockProducts} />)

    // Pan tiene stock=3 y minimumStock=5, debe mostrar advertencia
    const warnings = screen.getAllByTestId('low-stock-warning')
    expect(warnings.length).toBeGreaterThan(0)
  })

  it('NO debería permitir agregar productos sin stock', () => {
    render(<ShoppingList products={mockProducts} />)

    const addButtons = screen.getAllByTestId('add-to-cart-button')
    const huevosButton = addButtons[2] // Huevos tiene stock=0

    expect(huevosButton).toBeDisabled()
    expect(huevosButton).toHaveTextContent('Sin stock')
  })
})
