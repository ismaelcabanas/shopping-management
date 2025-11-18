import { useState, useEffect, type FormEvent } from 'react';
import type { Product } from '../../domain/model/Product';
import type { UpdateProductCommand } from '../../application/use-cases/UpdateProduct';
import { Modal } from '../shared/components/Modal';
import { Button } from '../shared/components/Button';

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Editar Producto"
      size="md"
      closeOnBackdropClick={false}
      closeOnEscape={!isSaving}
    >
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
            className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            style={{ fontSize: '16px' }}
            disabled={isSaving}
            autoFocus
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
            className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
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
          <Button
            type="button"
            onClick={handleCancel}
            variant="secondary"
            fullWidth
            disabled={isSaving}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={isSaving}
            disabled={isSaving}
          >
            Guardar
          </Button>
        </div>
      </form>
    </Modal>
  );
}
