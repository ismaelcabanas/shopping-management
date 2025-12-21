import { describe, it, expect, vi } from 'vitest';
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

  describe('Shopping List Integration', () => {
    it('should pass onAddToShoppingList to ProductListItem', () => {
      const handleAdd = vi.fn();
      const products = [
        { id: '1', name: 'Chocolate', quantity: 5, unitType: 'units' as const }
      ];

      render(
        <ProductList
          products={products}
          onAddToShoppingList={handleAdd}
        />
      );

      const button = screen.getByRole('button', { name: /añadir chocolate a la lista de la compra/i });
      expect(button).toBeInTheDocument();
    });

    it('should pass isInShoppingList correctly based on Set', () => {
      const handleAdd = vi.fn();
      const products = [
        { id: '1', name: 'Milk', quantity: 2, unitType: 'units' as const },
        { id: '2', name: 'Bread', quantity: 1, unitType: 'units' as const }
      ];
      const productsInShoppingList = new Set(['1']);

      render(
        <ProductList
          products={products}
          onAddToShoppingList={handleAdd}
          productsInShoppingList={productsInShoppingList}
        />
      );

      const milkButton = screen.getByRole('button', { name: /añadir milk a la lista de la compra/i });
      const breadButton = screen.getByRole('button', { name: /añadir bread a la lista de la compra/i });

      expect(milkButton).toBeDisabled();
      expect(breadButton).toBeEnabled();
    });

    it('should handle productsInShoppingList as empty Set by default', () => {
      const handleAdd = vi.fn();
      const products = [
        { id: '1', name: 'Coffee', quantity: 1, unitType: 'units' as const }
      ];

      render(
        <ProductList
          products={products}
          onAddToShoppingList={handleAdd}
        />
      );

      const button = screen.getByRole('button', { name: /añadir coffee a la lista de la compra/i });
      expect(button).toBeEnabled();
    });

    it('should not render add to shopping list button when onAddToShoppingList not provided', () => {
      const products = [
        { id: '1', name: 'Sugar', quantity: 2, unitType: 'kg' as const }
      ];

      render(<ProductList products={products} />);

      const button = screen.queryByRole('button', { name: /añadir.*a la lista de la compra/i });
      expect(button).not.toBeInTheDocument();
    });
  });
});