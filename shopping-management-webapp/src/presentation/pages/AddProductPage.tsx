import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ProductForm, type ProductFormData } from '../components/ProductForm';
import { AddProductToInventory } from '../../application/use-cases/AddProductToInventory';
import { LocalStorageProductRepository } from '../../infrastructure/repositories/LocalStorageProductRepository';
import { LocalStorageInventoryRepository } from '../../infrastructure/repositories/LocalStorageInventoryRepository';
import { v4 as uuidv4 } from 'uuid';

export function AddProductPage() {
  const navigate = useNavigate();

  // Initialize repositories
  const productRepository = new LocalStorageProductRepository();
  const inventoryRepository = new LocalStorageInventoryRepository();
  const addProductToInventory = new AddProductToInventory(productRepository, inventoryRepository);

  const handleSubmit = async (data: ProductFormData) => {
    try {
      // Generate UUID for the product
      const productId = uuidv4();

      // Execute use case
      await addProductToInventory.execute({
        id: productId,
        name: data.name,
        initialQuantity: data.quantity,
      });

      // Show success toast and navigate immediately
      toast.success('Producto agregado exitosamente');
      navigate('/catalog');
    } catch (error) {
      // Handle errors with toast
      if (error instanceof Error) {
        if (error.message.includes('already exists')) {
          toast.error('Ya existe un producto con ese nombre');
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error('Error al agregar el producto');
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