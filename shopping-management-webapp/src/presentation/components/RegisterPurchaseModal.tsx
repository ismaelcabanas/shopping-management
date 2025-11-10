import { useState } from 'react';
import type { Product } from '../../domain/model/Product';
import type { PurchaseItemInput } from '../../application/use-cases/RegisterPurchase';

export interface RegisterPurchaseModalProps {
  isOpen: boolean;
  products: Product[];
  onCancel: () => void;
  onSave: (items: PurchaseItemInput[]) => Promise<void>;
}

export function RegisterPurchaseModal({
  isOpen,
  products,
  onCancel,
  onSave,
}: RegisterPurchaseModalProps) {
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItemInput[]>([]);
  const [error, setError] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  const handleAddProduct = () => {
    if (!selectedProduct) {
      setError('Selecciona un producto');
      return;
    }

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      setError('La cantidad debe ser mayor a 0');
      return;
    }

    const product = products.find(p => p.id.value === selectedProduct);
    if (!product) return;

    // Check if product is already in the list
    const existingIndex = purchaseItems.findIndex(
      item => item.productId === selectedProduct
    );

    if (existingIndex !== -1) {
      // Sum quantity to existing item
      const updated = [...purchaseItems];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + qty,
      };
      setPurchaseItems(updated);
    } else {
      // Add new item
      setPurchaseItems([
        ...purchaseItems,
        {
          productId: selectedProduct,
          quantity: qty,
        },
      ]);
    }

    // Reset form
    setSelectedProduct('');
    setQuantity('');
    setError('');
  };

  const handleRemoveProduct = (productId: string) => {
    setPurchaseItems(purchaseItems.filter(item => item.productId !== productId));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError('');
      await onSave(purchaseItems);
      // Reset state after successful save
      setPurchaseItems([]);
      setSelectedProduct('');
      setQuantity('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al guardar la compra';
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const getProductName = (productId: string): string => {
    const product = products.find(p => p.id.value === productId);
    return product ? product.name : '';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" data-testid="register-purchase-modal">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Registrar Compra</h2>

        {/* Product selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Selecciona los productos que compraste:
          </label>
          <div className="flex gap-2">
            <select
              data-testid="product-selector"
              value={selectedProduct}
              onChange={(e) => {
                setSelectedProduct(e.target.value);
                setError('');
              }}
              className="flex-1 border rounded px-3 py-2"
            >
              <option value="">Seleccionar producto...</option>
              {products.map(product => (
                <option key={product.id.value} value={product.id.value}>
                  {product.name}
                </option>
              ))}
            </select>
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
                  data-testid={`purchase-item-${getProductName(item.productId)}`}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded"
                >
                  <span>
                    {getProductName(item.productId)} - {item.quantity}
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
