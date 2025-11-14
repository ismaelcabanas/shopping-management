import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RegisterPurchaseModal } from '../../../presentation/components/RegisterPurchaseModal';
import { Product } from '../../../domain/model/Product';
import { ProductId } from '../../../domain/model/ProductId';
import { UnitType } from '../../../domain/model/UnitType';

describe('RegisterPurchaseModal', () => {
  const mockProducts = [
    new Product(
      ProductId.fromString('00000000-0000-0000-0000-000000000001'),
      'Leche',
      UnitType.units()
    ),
    new Product(
      ProductId.fromString('00000000-0000-0000-0000-000000000002'),
      'Pan',
      UnitType.units()
    ),
  ];

  let mockOnSave: ReturnType<typeof vi.fn>;
  let mockOnCancel: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnSave = vi.fn().mockResolvedValue(undefined);
    mockOnCancel = vi.fn();
  });

  it('should not render when isOpen is false', () => {
    render(
      <RegisterPurchaseModal
        isOpen={false}
        products={mockProducts}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.queryByText('Registrar Compra')).not.toBeInTheDocument();
  });

  it('should render modal when isOpen is true', () => {
    render(
      <RegisterPurchaseModal
        isOpen={true}
        products={mockProducts}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Registrar Compra')).toBeInTheDocument();
  });

  it('should show product input and quantity input', () => {
    render(
      <RegisterPurchaseModal
        isOpen={true}
        products={mockProducts}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByTestId('product-input')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Cantidad')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /añadir/i })).toBeInTheDocument();
  });

  it('should add product to purchase list', async () => {
    render(
      <RegisterPurchaseModal
        isOpen={true}
        products={mockProducts}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    const productInput = screen.getByTestId('product-input');
    const quantityInput = screen.getByPlaceholderText('Cantidad');
    const addButton = screen.getByRole('button', { name: /añadir/i });

    // Select product
    fireEvent.change(productInput, { target: { value: 'Leche' } });

    // Enter quantity
    fireEvent.change(quantityInput, { target: { value: '5' } });

    // Add product
    fireEvent.click(addButton);

    // Product should appear in the list
    await waitFor(() => {
      expect(screen.getByText(/Leche - 5/)).toBeInTheDocument();
    });
  });

  it('should allow adding multiple products', async () => {
    render(
      <RegisterPurchaseModal
        isOpen={true}
        products={mockProducts}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    const productInput = screen.getByTestId('product-input');
    const quantityInput = screen.getByPlaceholderText('Cantidad');
    const addButton = screen.getByRole('button', { name: /añadir/i });

    // Add first product
    fireEvent.change(productInput, { target: { value: 'Leche' } });
    fireEvent.change(quantityInput, { target: { value: '5' } });
    fireEvent.click(addButton);

    // Add second product
    await waitFor(() => {
      fireEvent.change(productInput, { target: { value: 'Pan' } });
    });
    fireEvent.change(quantityInput, { target: { value: '3' } });
    fireEvent.click(addButton);

    // Both products should appear
    await waitFor(() => {
      expect(screen.getByText(/Leche - 5/)).toBeInTheDocument();
      expect(screen.getByText(/Pan - 3/)).toBeInTheDocument();
    });
  });

  it('should disable save button when no products added', () => {
    render(
      <RegisterPurchaseModal
        isOpen={true}
        products={mockProducts}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    const saveButton = screen.getByRole('button', { name: /guardar compra/i });
    expect(saveButton).toBeDisabled();
  });

  it('should enable save button when products are added', async () => {
    render(
      <RegisterPurchaseModal
        isOpen={true}
        products={mockProducts}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    const productInput = screen.getByTestId('product-input');
    const quantityInput = screen.getByPlaceholderText('Cantidad');
    const addButton = screen.getByRole('button', { name: /añadir/i });

    fireEvent.change(productInput, { target: { value: 'Leche' } });
    fireEvent.change(quantityInput, { target: { value: '5' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      const saveButton = screen.getByRole('button', { name: /guardar compra/i });
      expect(saveButton).not.toBeDisabled();
    });
  });

  it('should validate quantity is greater than 0', async () => {
    render(
      <RegisterPurchaseModal
        isOpen={true}
        products={mockProducts}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    const productInput = screen.getByTestId('product-input');
    const quantityInput = screen.getByPlaceholderText('Cantidad');
    const addButton = screen.getByRole('button', { name: /añadir/i });

    fireEvent.change(productInput, { target: { value: 'Leche' } });
    fireEvent.change(quantityInput, { target: { value: '0' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText(/cantidad debe ser mayor a 0/i)).toBeInTheDocument();
    });

    expect(screen.queryByText(/Leche - 5/)).not.toBeInTheDocument();
  });

  it('should call onSave when save button is clicked', async () => {
    render(
      <RegisterPurchaseModal
        isOpen={true}
        products={mockProducts}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    const productInput = screen.getByTestId('product-input');
    const quantityInput = screen.getByPlaceholderText('Cantidad');
    const addButton = screen.getByRole('button', { name: /añadir/i });

    fireEvent.change(productInput, { target: { value: 'Leche' } });
    fireEvent.change(quantityInput, { target: { value: '5' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      const saveButton = screen.getByRole('button', { name: /guardar compra/i });
      fireEvent.click(saveButton);
    });

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith([
        {
          productId: '00000000-0000-0000-0000-000000000001',
          quantity: 5,
        },
      ]);
    });
  });

  it('should call onCancel when cancel button is clicked', () => {
    render(
      <RegisterPurchaseModal
        isOpen={true}
        products={mockProducts}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('should remove product from list when remove button is clicked', async () => {
    render(
      <RegisterPurchaseModal
        isOpen={true}
        products={mockProducts}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    const productInput = screen.getByTestId('product-input');
    const quantityInput = screen.getByPlaceholderText('Cantidad');
    const addButton = screen.getByRole('button', { name: /añadir/i });

    fireEvent.change(productInput, { target: { value: 'Leche' } });
    fireEvent.change(quantityInput, { target: { value: '5' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText(/Leche - 5/)).toBeInTheDocument();
    });

    const removeButton = screen.getByRole('button', { name: /eliminar/i });
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(screen.queryByText(/Leche - 5/)).not.toBeInTheDocument();
    });
  });
});
