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

  it('should render the product name', () => {
    render(<ProductCard {...defaultProps} />)

    expect(screen.getByTestId('product-name')).toHaveTextContent('Leche')
  })

  it('should display the formatted price', () => {
    render(<ProductCard {...defaultProps} />)

    expect(screen.getByTestId('product-price')).toHaveTextContent('1.50 €')
  })

  it('should display the stock quantity', () => {
    render(<ProductCard {...defaultProps} />)

    expect(screen.getByTestId('product-stock')).toHaveTextContent('Stock: 10')
  })

  it('should NOT display low stock warning when stock is sufficient', () => {
    render(<ProductCard {...defaultProps} stock={15} minimumStock={5} />)

    expect(screen.queryByTestId('low-stock-warning')).not.toBeInTheDocument()
  })

  it('should display low stock warning when stock is less than or equal to minimum', () => {
    render(<ProductCard {...defaultProps} stock={5} minimumStock={5} />)

    expect(screen.getByTestId('low-stock-warning')).toBeInTheDocument()
    expect(screen.getByTestId('low-stock-warning')).toHaveTextContent('⚠️ Stock bajo')
  })

  it('should call onAddToCart when button is clicked', () => {
    const onAddToCart = vi.fn()
    render(<ProductCard {...defaultProps} onAddToCart={onAddToCart} />)

    const button = screen.getByTestId('add-to-cart-button')
    fireEvent.click(button)

    expect(onAddToCart).toHaveBeenCalledTimes(1)
  })

  it('should disable the button when stock is zero', () => {
    render(<ProductCard {...defaultProps} stock={0} />)

    const button = screen.getByTestId('add-to-cart-button')
    expect(button).toBeDisabled()
    expect(button).toHaveTextContent('Sin stock')
  })

  it('should NOT call onAddToCart when button is disabled', () => {
    const onAddToCart = vi.fn()
    render(<ProductCard {...defaultProps} stock={0} onAddToCart={onAddToCart} />)

    const button = screen.getByTestId('add-to-cart-button')
    fireEvent.click(button)

    expect(onAddToCart).not.toHaveBeenCalled()
  })

  it('should apply correct CSS classes for enabled button', () => {
    render(<ProductCard {...defaultProps} />)

    const button = screen.getByTestId('add-to-cart-button')
    expect(button).toHaveClass('bg-blue-600')
  })

  it('should apply correct CSS classes for disabled button', () => {
    render(<ProductCard {...defaultProps} stock={0} />)

    const button = screen.getByTestId('add-to-cart-button')
    expect(button).toHaveClass('bg-gray-300')
  })
})
