import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ProductCatalogPage } from '../../../presentation/pages/ProductCatalogPage';

// Mock de react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock SOLO del use case - Los repositorios son un detalle de implementación
const mockExecute = vi.fn();
vi.mock('../../../application/use-cases/GetProductsWithInventory', () => ({
  GetProductsWithInventory: vi.fn().mockImplementation(() => ({
    execute: mockExecute,
  })),
}));

// Helper para renderizar con router
function renderWithRouter(component: React.ReactElement) {
  return render(<BrowserRouter>{component}</BrowserRouter>);
}

describe('ProductCatalogPage - Component Tests (TDD)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Por defecto, retornar array vacío
    mockExecute.mockResolvedValue([]);
  });

  it('should render page title', () => {
    renderWithRouter(<ProductCatalogPage />);

    expect(screen.getByText('Mi Despensa')).toBeInTheDocument();
  });

  it('should display ProductList component', () => {
    renderWithRouter(<ProductCatalogPage />);

    // Check for empty state or product list container
    expect(
      screen.getByTestId('product-list-container') || screen.getByTestId('empty-state')
    ).toBeTruthy();
  });

  it('should display FAB button for adding products', () => {
    renderWithRouter(<ProductCatalogPage />);

    const fab = screen.getByTestId('fab-add-product');
    expect(fab).toBeInTheDocument();
  });

  it('FAB button should be touch-friendly (56x56px minimum)', () => {
    renderWithRouter(<ProductCatalogPage />);

    const fab = screen.getByTestId('fab-add-product');
    const styles = window.getComputedStyle(fab);
    const minHeight = parseInt(styles.minHeight, 10);
    const minWidth = parseInt(styles.minWidth, 10);

    expect(minHeight).toBeGreaterThanOrEqual(56);
    expect(minWidth).toBeGreaterThanOrEqual(56);
  });

  it('should navigate to add product page when FAB is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ProductCatalogPage />);

    const fab = screen.getByTestId('fab-add-product');
    await user.click(fab);

    expect(mockNavigate).toHaveBeenCalledWith('/catalog/add');
  });

  it('should display loading state initially', async () => {
    renderWithRouter(<ProductCatalogPage />);

    // Should show skeleton loaders initially
    const skeletons = screen.queryAllByTestId('skeleton-loader');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should display empty state when no products exist', async () => {
    // Mock retorna array vacío
    mockExecute.mockResolvedValue([]);

    renderWithRouter(<ProductCatalogPage />);

    await waitFor(() => {
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });
  });

  it('should display product count when products exist', async () => {
    // Mock retorna 2 productos
    mockExecute.mockResolvedValue([
      { id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', name: 'Leche', quantity: 2, unitType: 'units' },
      { id: 'b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e', name: 'Pan', quantity: 3, unitType: 'units' },
    ]);

    renderWithRouter(<ProductCatalogPage />);

    await waitFor(() => {
      expect(screen.getByText(/productos en despensa \(2\)/i)).toBeInTheDocument();
    });
  });

  it('should display products from repository', async () => {
    // Mock retorna productos específicos
    mockExecute.mockResolvedValue([
      { id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', name: 'Leche', quantity: 2, unitType: 'units' },
      { id: 'b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e', name: 'Pan', quantity: 3, unitType: 'units' },
    ]);

    renderWithRouter(<ProductCatalogPage />);

    await waitFor(() => {
      expect(screen.getByText('Leche')).toBeInTheDocument();
      expect(screen.getByText('Pan')).toBeInTheDocument();
    });
  });

  it('should have back button', () => {
    renderWithRouter(<ProductCatalogPage />);

    expect(screen.getByTestId('back-button')).toBeInTheDocument();
  });

  it('should navigate back when back button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ProductCatalogPage />);

    const backButton = screen.getByTestId('back-button');
    await user.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('should call GetProductsWithInventory use case on mount', async () => {
    mockExecute.mockResolvedValue([]);

    renderWithRouter(<ProductCatalogPage />);

    await waitFor(() => {
      expect(mockExecute).toHaveBeenCalledTimes(1);
    });
  });

  it('should display products sorted alphabetically', async () => {
    // Mock retorna productos ordenados alfabéticamente
    mockExecute.mockResolvedValue([
      { id: '1', name: 'Azúcar', quantity: 10, unitType: 'units' },
      { id: '2', name: 'Leche', quantity: 2, unitType: 'units' },
      { id: '3', name: 'Pan', quantity: 3, unitType: 'units' },
    ]);

    renderWithRouter(<ProductCatalogPage />);

    await waitFor(() => {
      const items = screen.getAllByTestId('product-list-item');
      expect(items).toHaveLength(3);
    });

    // Verificar que los productos aparecen en orden alfabético
    const productNames = screen.getAllByTestId('product-list-item-name');
    expect(productNames[0]).toHaveTextContent('Azúcar');
    expect(productNames[1]).toHaveTextContent('Leche');
    expect(productNames[2]).toHaveTextContent('Pan');
  });
});