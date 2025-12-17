import { useState, useEffect, useCallback, useMemo } from 'react'
import { useShoppingList } from '../hooks/useShoppingList'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ShoppingListView } from '../components/ShoppingListView'
import { RegisterPurchaseModal } from '../components/RegisterPurchaseModal'
import { TicketScanModal } from '../components/TicketScanModal'
import { RecalculateShoppingList } from '../../application/use-cases/RecalculateShoppingList'
import { LocalStorageShoppingListRepository } from '../../infrastructure/repositories/LocalStorageShoppingListRepository'
import { LocalStorageInventoryRepository } from '../../infrastructure/repositories/LocalStorageInventoryRepository'
import { LocalStorageProductRepository } from '../../infrastructure/repositories/LocalStorageProductRepository'
import { GeminiVisionOCRService } from '../../infrastructure/services/ocr/GeminiVisionOCRService'
import { useInventory } from '../hooks/useInventory'
import type { Product } from '../../domain/model/Product'
import type { PurchaseItemInput } from '../../application/use-cases/RegisterPurchase'
import type { MatchedDetectedItem } from '../../application/dtos/TicketScanResult'

export function ActiveShoppingPage() {
  const { items, isLoading, error, toggleChecked } = useShoppingList()
  const navigate = useNavigate()
  const { registerPurchase } = useInventory()

  const [showTicketScanModal, setShowTicketScanModal] = useState(false)
  const [showRegisterPurchaseModal, setShowRegisterPurchaseModal] = useState(false)
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [initialPurchaseItems, setInitialPurchaseItems] = useState<PurchaseItemInput[] | undefined>(undefined)

  // Initialize services for TicketScanModal
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  const model = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.0-flash'
  const ocrService = new GeminiVisionOCRService(apiKey, model)
  const productRepository = useMemo(() => new LocalStorageProductRepository(), [])

  const loadAllProducts = useCallback(async () => {
    try {
      const prods = await productRepository.findAll()
      setAllProducts(prods)
    } catch (error) {
      console.error('Error loading all products:', error)
      setAllProducts([])
    }
  }, [productRepository])

  useEffect(() => {
    loadAllProducts()
  }, [loadAllProducts])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">Cargando lista de compras...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">Error al cargar la lista: {error.message}</div>
      </div>
    )
  }

  const handleCancel = () => {
    navigate('/shopping-list')
  }

  const handleScanTicket = () => {
    setShowTicketScanModal(true)
  }

  const handleRegisterManual = () => {
    setShowRegisterPurchaseModal(true)
  }

  const handlePostPurchase = async () => {
    try {
      // Recalculate shopping list based on current inventory
      const shoppingListRepo = new LocalStorageShoppingListRepository()
      const inventoryRepo = new LocalStorageInventoryRepository()
      const recalculateList = new RecalculateShoppingList(shoppingListRepo, inventoryRepo)

      await recalculateList.execute()

      // Show success message
      toast.success('Compra registrada y lista actualizada')

      // Navigate back to shopping list
      navigate('/shopping-list')
    } catch (error) {
      console.error('Error in post-purchase flow:', error)
      toast.error('Error al actualizar la lista')
    }
  }

  const handleTicketScanConfirm = (items: MatchedDetectedItem[]) => {
    // Convert MatchedDetectedItem[] to PurchaseItemInput[]
    const purchaseItems: PurchaseItemInput[] = items.map(item => ({
      productId: item.matchedProductId || item.productName,
      quantity: item.quantity,
    }))

    // Close ticket scan modal
    setShowTicketScanModal(false)

    // Open register purchase modal with pre-filled items
    setInitialPurchaseItems(purchaseItems)
    setShowRegisterPurchaseModal(true)
  }

  const handleSaveRegisterPurchase = async (items: PurchaseItemInput[]) => {
    await registerPurchase(items)
    setShowRegisterPurchaseModal(false)
    setInitialPurchaseItems(undefined)
  }

  const handleCloseRegisterPurchase = () => {
    setShowRegisterPurchaseModal(false)
    setInitialPurchaseItems(undefined)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with title and cancel button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🛒 Comprando...</h1>
        <button
          onClick={handleCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors"
        >
          Cancelar
        </button>
      </div>

      {/* Shopping list with checkboxes enabled */}
      <ShoppingListView items={items} readonly={false} onToggleChecked={toggleChecked} />

      {/* Action buttons */}
      {items.length > 0 && (
        <div className="mt-6 flex gap-4 justify-center">
          <button
            onClick={handleScanTicket}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            📸 Escanear Ticket
          </button>
          <button
            onClick={handleRegisterManual}
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            ✏️ Registrar Manual
          </button>
        </div>
      )}

      {/* Modals */}
      <TicketScanModal
        isOpen={showTicketScanModal}
        onClose={() => setShowTicketScanModal(false)}
        onConfirm={handleTicketScanConfirm}
        ocrService={ocrService}
        productRepository={productRepository}
        onComplete={handlePostPurchase}
      />

      <RegisterPurchaseModal
        isOpen={showRegisterPurchaseModal}
        products={allProducts}
        onCancel={handleCloseRegisterPurchase}
        onSave={handleSaveRegisterPurchase}
        initialItems={initialPurchaseItems}
        onComplete={handlePostPurchase}
      />
    </div>
  )
}
