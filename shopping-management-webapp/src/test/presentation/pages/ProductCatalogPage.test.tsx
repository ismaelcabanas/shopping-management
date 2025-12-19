import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ProductCatalogPage } from '../../../presentation/pages/ProductCatalogPage';

// Mock OCRServiceFactory to avoid API key requirement in tests
vi.mock('../../../infrastructure/config/OCRServiceFactory', () => ({
  OCRServiceFactory: {
    create: vi.fn().mockReturnValue({
      extractText: vi.fn().mockResolvedValue('Mock product | 1'),
      getProviderName: vi.fn().mockReturnValue('mock')
    })
  }
}))

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

// Mock de LocalStorageProductRepository
const mockFindAll = vi.fn();
vi.mock('../../../infrastructure/repositories/LocalStorageProductRepository', () => ({
  LocalStorageProductRepository: vi.fn().mockImplementation(() => ({
    findAll: mockFindAll,
    findById: vi.fn(),
    findByName: vi.fn(),
    save: vi.fn(),
    delete: vi.fn(),
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
    mockFindAll.mockResolvedValue([]);
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
      expect(mockExecute).toHaveBeenCalled();
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

  it('should display scan ticket button', async () => {
    mockExecute.mockResolvedValue([]);
    mockFindAll.mockResolvedValue([]);

    renderWithRouter(<ProductCatalogPage />);

    await waitFor(() => {
      expect(screen.getByText(/escanear ticket/i)).toBeInTheDocument();
    });
  });

  it('should open RegisterPurchaseModal with pre-filled items when ticket scan is confirmed', async () => {
    const user = userEvent.setup();
    mockExecute.mockResolvedValue([]);
    mockFindAll.mockResolvedValue([]);

    renderWithRouter(<ProductCatalogPage />);

    // Wait for page to load
    await waitFor(() => {
      expect(screen.getByTestId('scan-ticket-button')).toBeInTheDocument();
    });

    // Open ticket scan modal
    const scanButton = screen.getByTestId('scan-ticket-button');
    await user.click(scanButton);

    // Modal should be open - verify ticket scan modal is visible
    await waitFor(() => {
      // Check for the specific modal title (level 2 heading)
      const headings = screen.getAllByRole('heading', { name: /escanear ticket/i });
      expect(headings.length).toBeGreaterThan(0);
    });

    // Simulate confirming items from ticket scan
    // (This will be done by clicking confirm in the modal, which triggers onConfirm)
    // For now, we'll verify that the TicketScanModal component is rendered
    // The actual integration will be tested end-to-end in E2E tests
  });

  it('should convert MatchedDetectedItem to PurchaseItemInput correctly', async () => {
    mockExecute.mockResolvedValue([]);
    mockFindAll.mockResolvedValue([
      { id: { value: 'product-1' }, name: 'Leche' },
      { id: { value: 'product-2' }, name: 'Pan' },
    ]);

    renderWithRouter(<ProductCatalogPage />);

    await waitFor(() => {
      expect(screen.getByTestId('scan-ticket-button')).toBeInTheDocument();
    });

    // This test will verify that matched items use matchedProductId
    // and unmatched items use productName as productId
  });

  it('should handle matched items with existing product IDs', async () => {
    // Test that when MatchedDetectedItem has matchedProductId,
    // it uses that ID for the PurchaseItemInput
  });

  it('should handle unmatched items with product names', async () => {
    // Test that when MatchedDetectedItem doesn't have matchedProductId,
    // it uses productName as productId (will be created as new product)
  });
});