import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProductCard } from './ProductCard'

describe('ProductCard - Component Tests', () => {
  const defaultProps = {
    name: 'Leche',
    price: 1.5,
    stock: 10,
    minimumStock: 5,
  }

  it('debería renderizar el nombre del producto', () => {
    render(<ProductCard {...defaultProps} />)

    expect(screen.getByTestId('product-name')).toHaveTextContent('Leche')
  })

  it('debería mostrar el precio formateado', () => {
    render(<ProductCard {...defaultProps} />)

    expect(screen.getByTestId('product-price')).toHaveTextContent('1.50 €')
  })

  it('debería mostrar la cantidad de stock', () => {
    render(<ProductCard {...defaultProps} />)

    expect(screen.getByTestId('product-stock')).toHaveTextContent('Stock: 10')
  })

  it('NO debería mostrar advertencia de stock bajo cuando hay stock suficiente', () => {
    render(<ProductCard {...defaultProps} stock={15} minimumStock={5} />)

    expect(screen.queryByTestId('low-stock-warning')).not.toBeInTheDocument()
  })

  it('debería mostrar advertencia de stock bajo cuando el stock es menor o igual al mínimo', () => {
    render(<ProductCard {...defaultProps} stock={5} minimumStock={5} />)

    expect(screen.getByTestId('low-stock-warning')).toBeInTheDocument()
    expect(screen.getByTestId('low-stock-warning')).toHaveTextContent('⚠️ Stock bajo')
  })

  it('debería llamar a onAddToCart cuando se hace click en el botón', () => {
    const onAddToCart = vi.fn()
    render(<ProductCard {...defaultProps} onAddToCart={onAddToCart} />)

    const button = screen.getByTestId('add-to-cart-button')
    fireEvent.click(button)

    expect(onAddToCart).toHaveBeenCalledTimes(1)
  })

  it('debería deshabilitar el botón cuando no hay stock', () => {
    render(<ProductCard {...defaultProps} stock={0} />)

    const button = screen.getByTestId('add-to-cart-button')
    expect(button).toBeDisabled()
    expect(button).toHaveTextContent('Sin stock')
  })

  it('NO debería llamar a onAddToCart cuando el botón está deshabilitado', () => {
    const onAddToCart = vi.fn()
    render(<ProductCard {...defaultProps} stock={0} onAddToCart={onAddToCart} />)

    const button = screen.getByTestId('add-to-cart-button')
    fireEvent.click(button)

    expect(onAddToCart).not.toHaveBeenCalled()
  })

  it('debería aplicar las clases CSS correctas para el botón habilitado', () => {
    render(<ProductCard {...defaultProps} />)

    const button = screen.getByTestId('add-to-cart-button')
    expect(button).toHaveClass('bg-blue-600')
  })

  it('debería aplicar las clases CSS correctas para el botón deshabilitado', () => {
    render(<ProductCard {...defaultProps} stock={0} />)

    const button = screen.getByTestId('add-to-cart-button')
    expect(button).toHaveClass('bg-gray-300')
  })
})

