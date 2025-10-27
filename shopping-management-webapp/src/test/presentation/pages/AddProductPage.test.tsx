import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AddProductPage } from '../../../presentation/pages/AddProductPage';

// Mock del useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('AddProductPage - Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Rendering', () => {
    it('should render the page title', () => {
      render(
        <MemoryRouter>
          <AddProductPage />
        </MemoryRouter>
      );

      expect(screen.getByText(/agregar nuevo producto/i)).toBeInTheDocument();
    });

    it('should render the ProductForm component', () => {
      render(
        <MemoryRouter>
          <AddProductPage />
        </MemoryRouter>
      );

      expect(screen.getByLabelText(/nombre del producto/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/cantidad inicial/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /agregar producto/i })).toBeInTheDocument();
    });

    it('should render a back button', () => {
      render(
        <MemoryRouter>
          <AddProductPage />
        </MemoryRouter>
      );

      expect(screen.getByText(/volver al catálogo/i)).toBeInTheDocument();
    });
  });

  describe('Adding a product successfully', () => {
    it('should save product to localStorage when form is submitted', async () => {
      render(
        <MemoryRouter>
          <AddProductPage />
        </MemoryRouter>
      );

      const nameInput = screen.getByLabelText(/nombre del producto/i);
      const quantityInput = screen.getByLabelText(/cantidad inicial/i);
      const submitButton = screen.getByRole('button', { name: /agregar producto/i });

      fireEvent.change(nameInput, { target: { value: 'Leche' } });
      fireEvent.change(quantityInput, { target: { value: '10' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        // Verify product was saved to localStorage
        const products = JSON.parse(localStorage.getItem('shopping_manager_products') || '[]');
        expect(products).toHaveLength(1);
        expect(products[0].name).toBe('Leche');
      });
    });

    it('should save inventory item to localStorage when form is submitted', async () => {
      render(
        <MemoryRouter>
          <AddProductPage />
        </MemoryRouter>
      );

      const nameInput = screen.getByLabelText(/nombre del producto/i);
      const quantityInput = screen.getByLabelText(/cantidad inicial/i);
      const submitButton = screen.getByRole('button', { name: /agregar producto/i });

      fireEvent.change(nameInput, { target: { value: 'Leche' } });
      fireEvent.change(quantityInput, { target: { value: '10' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        // Verify inventory was saved to localStorage
        const inventory = JSON.parse(localStorage.getItem('shopping_manager_inventory') || '[]');
        expect(inventory).toHaveLength(1);
        expect(inventory[0].currentStock).toBe(10);
      });
    });

    it('should show success message after adding product', async () => {
      render(
        <MemoryRouter>
          <AddProductPage />
        </MemoryRouter>
      );

      const nameInput = screen.getByLabelText(/nombre del producto/i);
      const quantityInput = screen.getByLabelText(/cantidad inicial/i);
      const submitButton = screen.getByRole('button', { name: /agregar producto/i });

      fireEvent.change(nameInput, { target: { value: 'Leche' } });
      fireEvent.change(quantityInput, { target: { value: '10' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/producto agregado exitosamente/i)).toBeInTheDocument();
      });
    });

    it('should navigate to catalog after successful submission', async () => {
      render(
        <MemoryRouter>
          <AddProductPage />
        </MemoryRouter>
      );

      const nameInput = screen.getByLabelText(/nombre del producto/i);
      const quantityInput = screen.getByLabelText(/cantidad inicial/i);
      const submitButton = screen.getByRole('button', { name: /agregar producto/i });

      fireEvent.change(nameInput, { target: { value: 'Leche' } });
      fireEvent.change(quantityInput, { target: { value: '10' } });
      fireEvent.click(submitButton);

      // Wait for success message and navigation (1500ms delay)
      await waitFor(
        () => {
          expect(mockNavigate).toHaveBeenCalledWith('/catalog');
        },
        { timeout: 2000 }
      );
    });
  });

  describe('Navigation', () => {
    it('should navigate back to catalog when clicking back button', () => {
      render(
        <MemoryRouter>
          <AddProductPage />
        </MemoryRouter>
      );

      const backButton = screen.getByText(/volver al catálogo/i);
      fireEvent.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith('/catalog');
    });
  });
});