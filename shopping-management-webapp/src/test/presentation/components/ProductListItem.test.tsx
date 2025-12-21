import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { ProductListItem } from '../../../presentation/components/ProductListItem';

describe('ProductListItem - Component Tests', () => {
  it('should display the product name', () => {
    render(<ProductListItem id="test-id-1" name="Leche" quantity={2} unitType="units" />);

    expect(screen.getByText('Leche')).toBeInTheDocument();
  });

  it('should display the quantity with unit type', () => {
    render(<ProductListItem id="test-id-2" name="Pan" quantity={3} unitType="units" />);

    expect(screen.getByText('3 ud')).toBeInTheDocument();
  });

  it('should display zero quantity', () => {
    render(<ProductListItem id="test-id-3" name="Huevos" quantity={0} unitType="units" />);

    expect(screen.getByText('0 ud')).toBeInTheDocument();
  });

  it('should have touch-friendly height (minimum 60px)', () => {
    render(<ProductListItem id="test-id-4" name="Leche" quantity={2} unitType="units" />);

    const listItem = screen.getByTestId('product-list-item');
    const styles = window.getComputedStyle(listItem);
    const minHeight = parseInt(styles.minHeight, 10);

    expect(minHeight).toBeGreaterThanOrEqual(60);
  });

  it('should apply responsive padding for touch', () => {
    render(<ProductListItem id="test-id-5" name="Leche" quantity={2} unitType="units" />);

    const listItem = screen.getByTestId('product-list-item');
    expect(listItem).toHaveClass('py-4');
  });

  it('should display product name with correct test id', () => {
    render(<ProductListItem id="test-id-6" name="Café" quantity={5} unitType="units" />);

    expect(screen.getByTestId('product-list-item-name')).toHaveTextContent('Café');
  });

  it('should display quantity with correct test id', () => {
    render(<ProductListItem id="test-id-7" name="Azúcar" quantity={10} unitType="units" />);

    expect(screen.getByTestId('product-list-item-quantity')).toHaveTextContent('10 ud');
  });

  describe('Add to Shopping List button', () => {
    it('should render Add to Shopping List button when prop provided', () => {
      const handleAdd = vi.fn();
      render(
        <ProductListItem
          id="test-id-8"
          name="Chocolate"
          quantity={5}
          unitType="units"
          onAddToShoppingList={handleAdd}
        />
      );

      const button = screen.getByRole('button', { name: /añadir chocolate a la lista de la compra/i });
      expect(button).toBeInTheDocument();
    });

    it('should not render button when onAddToShoppingList not provided', () => {
      render(
        <ProductListItem
          id="test-id-9"
          name="Bread"
          quantity={3}
          unitType="units"
        />
      );

      const button = screen.queryByRole('button', { name: /añadir.*a la lista de la compra/i });
      expect(button).not.toBeInTheDocument();
    });

    it('should call onAddToShoppingList with product ID when clicked', async () => {
      const user = userEvent.setup();
      const handleAdd = vi.fn();
      render(
        <ProductListItem
          id="test-id-10"
          name="Coffee"
          quantity={2}
          unitType="units"
          onAddToShoppingList={handleAdd}
        />
      );

      const button = screen.getByRole('button', { name: /añadir coffee a la lista de la compra/i });
      await user.click(button);

      expect(handleAdd).toHaveBeenCalledOnce();
      expect(handleAdd).toHaveBeenCalledWith('test-id-10');
    });

    it('should be disabled when isInShoppingList is true', () => {
      const handleAdd = vi.fn();
      render(
        <ProductListItem
          id="test-id-11"
          name="Milk"
          quantity={1}
          unitType="units"
          onAddToShoppingList={handleAdd}
          isInShoppingList={true}
        />
      );

      const button = screen.getByRole('button', { name: /añadir milk a la lista de la compra/i });
      expect(button).toBeDisabled();
    });

    it('should be enabled when isInShoppingList is false', () => {
      const handleAdd = vi.fn();
      render(
        <ProductListItem
          id="test-id-12"
          name="Eggs"
          quantity={6}
          unitType="units"
          onAddToShoppingList={handleAdd}
          isInShoppingList={false}
        />
      );

      const button = screen.getByRole('button', { name: /añadir eggs a la lista de la compra/i });
      expect(button).toBeEnabled();
    });

    it('should show correct aria-label with product name', () => {
      const handleAdd = vi.fn();
      render(
        <ProductListItem
          id="test-id-13"
          name="Yogur"
          quantity={4}
          unitType="units"
          onAddToShoppingList={handleAdd}
        />
      );

      const button = screen.getByRole('button', { name: /añadir yogur a la lista de la compra/i });
      expect(button).toHaveAttribute('aria-label', 'Añadir Yogur a la lista de la compra');
    });

    it('should show correct tooltip when enabled', () => {
      const handleAdd = vi.fn();
      render(
        <ProductListItem
          id="test-id-14"
          name="Butter"
          quantity={1}
          unitType="units"
          onAddToShoppingList={handleAdd}
          isInShoppingList={false}
        />
      );

      const button = screen.getByRole('button', { name: /añadir butter a la lista de la compra/i });
      expect(button).toHaveAttribute('title', 'Añadir a lista de compra');
    });

    it('should show correct tooltip when disabled', () => {
      const handleAdd = vi.fn();
      render(
        <ProductListItem
          id="test-id-15"
          name="Cheese"
          quantity={1}
          unitType="units"
          onAddToShoppingList={handleAdd}
          isInShoppingList={true}
        />
      );

      const button = screen.getByRole('button', { name: /añadir cheese a la lista de la compra/i });
      expect(button).toHaveAttribute('title', 'Ya en lista');
    });

    it('should render ShoppingCart icon', () => {
      const handleAdd = vi.fn();
      render(
        <ProductListItem
          id="test-id-16"
          name="Juice"
          quantity={2}
          unitType="liters"
          onAddToShoppingList={handleAdd}
        />
      );

      const button = screen.getByRole('button', { name: /añadir juice a la lista de la compra/i });
      const svg = button.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });
});