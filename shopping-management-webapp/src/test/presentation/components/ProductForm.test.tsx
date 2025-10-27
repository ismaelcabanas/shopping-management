import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductForm } from '../../../presentation/components/ProductForm';

describe('ProductForm - Component Tests (TDD)', () => {
  describe('Rendering', () => {
    it('should render product name input', () => {
      render(<ProductForm onSubmit={vi.fn()} />);

      const nameInput = screen.getByLabelText(/nombre del producto/i);
      expect(nameInput).toBeInTheDocument();
      expect(nameInput).toHaveAttribute('type', 'text');
    });

    it('should render quantity input', () => {
      render(<ProductForm onSubmit={vi.fn()} />);

      const quantityInput = screen.getByLabelText(/cantidad inicial/i);
      expect(quantityInput).toBeInTheDocument();
      expect(quantityInput).toHaveAttribute('type', 'number');
    });

    it('should render unit type selector', () => {
      render(<ProductForm onSubmit={vi.fn()} />);

      const unitSelect = screen.getByLabelText(/unidad/i);
      expect(unitSelect).toBeInTheDocument();
    });

    it('should render submit button', () => {
      render(<ProductForm onSubmit={vi.fn()} />);

      const submitButton = screen.getByRole('button', { name: /agregar producto/i });
      expect(submitButton).toBeInTheDocument();
    });
  });

  describe('Validation - Product Name', () => {
    it('should show error when name is empty', () => {
      render(<ProductForm onSubmit={vi.fn()} />);

      const submitButton = screen.getByRole('button', { name: /agregar producto/i });

      // Try to submit with empty name
      fireEvent.click(submitButton);

      expect(screen.getByText(/el nombre no puede estar vacío/i)).toBeInTheDocument();
    });

    it('should show error when name is less than 2 characters', () => {
      render(<ProductForm onSubmit={vi.fn()} />);

      const nameInput = screen.getByLabelText(/nombre del producto/i);
      const submitButton = screen.getByRole('button', { name: /agregar producto/i });

      fireEvent.change(nameInput, { target: { value: 'L' } });
      fireEvent.click(submitButton);

      expect(screen.getByText(/el nombre debe tener al menos 2 caracteres/i)).toBeInTheDocument();
    });

    it('should NOT show error when name is valid', () => {
      render(<ProductForm onSubmit={vi.fn()} />);

      const nameInput = screen.getByLabelText(/nombre del producto/i);

      fireEvent.change(nameInput, { target: { value: 'Leche' } });

      expect(screen.queryByText(/el nombre no puede estar vacío/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/el nombre debe tener al menos 2 caracteres/i)).not.toBeInTheDocument();
    });
  });

  describe('Validation - Quantity', () => {
    it('should accept zero as valid quantity', () => {
      const onSubmit = vi.fn();
      render(<ProductForm onSubmit={onSubmit} />);

      const nameInput = screen.getByLabelText(/nombre del producto/i);
      const quantityInput = screen.getByLabelText(/cantidad inicial/i);
      const submitButton = screen.getByRole('button', { name: /agregar producto/i });

      fireEvent.change(nameInput, { target: { value: 'Leche' } });
      fireEvent.change(quantityInput, { target: { value: '0' } });
      fireEvent.click(submitButton);

      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    it('should reject negative quantities', async () => {
      const onSubmit = vi.fn();
      render(<ProductForm onSubmit={onSubmit} />);

      const nameInput = screen.getByLabelText(/nombre del producto/i);
      const quantityInput = screen.getByLabelText(/cantidad inicial/i);
      const submitButton = screen.getByRole('button', { name: /agregar producto/i });

      fireEvent.change(nameInput, { target: { value: 'Leche' } });
      fireEvent.change(quantityInput, { target: { value: '-5' } });
      fireEvent.click(submitButton);

      // Should show error message (wait for state update)
      await waitFor(() => {
        expect(screen.getByText(/la cantidad no puede ser negativa/i)).toBeInTheDocument();
      });
      // Should NOT call onSubmit
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Form Submission', () => {
    it('should call onSubmit with correct data when form is valid', () => {
      const onSubmit = vi.fn();
      render(<ProductForm onSubmit={onSubmit} />);

      const nameInput = screen.getByLabelText(/nombre del producto/i);
      const quantityInput = screen.getByLabelText(/cantidad inicial/i);
      const submitButton = screen.getByRole('button', { name: /agregar producto/i });

      fireEvent.change(nameInput, { target: { value: 'Leche' } });
      fireEvent.change(quantityInput, { target: { value: '10' } });
      fireEvent.click(submitButton);

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Leche',
        quantity: 10,
        unitType: 'units',
      });
    });

    it('should NOT call onSubmit when name is invalid', () => {
      const onSubmit = vi.fn();
      render(<ProductForm onSubmit={onSubmit} />);

      const nameInput = screen.getByLabelText(/nombre del producto/i);
      const quantityInput = screen.getByLabelText(/cantidad inicial/i);
      const submitButton = screen.getByRole('button', { name: /agregar producto/i });

      fireEvent.change(nameInput, { target: { value: 'L' } });
      fireEvent.change(quantityInput, { target: { value: '10' } });
      fireEvent.click(submitButton);

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('should clear the form after successful submission', () => {
      const onSubmit = vi.fn();
      render(<ProductForm onSubmit={onSubmit} />);

      const nameInput = screen.getByLabelText(/nombre del producto/i) as HTMLInputElement;
      const quantityInput = screen.getByLabelText(/cantidad inicial/i) as HTMLInputElement;
      const submitButton = screen.getByRole('button', { name: /agregar producto/i });

      fireEvent.change(nameInput, { target: { value: 'Leche' } });
      fireEvent.change(quantityInput, { target: { value: '10' } });
      fireEvent.click(submitButton);

      expect(nameInput.value).toBe('');
      expect(quantityInput.value).toBe('');
    });
  });

  describe('Unit Type Selector', () => {
    it('should have "units" as the only available option', () => {
      render(<ProductForm onSubmit={vi.fn()} />);

      const unitSelect = screen.getByLabelText(/unidad/i) as HTMLSelectElement;
      const options = Array.from(unitSelect.options).map(opt => opt.value);

      expect(options).toEqual(['units']);
    });

    it('should have "units" selected by default', () => {
      render(<ProductForm onSubmit={vi.fn()} />);

      const unitSelect = screen.getByLabelText(/unidad/i) as HTMLSelectElement;

      expect(unitSelect.value).toBe('units');
    });
  });

  describe('Mobile-First Design', () => {
    it('should have minimum font size of 16px on inputs to prevent zoom on mobile', () => {
      render(<ProductForm onSubmit={vi.fn()} />);

      const nameInput = screen.getByLabelText(/nombre del producto/i);
      const computedStyle = window.getComputedStyle(nameInput);

      const fontSize = parseInt(computedStyle.fontSize);
      expect(fontSize).toBeGreaterThanOrEqual(16);
    });

    it('should have touch-friendly button with min-height style (44px)', () => {
      render(<ProductForm onSubmit={vi.fn()} />);

      const submitButton = screen.getByRole('button', { name: /agregar producto/i });

      // Check inline style instead of computed style (jsdom limitation)
      const minHeight = submitButton.style.minHeight;
      expect(minHeight).toBe('44px');
    });
  });
});