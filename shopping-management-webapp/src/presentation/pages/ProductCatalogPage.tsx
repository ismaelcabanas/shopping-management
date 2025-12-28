import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Plus, ClipboardList, ShoppingCart, Camera } from 'lucide-react';
import { ProductList, type ProductWithInventory } from '../components/ProductList';
import { EditProductModal } from '../components/EditProductModal';
import { RegisterPurchaseModal } from '../components/RegisterPurchaseModal';
import { TicketScanModal } from '../components/TicketScanModal';
import { UpdateStockModal } from '../components/UpdateStockModal';
import { ConfirmDialog } from '../shared/components/ConfirmDialog';
import { Alert } from '../shared/components/Alert';
import { GetProductsWithInventory } from '../../application/use-cases/GetProductsWithInventory';
import { LocalStorageProductRepository } from '../../infrastructure/repositories/LocalStorageProductRepository';
import { LocalStorageInventoryRepository } from '../../infrastructure/repositories/LocalStorageInventoryRepository';
import { OCRServiceFactory } from '../../infrastructure/config/OCRServiceFactory';
import { useProducts } from '../hooks/useProducts';
import { useInventory } from '../hooks/useInventory';
import { useStockLevel } from '../hooks/useStockLevel';
import { useShoppingList } from '../hooks/useShoppingList';
import { Button } from '../shared/components/Button';
import { ProductId } from '../../domain/model/ProductId';
import { StockLevel } from '../../domain/model/StockLevel';
import type { Product } from '../../domain/model/Product';
import type { PurchaseItemInput } from '../../application/use-cases/RegisterPurchase';
import type { MatchedDetectedItem } from '../../application/dtos/TicketScanResult';

export function ProductCatalogPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductWithInventory[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRegisterPurchaseOpen, setIsRegisterPurchaseOpen] = useState(false);
  const [isTicketScanOpen, setIsTicketScanOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [initialPurchaseItems, setInitialPurchaseItems] = useState<PurchaseItemInput[] | undefined>(undefined);
  const [isUpdateStockModalOpen, setIsUpdateStockModalOpen] = useState(false);
  const [productToUpdateStock, setProductToUpdateStock] = useState<{ product: Product; currentLevel: StockLevel } | null>(null);
  const [showOCRWarning, setShowOCRWarning] = useState(false);
  const [ocrWarningMessage, setOcrWarningMessage] = useState('');

  const { updateProduct, deleteProduct } = useProducts();
  const { addProduct, registerPurchase } = useInventory();
  const { updateStockLevel } = useStockLevel();
  const { items: shoppingListItems, addManual } = useShoppingList();

  // Create a Set of product IDs that are in the shopping list for O(1) lookups
  const productsInShoppingList = useMemo(() => {
    return new Set(shoppingListItems.map(item => item.productId.value));
  }, [shoppingListItems]);

  // Lazy initialization of OCR service (only when ticket scan is opened)
  // This prevents errors when API key is missing on page load
  // Note: Error handling is done via the persistent Alert component, not toast
  const getOCRService = () => {
    try {
      return OCRServiceFactory.create();
    } catch (error) {
      console.error('Failed to initialize OCR service:', error);
      return null;
    }
  };

  const productRepository = new LocalStorageProductRepository();

  // Check OCR configuration on mount
  useEffect(() => {
    try {
      OCRServiceFactory.create();
      setShowOCRWarning(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error de configuración OCR';
      setOcrWarningMessage(message);
      setShowOCRWarning(true);
    }
  }, []);

  useEffect(() => {
    loadProducts();
    loadAllProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);

      // Initialize repositories and use case
      const productRepository = new LocalStorageProductRepository();
      const inventoryRepository = new LocalStorageInventoryRepository();
      const getProductsWithInventory = new GetProductsWithInventory(
        productRepository,
        inventoryRepository
      );

      // Execute use case - single point of entry
      const productsWithInventory = await getProductsWithInventory.execute();

      setProducts(productsWithInventory);
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAllProducts = async () => {
    try {
      const productRepository = new LocalStorageProductRepository();
      const prods = await productRepository.findAll();
      setAllProducts(prods);
    } catch (error) {
      console.error('Error loading all products:', error);
      setAllProducts([]);
    }
  };

  const handleAddProduct = () => {
    navigate('/catalog/add');
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleEditProduct = async (product: Product) => {
    setProductToEdit(product);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setProductToEdit(null);
  };

  const handleSaveProduct = async (command: { id: string; name: string; unitType: string }) => {
    await updateProduct(command);
    await loadProducts(); // Refresh the list
  };

  const handleDeleteProduct = (productId: string) => {
    // Find product name for confirmation dialog
    const product = products.find(p => p.id === productId);
    const productName = product?.name || 'este producto';

    setProductToDelete({ id: productId, name: productName });
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      setIsDeleting(true);
      await deleteProduct(productToDelete.id);
      await loadProducts(); // Refresh the list
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
      toast.success(`Producto "${productToDelete.name}" eliminado correctamente`);
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Error al eliminar el producto. Por favor, intenta de nuevo.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleRegisterPurchase = () => {
    setInitialPurchaseItems(undefined); // Clear any previous initial items
    setIsRegisterPurchaseOpen(true);
  };

  const handleCloseRegisterPurchase = () => {
    setIsRegisterPurchaseOpen(false);
    setInitialPurchaseItems(undefined); // Clear initial items when closing
  };

  const handleTicketScanConfirm = (items: MatchedDetectedItem[]) => {
    // Convert MatchedDetectedItem[] to PurchaseItemInput[]
    const purchaseItems: PurchaseItemInput[] = items.map(item => ({
      // Use matchedProductId if available, otherwise use productName as ID
      productId: item.matchedProductId || item.productName,
      quantity: item.quantity,
    }));

    // Close ticket scan modal
    setIsTicketScanOpen(false);

    // Open register purchase modal with pre-filled items
    setInitialPurchaseItems(purchaseItems);
    setIsRegisterPurchaseOpen(true);
  };

  const handleSaveRegisterPurchase = async (items: PurchaseItemInput[]) => {
    try {
      // First, create any new products that don't exist
      for (const item of items) {
        // Check if product ID looks like a UUID (existing product) or a name (new product)
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(item.productId);

        if (!isUUID) {
          // It's a new product - create it
          const productName = item.productId; // In this case, productId is actually the product name

          // Generate a new ID for the product
          const newProductId = crypto.randomUUID();

          await addProduct({
            id: newProductId,
            name: productName,
            initialQuantity: 0, // Initial inventory will be set by RegisterPurchase
          });

          // Update the item with the new product's ID
          item.productId = newProductId;
        }
      }

      // Now register the purchase with all valid product IDs
      await registerPurchase(items);
      await loadProducts(); // Refresh the list
      setIsRegisterPurchaseOpen(false);
      toast.success('Compra registrada exitosamente');
    } catch (error) {
      console.error('Error registering purchase:', error);
      throw error; // Let the modal handle the error
    }
  };

  const handleUpdateStockLevel = (productId: string) => {
    // Find the product
    const productWithInventory = products.find(p => p.id === productId);
    const fullProduct = allProducts.find(p => p.id.value === productId);

    if (!productWithInventory || !fullProduct) {
      toast.error('Producto no encontrado');
      return;
    }

    const currentLevel = productWithInventory.stockLevel || StockLevel.create('high');

    setProductToUpdateStock({
      product: fullProduct,
      currentLevel
    });
    setIsUpdateStockModalOpen(true);
  };

  const handleCloseUpdateStockModal = () => {
    setIsUpdateStockModalOpen(false);
    setProductToUpdateStock(null);
  };

  const handleSaveStockLevel = async (newLevel: StockLevel) => {
    if (!productToUpdateStock) return;

    try {
      const productId = ProductId.fromString(productToUpdateStock.product.id.value);
      await updateStockLevel(productId, newLevel);
      await loadProducts(); // Refresh the list
      setIsUpdateStockModalOpen(false);
      setProductToUpdateStock(null);
      toast.success('Nivel de stock actualizado correctamente');
    } catch (error) {
      console.error('Error updating stock level:', error);
      toast.error('Error al actualizar el nivel de stock. Por favor, intenta de nuevo.');
    }
  };

  const handleAddToShoppingList = async (productId: string) => {
    try {
      await addManual(productId);
      toast.success('Producto añadido a la lista de la compra');
    } catch (error) {
      console.error('Error adding product to shopping list:', error);

      // Handle specific error messages
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage === 'Product already in shopping list') {
        toast('Este producto ya está en tu lista de la compra', { icon: 'ℹ️' });
      } else if (errorMessage === 'Product not found') {
        toast.error('Producto no encontrado');
      } else {
        toast.error('Error al añadir a la lista. Por favor, intenta de nuevo.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            <Button
              data-testid="back-button"
              onClick={handleBack}
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Mi Despensa</h1>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* OCR Configuration Warning */}
      {showOCRWarning && (
        <div className="max-w-2xl mx-auto px-4 pt-4">
          <Alert
            variant="warning"
            title="Configuración OCR incompleta"
            closable
            onClose={() => setShowOCRWarning(false)}
          >
            {ocrWarningMessage}. La función de escanear tickets no estará disponible hasta que se configure correctamente.
          </Alert>
        </div>
      )}

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header with product count and Register Purchase button */}
        {!isLoading && (
          <div className="mb-4 flex items-center justify-between">
            {products.length > 0 ? (
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-gray-700">
                  Productos en Despensa ({products.length})
                </h2>
              </div>
            ) : (
              <div />
            )}

            <div className="flex gap-2">
              <Button
                data-testid="scan-ticket-button"
                onClick={() => setIsTicketScanOpen(true)}
                variant="secondary"
                size="sm"
                className="flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                Escanear Ticket
              </Button>
              <Button
                data-testid="register-purchase-button"
                onClick={handleRegisterPurchase}
                variant="primary"
                size="sm"
                className="flex items-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Registrar Compra
              </Button>
            </div>
          </div>
        )}

        {/* Product List */}
        <ProductList
          products={products}
          isLoading={isLoading}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProduct}
          onUpdateStockLevel={handleUpdateStockLevel}
          onAddToShoppingList={handleAddToShoppingList}
          productsInShoppingList={productsInShoppingList}
        />
      </div>

      {/* FAB (Floating Action Button) */}
      <button
        data-testid="fab-add-product"
        onClick={handleAddProduct}
        className="fixed bottom-6 right-6 bg-success hover:bg-success-hover text-white rounded-full shadow-card-hover hover:shadow-card-active transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-success focus:ring-offset-2"
        style={{
          minWidth: '56px',
          minHeight: '56px',
          width: '56px',
          height: '56px',
        }}
        aria-label="Añadir producto"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Edit Product Modal */}
      {productToEdit && (
        <EditProductModal
          product={productToEdit}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSave={handleSaveProduct}
        />
      )}

      {/* Register Purchase Modal */}
      <RegisterPurchaseModal
        isOpen={isRegisterPurchaseOpen}
        products={allProducts}
        onSave={handleSaveRegisterPurchase}
        onCancel={handleCloseRegisterPurchase}
        initialItems={initialPurchaseItems}
      />

      {/* Ticket Scan Modal */}
      <TicketScanModal
        isOpen={isTicketScanOpen}
        onClose={() => setIsTicketScanOpen(false)}
        onConfirm={handleTicketScanConfirm}
        ocrService={getOCRService()}
        productRepository={productRepository}
      />

      {/* Update Stock Level Modal */}
      {productToUpdateStock && (
        <UpdateStockModal
          isOpen={isUpdateStockModalOpen}
          product={productToUpdateStock.product}
          currentLevel={productToUpdateStock.currentLevel}
          onConfirm={handleSaveStockLevel}
          onCancel={handleCloseUpdateStockModal}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Eliminar producto"
        message={`¿Estás seguro de que quieres eliminar "${productToDelete?.name}"? Esta acción no se puede deshacer.`}
        variant="danger"
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}