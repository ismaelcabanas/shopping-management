import { useState, useEffect } from 'react'
import { Modal } from '../shared/components/Modal'
import { TicketUploadView } from './TicketUploadView'
import { TicketProcessingView } from './TicketProcessingView'
import { TicketResultsView } from './TicketResultsView'
import { useTicketScan } from '../hooks/useTicketScan'
import { MockOCRService } from '../../infrastructure/services/MockOCRService'
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
  const ocrService = new MockOCRService()
  const productRepository = new LocalStorageProductRepository()

  const { scanResult, isProcessing, scanTicket, resetScan } = useTicketScan(
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
    }
  }, [isProcessing, scanResult])

  const handleFileSelect = async (file: File) => {
    // For MockOCRService, read file content and set as mock text
    const reader = new FileReader()
    reader.onload = async () => {
      const text = reader.result as string
      ocrService.setMockText(text)
      await scanTicket(file)
    }
    reader.readAsText(file)
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
      {currentView === 'upload' && <TicketUploadView onFileSelect={handleFileSelect} />}
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
