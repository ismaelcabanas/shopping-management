import { useState, useEffect } from 'react'
import { Modal } from '../shared/components/Modal'
import { TicketUploadView } from './TicketUploadView'
import { TicketProcessingView } from './TicketProcessingView'
import { TicketResultsView } from './TicketResultsView'
import { useTicketScan } from '../hooks/useTicketScan'
import type { MatchedDetectedItem } from '../../application/dtos/TicketScanResult'
import type { OCRService } from '../../application/ports/OCRService'
import type { ProductRepository } from '../../domain/repositories/ProductRepository'

interface TicketScanModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (items: MatchedDetectedItem[]) => void
  ocrService: OCRService
  productRepository: ProductRepository
  onComplete?: () => void | Promise<void>
}

type ViewState = 'upload' | 'processing' | 'results'

export function TicketScanModal({
  isOpen,
  onClose,
  onConfirm,
  ocrService,
  productRepository,
  onComplete
}: TicketScanModalProps) {
  const [currentView, setCurrentView] = useState<ViewState>('upload')

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

  const handleConfirm = async (items: MatchedDetectedItem[]) => {
    onConfirm(items)

    // Call onComplete callback if provided (for post-purchase actions)
    if (onComplete) {
      await onComplete()
    }

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
