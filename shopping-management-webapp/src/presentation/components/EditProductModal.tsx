import { useState, useEffect, type FormEvent } from 'react';
import type { Product } from '../../domain/model/Product';
import type { UpdateProductCommand } from '../../application/use-cases/UpdateProduct';

export interface EditProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onSave: (command: UpdateProductCommand) => Promise<void>;
}

export function EditProductModal({ product, isOpen, onClose, onSave }: EditProductModalProps) {
  const [name, setName] = useState('');
  const [unitType, setUnitType] = useState('');
  const [nameError, setNameError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Pre-fill form when product changes or modal opens
  useEffect(() => {
    if (isOpen && product) {
      setName(product.name);
      setUnitType(product.unitType.value);
      setNameError('');
      setSaveError('');
    }
  }, [isOpen, product]);

  const validateName = (value: string): string => {
    if (value.trim() === '') {
      return 'El nombre no puede estar vacío';
    }
    if (value.trim().length < 2) {
      return 'El nombre debe tener al menos 2 caracteres';
    }
    return '';
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const nameValidationError = validateName(name);
    setNameError(nameValidationError);

    if (nameValidationError) {
      return;
    }

    try {
      setIsSaving(true);
      setSaveError('');

      await onSave({
        id: product.id.value,
        name: name.trim(),
        unitType,
      });

      onClose();
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Error al guardar';
      setSaveError(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (nameError) {
      setNameError('');
    }
    if (saveError) {
      setSaveError('');
    }
  };

  const handleUnitTypeChange = (value: string) => {
    setUnitType(value);
    if (saveError) {
      setSaveError('');
    }
  };

  const handleCancel = () => {
    setNameError('');
    setSaveError('');
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Editar Producto</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="edit-product-name" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del producto
              </label>
              <input
                id="edit-product-name"
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ fontSize: '16px' }}
                disabled={isSaving}
              />
              {nameError && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {nameError}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="edit-product-unit" className="block text-sm font-medium text-gray-700 mb-2">
                Unidad
              </label>
              <select
                id="edit-product-unit"
                value={unitType}
                onChange={(e) => handleUnitTypeChange(e.target.value)}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                style={{ fontSize: '16px' }}
                disabled={isSaving}
              >
                <option value="units">Unidades</option>
                <option value="kg">Kilogramos</option>
                <option value="liters">Litros</option>
              </select>
            </div>

            {saveError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{saveError}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-gray-200 text-gray-800 font-medium py-3 px-6 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors"
                style={{ minHeight: '44px', fontSize: '16px' }}
                disabled={isSaving}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                style={{ minHeight: '44px', fontSize: '16px' }}
                disabled={isSaving}
              >
                {isSaving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
