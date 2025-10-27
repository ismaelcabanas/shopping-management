import { useState, type FormEvent } from 'react';

export interface ProductFormData {
  name: string;
  quantity: number;
  unitType: string;
}

export interface ProductFormProps {
  onSubmit: (data: ProductFormData) => void;
}

export function ProductForm({ onSubmit }: ProductFormProps) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [nameError, setNameError] = useState('');
  const [quantityError, setQuantityError] = useState('');

  const validateName = (value: string): string => {
    if (value.trim() === '') {
      return 'El nombre no puede estar vacío';
    }
    if (value.trim().length < 2) {
      return 'El nombre debe tener al menos 2 caracteres';
    }
    return '';
  };

  const validateQuantity = (value: string): string => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      return '';
    }
    if (numValue < 0) {
      return 'La cantidad no puede ser negativa';
    }
    return '';
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const nameValidationError = validateName(name);
    const quantityValidationError = validateQuantity(quantity);

    setNameError(nameValidationError);
    setQuantityError(quantityValidationError);

    if (nameValidationError || quantityValidationError) {
      return;
    }

    onSubmit({
      name: name.trim(),
      quantity: parseFloat(quantity) || 0,
      unitType: 'units',
    });

    // Clear form after successful submission
    setName('');
    setQuantity('');
    setNameError('');
    setQuantityError('');
  };

  const handleNameChange = (value: string) => {
    setName(value);
    // Clear error when user starts typing
    if (nameError) {
      setNameError('');
    }
  };

  const handleQuantityChange = (value: string) => {
    setQuantity(value);
    // Clear error on change only if it was previously shown
    if (quantityError) {
      setQuantityError('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto p-4">
      <div className="mb-4">
        <label htmlFor="product-name" className="block text-sm font-medium text-gray-700 mb-2">
          Nombre del producto
        </label>
        <input
          id="product-name"
          type="text"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ fontSize: '16px' }}
          placeholder="Ej: Leche"
        />
        {nameError && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {nameError}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="product-quantity" className="block text-sm font-medium text-gray-700 mb-2">
          Cantidad inicial
        </label>
        <input
          id="product-quantity"
          type="number"
          value={quantity}
          onChange={(e) => handleQuantityChange(e.target.value)}
          className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ fontSize: '16px' }}
          placeholder="0"
          step="1"
        />
        {quantityError && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {quantityError}
          </p>
        )}
      </div>

      <div className="mb-6">
        <label htmlFor="product-unit" className="block text-sm font-medium text-gray-700 mb-2">
          Unidad
        </label>
        <select
          id="product-unit"
          className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          style={{ fontSize: '16px' }}
          value="units"
          disabled
        >
          <option value="units">Unidades</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        style={{ minHeight: '44px', fontSize: '16px' }}
      >
        Agregar producto
      </button>
    </form>
  );
}