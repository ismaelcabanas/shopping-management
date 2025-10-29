import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductListItem } from '../../../presentation/components/ProductListItem';

describe('ProductListItem - Component Tests', () => {
  it('should display the product name', () => {
    render(<ProductListItem name="Leche" quantity={2} unitType="units" />);

    expect(screen.getByText('Leche')).toBeInTheDocument();
  });

  it('should display the quantity with unit type', () => {
    render(<ProductListItem name="Pan" quantity={3} unitType="units" />);

    expect(screen.getByText('3 ud')).toBeInTheDocument();
  });

  it('should display zero quantity', () => {
    render(<ProductListItem name="Huevos" quantity={0} unitType="units" />);

    expect(screen.getByText('0 ud')).toBeInTheDocument();
  });

  it('should have touch-friendly height (minimum 60px)', () => {
    render(<ProductListItem name="Leche" quantity={2} unitType="units" />);

    const listItem = screen.getByTestId('product-list-item');
    const styles = window.getComputedStyle(listItem);
    const minHeight = parseInt(styles.minHeight, 10);

    expect(minHeight).toBeGreaterThanOrEqual(60);
  });

  it('should apply responsive padding for touch', () => {
    render(<ProductListItem name="Leche" quantity={2} unitType="units" />);

    const listItem = screen.getByTestId('product-list-item');
    expect(listItem).toHaveClass('py-4');
  });

  it('should display product name with correct test id', () => {
    render(<ProductListItem name="Café" quantity={5} unitType="units" />);

    expect(screen.getByTestId('product-list-item-name')).toHaveTextContent('Café');
  });

  it('should display quantity with correct test id', () => {
    render(<ProductListItem name="Azúcar" quantity={10} unitType="units" />);

    expect(screen.getByTestId('product-list-item-quantity')).toHaveTextContent('10 ud');
  });
});