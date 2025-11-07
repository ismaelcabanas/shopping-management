import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EditProductModal } from '../../../presentation/components/EditProductModal';
import type { Product } from '../../../domain/model/Product';
import { ProductId } from '../../../domain/model/ProductId';
import { UnitType } from '../../../domain/model/UnitType';

describe('EditProductModal', () => {
  const mockProduct: Product = {
    id: ProductId.fromString('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d'),
    name: 'Leche',
    unitType: UnitType.liters(),
  } as Product;

  describe('Modal visibility', () => {
    it('should not render when isOpen is false', () => {
      const onClose = vi.fn();
      const onSave = vi.fn();

      render(
        <EditProductModal
          product={mockProduct}
          isOpen={false}
          onClose={onClose}
          onSave={onSave}
        />
      );

      expect(screen.queryByText('Editar Producto')).not.toBeInTheDocument();
    });

    it('should render when isOpen is true', () => {
      const onClose = vi.fn();
      const onSave = vi.fn();

      render(
        <EditProductModal
          product={mockProduct}
          isOpen={true}
          onClose={onClose}
          onSave={onSave}
        />
      );

      expect(screen.getByText('Editar Producto')).toBeInTheDocument();
    });
  });

  describe('Form pre-population', () => {
    it('should pre-fill form with product data', () => {
      const onClose = vi.fn();
      const onSave = vi.fn();

      render(
        <EditProductModal
          product={mockProduct}
          isOpen={true}
          onClose={onClose}
          onSave={onSave}
        />
      );

      const nameInput = screen.getByLabelText(/nombre/i) as HTMLInputElement;
      const unitSelect = screen.getByLabelText(/unidad/i) as HTMLSelectElement;

      expect(nameInput.value).toBe('Leche');
      expect(unitSelect.value).toBe('liters');
    });
  });

  describe('Form editing', () => {
    it('should allow editing the product name', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      const onSave = vi.fn();

      render(
        <EditProductModal
          product={mockProduct}
          isOpen={true}
          onClose={onClose}
          onSave={onSave}
        />
      );

      const nameInput = screen.getByLabelText(/nombre/i);

      await user.clear(nameInput);
      await user.type(nameInput, 'Leche Desnatada');

      expect(nameInput).toHaveValue('Leche Desnatada');
    });

    it('should allow changing the unit type', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      const onSave = vi.fn();

      render(
        <EditProductModal
          product={mockProduct}
          isOpen={true}
          onClose={onClose}
          onSave={onSave}
        />
      );

      const unitSelect = screen.getByLabelText(/unidad/i);

      await user.selectOptions(unitSelect, 'kg');

      expect(unitSelect).toHaveValue('kg');
    });
  });

  describe('Form validation', () => {
    it('should show error when name is empty', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      const onSave = vi.fn();

      render(
        <EditProductModal
          product={mockProduct}
          isOpen={true}
          onClose={onClose}
          onSave={onSave}
        />
      );

      const nameInput = screen.getByLabelText(/nombre/i);
      const saveButton = screen.getByRole('button', { name: /guardar/i });

      await user.clear(nameInput);
      await user.click(saveButton);

      expect(await screen.findByText(/nombre no puede estar vacío/i)).toBeInTheDocument();
      expect(onSave).not.toHaveBeenCalled();
    });

    it('should show error when name is too short', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      const onSave = vi.fn();

      render(
        <EditProductModal
          product={mockProduct}
          isOpen={true}
          onClose={onClose}
          onSave={onSave}
        />
      );

      const nameInput = screen.getByLabelText(/nombre/i);
      const saveButton = screen.getByRole('button', { name: /guardar/i });

      await user.clear(nameInput);
      await user.type(nameInput, 'A');
      await user.click(saveButton);

      expect(await screen.findByText(/debe tener al menos 2 caracteres/i)).toBeInTheDocument();
      expect(onSave).not.toHaveBeenCalled();
    });
  });

  describe('Save functionality', () => {
    it('should call onSave with updated data when form is valid', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      const onSave = vi.fn().mockResolvedValue(undefined);

      render(
        <EditProductModal
          product={mockProduct}
          isOpen={true}
          onClose={onClose}
          onSave={onSave}
        />
      );

      const nameInput = screen.getByLabelText(/nombre/i);
      const unitSelect = screen.getByLabelText(/unidad/i);
      const saveButton = screen.getByRole('button', { name: /guardar/i });

      await user.clear(nameInput);
      await user.type(nameInput, 'Leche Desnatada');
      await user.selectOptions(unitSelect, 'kg');
      await user.click(saveButton);

      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith({
          id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
          name: 'Leche Desnatada',
          unitType: 'kg',
        });
      });
    });

    it('should close modal after successful save', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      const onSave = vi.fn().mockResolvedValue(undefined);

      render(
        <EditProductModal
          product={mockProduct}
          isOpen={true}
          onClose={onClose}
          onSave={onSave}
        />
      );

      const saveButton = screen.getByRole('button', { name: /guardar/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(onClose).toHaveBeenCalled();
      });
    });
  });

  describe('Cancel functionality', () => {
    it('should call onClose when cancel button is clicked', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      const onSave = vi.fn();

      render(
        <EditProductModal
          product={mockProduct}
          isOpen={true}
          onClose={onClose}
          onSave={onSave}
        />
      );

      const cancelButton = screen.getByRole('button', { name: /cancelar/i });
      await user.click(cancelButton);

      expect(onClose).toHaveBeenCalled();
      expect(onSave).not.toHaveBeenCalled();
    });

    it('should not save changes when modal is cancelled', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      const onSave = vi.fn();

      render(
        <EditProductModal
          product={mockProduct}
          isOpen={true}
          onClose={onClose}
          onSave={onSave}
        />
      );

      const nameInput = screen.getByLabelText(/nombre/i);
      await user.clear(nameInput);
      await user.type(nameInput, 'New Name');

      const cancelButton = screen.getByRole('button', { name: /cancelar/i });
      await user.click(cancelButton);

      expect(onSave).not.toHaveBeenCalled();
    });
  });

  describe('Error handling', () => {
    it('should display error message when save fails', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      const onSave = vi.fn().mockRejectedValue(new Error('Product name already exists'));

      render(
        <EditProductModal
          product={mockProduct}
          isOpen={true}
          onClose={onClose}
          onSave={onSave}
        />
      );

      const saveButton = screen.getByRole('button', { name: /guardar/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText(/Product name already exists/i)).toBeInTheDocument();
      });

      expect(onClose).not.toHaveBeenCalled();
    });

    it('should keep modal open when save fails', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      const onSave = vi.fn().mockRejectedValue(new Error('Save failed'));

      render(
        <EditProductModal
          product={mockProduct}
          isOpen={true}
          onClose={onClose}
          onSave={onSave}
        />
      );

      const saveButton = screen.getByRole('button', { name: /guardar/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText(/Save failed/i)).toBeInTheDocument();
      });

      expect(screen.getByText('Editar Producto')).toBeInTheDocument();
      expect(onClose).not.toHaveBeenCalled();
    });
  });
});
