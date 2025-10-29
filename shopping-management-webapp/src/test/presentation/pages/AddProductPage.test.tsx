import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AddProductPage } from '../../../presentation/pages/AddProductPage';
import toast from 'react-hot-toast';

// Mock de react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock de react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock SOLO del use case - Los repositorios son un detalle de implementación
const mockExecute = vi.fn();
vi.mock('../../../application/use-cases/AddProductToInventory', () => ({
  AddProductToInventory: vi.fn().mockImplementation(() => ({
    execute: mockExecute,
  })),
}));

// Helper para renderizar con router
function renderWithRouter(component: React.ReactElement) {
  return render(<BrowserRouter>{component}</BrowserRouter>);
}

describe('AddProductPage - Component Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Por defecto, el use case se ejecuta exitosamente
    mockExecute.mockResolvedValue(undefined);
  });

  describe('Rendering', () => {
    it('should render the page title', () => {
      renderWithRouter(<AddProductPage />);

      expect(screen.getByText(/agregar nuevo producto/i)).toBeInTheDocument();
    });

    it('should render the ProductForm component', () => {
      renderWithRouter(<AddProductPage />);

      expect(screen.getByLabelText(/nombre del producto/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/cantidad inicial/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /agregar producto/i })).toBeInTheDocument();
    });

    it('should render a back button', () => {
      renderWithRouter(<AddProductPage />);

      expect(screen.getByText(/volver al catálogo/i)).toBeInTheDocument();
    });
  });

  describe('Form Submission - Use Case Interaction', () => {
    it('should call AddProductToInventory use case when form is submitted', async () => {
      mockExecute.mockResolvedValue(undefined);

      renderWithRouter(<AddProductPage />);

      const nameInput = screen.getByLabelText(/nombre del producto/i);
      const quantityInput = screen.getByLabelText(/cantidad inicial/i);
      const submitButton = screen.getByRole('button', { name: /agregar producto/i });

      fireEvent.change(nameInput, { target: { value: 'Leche' } });
      fireEvent.change(quantityInput, { target: { value: '10' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockExecute).toHaveBeenCalledWith({
          id: expect.any(String), // UUID generado
          name: 'Leche',
          initialQuantity: 10,
        });
      });
    });

    it('should call use case with correct data types', async () => {
      mockExecute.mockResolvedValue(undefined);

      renderWithRouter(<AddProductPage />);

      const nameInput = screen.getByLabelText(/nombre del producto/i);
      const quantityInput = screen.getByLabelText(/cantidad inicial/i);
      const submitButton = screen.getByRole('button', { name: /agregar producto/i });

      fireEvent.change(nameInput, { target: { value: 'Pan' } });
      fireEvent.change(quantityInput, { target: { value: '5' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const callArgs = mockExecute.mock.calls[0][0];
        expect(typeof callArgs.id).toBe('string');
        expect(typeof callArgs.name).toBe('string');
        expect(typeof callArgs.initialQuantity).toBe('number');
        expect(callArgs.initialQuantity).toBe(5); // Número, no string
      });
    });
  });

  describe('Success State', () => {
    it('should show success toast after successful submission', async () => {
      mockExecute.mockResolvedValue(undefined);

      renderWithRouter(<AddProductPage />);

      const nameInput = screen.getByLabelText(/nombre del producto/i);
      const quantityInput = screen.getByLabelText(/cantidad inicial/i);
      const submitButton = screen.getByRole('button', { name: /agregar producto/i });

      fireEvent.change(nameInput, { target: { value: 'Leche' } });
      fireEvent.change(quantityInput, { target: { value: '10' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Producto agregado exitosamente');
      });
    });

    it('should navigate immediately after successful submission', async () => {
      mockExecute.mockResolvedValue(undefined);

      renderWithRouter(<AddProductPage />);

      const nameInput = screen.getByLabelText(/nombre del producto/i);
      const quantityInput = screen.getByLabelText(/cantidad inicial/i);
      const submitButton = screen.getByRole('button', { name: /agregar producto/i });

      fireEvent.change(nameInput, { target: { value: 'Leche' } });
      fireEvent.change(quantityInput, { target: { value: '10' } });
      fireEvent.click(submitButton);

      // Navigate happens immediately (no delay)
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/catalog');
      });
    });
  });

  describe('Error Handling', () => {
    it('should show error toast when use case throws error', async () => {
      mockExecute.mockRejectedValue(new Error('Error al guardar'));

      renderWithRouter(<AddProductPage />);

      const nameInput = screen.getByLabelText(/nombre del producto/i);
      const quantityInput = screen.getByLabelText(/cantidad inicial/i);
      const submitButton = screen.getByRole('button', { name: /agregar producto/i });

      fireEvent.change(nameInput, { target: { value: 'Leche' } });
      fireEvent.change(quantityInput, { target: { value: '10' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Error al guardar');
      });
    });

    it('should show specific error toast for duplicate product', async () => {
      mockExecute.mockRejectedValue(new Error('Product already exists'));

      renderWithRouter(<AddProductPage />);

      const nameInput = screen.getByLabelText(/nombre del producto/i);
      const quantityInput = screen.getByLabelText(/cantidad inicial/i);
      const submitButton = screen.getByRole('button', { name: /agregar producto/i });

      fireEvent.change(nameInput, { target: { value: 'Leche' } });
      fireEvent.change(quantityInput, { target: { value: '10' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Ya existe un producto con ese nombre');
      });
    });

    it('should show generic error toast for unknown errors', async () => {
      mockExecute.mockRejectedValue('Unknown error');

      renderWithRouter(<AddProductPage />);

      const nameInput = screen.getByLabelText(/nombre del producto/i);
      const quantityInput = screen.getByLabelText(/cantidad inicial/i);
      const submitButton = screen.getByRole('button', { name: /agregar producto/i });

      fireEvent.change(nameInput, { target: { value: 'Leche' } });
      fireEvent.change(quantityInput, { target: { value: '10' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Error al agregar el producto');
      });
    });

    it('should not navigate to catalog when submission fails', async () => {
      mockExecute.mockRejectedValue(new Error('Error al guardar'));

      renderWithRouter(<AddProductPage />);

      const nameInput = screen.getByLabelText(/nombre del producto/i);
      const quantityInput = screen.getByLabelText(/cantidad inicial/i);
      const submitButton = screen.getByRole('button', { name: /agregar producto/i });

      fireEvent.change(nameInput, { target: { value: 'Leche' } });
      fireEvent.change(quantityInput, { target: { value: '10' } });
      fireEvent.click(submitButton);

      // Wait for error toast
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
      });

      // Verify navigation was NOT called
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('Navigation', () => {
    it('should navigate back to catalog when clicking back button', () => {
      renderWithRouter(<AddProductPage />);

      const backButton = screen.getByText(/volver al catálogo/i);
      fireEvent.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith('/catalog');
    });
  });
});