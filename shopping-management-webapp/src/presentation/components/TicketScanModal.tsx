import { useState, useEffect } from 'react'
import { Modal } from '../shared/components/Modal'
import { TicketUploadView } from './TicketUploadView'
import { TicketProcessingView } from './TicketProcessingView'
import { TicketResultsView } from './TicketResultsView'
import { useTicketScan } from '../hooks/useTicketScan'
import { GeminiVisionOCRService } from '../../infrastructure/services/ocr/GeminiVisionOCRService'
import { LocalStorageProductRepository } from '../../infrastructure/repositories/LocalStorageProductRepository'
import type { MatchedDetectedItem } from '../../application/dtos/TicketScanResult'

interface TicketScanModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (items: MatchedDetectedItem[]) => void
}

type ViewState = 'upload' | 'processing' | 'results'

export function TicketScanModal({ isOpen, onClose, onConfirm }: TicketScanModalProps) {
  const [currentView, setCurrentView] = useState<ViewState>('upload')

  // Initialize services
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  const model = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.0-flash'
  const ocrService = new GeminiVisionOCRService(apiKey, model)
  const productRepository = new LocalStorageProductRepository()

  const { scanResult, isProcessing, error, scanTicket, resetScan } = useTicketScan(
    ocrService,
    productRepository
  )

  // Reset state when modal is closed or opened
  useEffect(() => {
    if (isOpen) {
      setCurrentView('upload')
      resetScan()
    }
  }, [isOpen, resetScan])

  // Update view based on processing state
  useEffect(() => {
    if (isProcessing) {
      setCurrentView('processing')
    } else if (scanResult) {
      setCurrentView('results')
    } else if (error) {
      // If there's an error, go back to upload view to show error
      setCurrentView('upload')
    }
  }, [isProcessing, scanResult, error])

  const handleFileSelect = async (file: File) => {
    // GeminiVisionOCRService handles the file directly
    await scanTicket(file)
  }

  const handleConfirm = (items: MatchedDetectedItem[]) => {
    onConfirm(items)
    onClose()
  }

  const handleCancel = () => {
    onClose()
  }

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Escanear Ticket">
      {currentView === 'upload' && (
        <div>
          <TicketUploadView onFileSelect={handleFileSelect} />
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                <strong>Error:</strong> {error.message}
              </p>
            </div>
          )}
        </div>
      )}
      {currentView === 'processing' && <TicketProcessingView />}
      {currentView === 'results' && scanResult && (
        <TicketResultsView
          items={scanResult.detectedItems}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </Modal>
  )
}
