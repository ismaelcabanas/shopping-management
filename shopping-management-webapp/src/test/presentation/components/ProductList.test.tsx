import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductList } from '../../../presentation/components/ProductList';

describe('ProductList - Component Tests', () => {
  it('should display empty state message when no products', () => {
    render(<ProductList products={[]} />);

    expect(screen.getByText(/no hay productos/i)).toBeInTheDocument();
  });

  it('should display icon in empty state', () => {
    render(<ProductList products={[]} />);

    expect(screen.getByTestId('empty-state-icon')).toBeInTheDocument();
  });

  it('should render list of products', () => {
    const products = [
      { id: '1', name: 'Leche', quantity: 2, unitType: 'units' as const },
      { id: '2', name: 'Pan', quantity: 3, unitType: 'units' as const },
    ];

    render(<ProductList products={products} />);

    expect(screen.getByText('Leche')).toBeInTheDocument();
    expect(screen.getByText('Pan')).toBeInTheDocument();
    expect(screen.getByText('2 ud')).toBeInTheDocument();
    expect(screen.getByText('3 ud')).toBeInTheDocument();
  });

  it('should display skeleton loader when loading', () => {
    render(<ProductList products={[]} isLoading={true} />);

    const skeletons = screen.getAllByTestId('skeleton-loader');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should not display empty state when loading', () => {
    render(<ProductList products={[]} isLoading={true} />);

    expect(screen.queryByText(/no hay productos/i)).not.toBeInTheDocument();
  });

  it('should display products in a list container', () => {
    const products = [
      { id: '1', name: 'Leche', quantity: 2, unitType: 'units' as const },
    ];

    render(<ProductList products={products} />);

    expect(screen.getByTestId('product-list-container')).toBeInTheDocument();
  });

  it('should render correct number of product items', () => {
    const products = [
      { id: '1', name: 'Leche', quantity: 2, unitType: 'units' as const },
      { id: '2', name: 'Pan', quantity: 3, unitType: 'units' as const },
      { id: '3', name: 'Huevos', quantity: 12, unitType: 'units' as const },
    ];

    render(<ProductList products={products} />);

    const items = screen.getAllByTestId('product-list-item');
    expect(items).toHaveLength(3);
  });

  it('should handle empty products array without loading', () => {
    render(<ProductList products={[]} isLoading={false} />);

    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });
});