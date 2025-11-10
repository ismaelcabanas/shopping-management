import { useState } from 'react';
import type { Product } from '../../domain/model/Product';
import type { PurchaseItemInput } from '../../application/use-cases/RegisterPurchase';

export interface RegisterPurchaseModalProps {
  isOpen: boolean;
  products: Product[];
  onCancel: () => void;
  onSave: (items: PurchaseItemInput[]) => Promise<void>;
}

interface PurchaseItemWithName extends PurchaseItemInput {
  productName: string;
}

export function RegisterPurchaseModal({
  isOpen,
  products,
  onCancel,
  onSave,
}: RegisterPurchaseModalProps) {
  const [productName, setProductName] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItemWithName[]>([]);
  const [error, setError] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filter products based on input
  const filteredProducts = productName.trim()
    ? products.filter(p =>
        p.name.toLowerCase().includes(productName.toLowerCase())
      )
    : [];

  const handleAddProduct = () => {
    const trimmedName = productName.trim();

    if (!trimmedName) {
      setError('Escribe el nombre del producto');
      return;
    }

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      setError('La cantidad debe ser mayor a 0');
      return;
    }

    // Find if product exists (case-insensitive)
    const existingProduct = products.find(
      p => p.name.toLowerCase() === trimmedName.toLowerCase()
    );

    const productId = existingProduct?.id.value || trimmedName;

    // Check if product is already in the list
    if (purchaseItems.find(item => item.productId === productId)) {
      setError('Este producto ya está en la lista');
      return;
    }

    // Add to purchase list
    setPurchaseItems([
      ...purchaseItems,
      {
        productId,
        quantity: qty,
        productName: existingProduct?.name || trimmedName,
      },
    ]);

    // Reset form
    setProductName('');
    setQuantity('');
    setError('');
    setShowSuggestions(false);
  };

  const handleRemoveProduct = (productId: string) => {
    setPurchaseItems(purchaseItems.filter(item => item.productId !== productId));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError('');

      // Map to PurchaseItemInput (remove productName)
      const itemsToSave: PurchaseItemInput[] = purchaseItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      await onSave(itemsToSave);
      // Reset state after successful save
      setPurchaseItems([]);
      setProductName('');
      setQuantity('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al guardar la compra';
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectSuggestion = (product: Product) => {
    setProductName(product.name);
    setShowSuggestions(false);
  };

  const handleInputFocus = () => {
    if (productName.trim()) {
      setShowSuggestions(true);
    }
  };

  const handleInputChange = (value: string) => {
    setProductName(value);
    setError('');
    setShowSuggestions(value.trim().length > 0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" data-testid="register-purchase-modal">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Registrar Compra</h2>

        {/* Product input with autocomplete */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Escribe el nombre del producto:
          </label>
          <div className="flex gap-2 relative">
            <div className="flex-1 relative">
              <input
                data-testid="product-input"
                type="text"
                value={productName}
                onChange={(e) => handleInputChange(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Ej: Leche, Pan, Arroz..."
                className="w-full border rounded px-3 py-2"
              />

              {/* Autocomplete suggestions */}
              {showSuggestions && filteredProducts.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {filteredProducts.map(product => (
                    <button
                      key={product.id.value}
                      type="button"
                      onClick={() => handleSelectSuggestion(product)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                    >
                      {product.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <input
              data-testid="quantity-input"
              type="number"
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
                setError('');
              }}
              placeholder="Cantidad"
              className="w-24 border rounded px-3 py-2"
              min="1"
            />
            <button
              data-testid="add-item-button"
              onClick={handleAddProduct}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Añadir
            </button>
          </div>

          {products.length === 0 && (
            <p className="text-gray-600 text-sm mt-2">
              💡 Escribe el nombre de cualquier producto. Si no existe en tu catálogo, se creará automáticamente.
            </p>
          )}

          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </div>

        {/* List of added products */}
        {purchaseItems.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Productos añadidos:</h3>
            <div className="space-y-2">
              {purchaseItems.map(item => (
                <div
                  key={item.productId}
                  data-testid={`purchase-item-${item.productName}`}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded"
                >
                  <span>
                    {item.productName} - {item.quantity}
                    {!products.find(p => p.id.value === item.productId) && (
                      <span className="ml-2 text-xs text-green-600 font-semibold">(nuevo)</span>
                    )}
                  </span>
                  <button
                    onClick={() => handleRemoveProduct(item.productId)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 justify-end">
          <button
            data-testid="cancel-purchase-button"
            onClick={onCancel}
            className="px-4 py-2 border rounded hover:bg-gray-100"
            disabled={isSaving}
          >
            Cancelar
          </button>
          <button
            data-testid="confirm-purchase-button"
            onClick={handleSave}
            disabled={purchaseItems.length === 0 || isSaving}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Guardando...' : 'Guardar Compra'}
          </button>
        </div>
      </div>
    </div>
  );
}
