import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductForm, type ProductFormData } from '../components/ProductForm';
import { AddProductToInventory } from '../../application/use-cases/AddProductToInventory';
import { LocalStorageProductRepository } from '../../infrastructure/repositories/LocalStorageProductRepository';
import { LocalStorageInventoryRepository } from '../../infrastructure/repositories/LocalStorageInventoryRepository';
import { v4 as uuidv4 } from 'uuid';

export function AddProductPage() {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Initialize repositories
  const productRepository = new LocalStorageProductRepository();
  const inventoryRepository = new LocalStorageInventoryRepository();
  const addProductToInventory = new AddProductToInventory(productRepository, inventoryRepository);

  const handleSubmit = async (data: ProductFormData) => {
    try {
      // Clear previous messages
      setSuccessMessage('');
      setErrorMessage('');

      // Generate UUID for the product
      const productId = uuidv4();

      // Execute use case
      await addProductToInventory.execute({
        id: productId,
        name: data.name,
        initialQuantity: data.quantity,
      });

      // Show success message
      setSuccessMessage('Producto agregado exitosamente');

      // Navigate to catalog after a short delay
      setTimeout(() => {
        navigate('/catalog');
      }, 1500);
    } catch (error) {
      // Handle errors
      if (error instanceof Error) {
        if (error.message.includes('already exists')) {
          setErrorMessage('Ya existe un producto con ese nombre');
        } else {
          setErrorMessage(error.message);
        }
      } else {
        setErrorMessage('Error al agregar el producto');
      }
    }
  };

  const handleBack = () => {
    navigate('/catalog');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Agregar Nuevo Producto</h1>
          <p className="text-gray-600">Complete el formulario para agregar un producto a su inventario</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div
            className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg"
            role="alert"
          >
            <p className="font-medium">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div
            className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"
            role="alert"
          >
            <p className="font-medium">{errorMessage}</p>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <ProductForm onSubmit={handleSubmit} />
        </div>

        {/* Back Button */}
        <button
          onClick={handleBack}
          className="w-full bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors"
          style={{ minHeight: '44px' }}
        >
          Volver al catálogo
        </button>
      </div>
    </div>
  );
}