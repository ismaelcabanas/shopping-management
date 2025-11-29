import { useState, useCallback } from 'react'
import type { OCRService } from '../../application/ports/OCRService'
import type { ProductRepository } from '../../domain/repositories/ProductRepository'
import type { TicketScanResult } from '../../application/dtos/TicketScanResult'
import { ScanTicket } from '../../application/use-cases/ScanTicket'

export interface UseTicketScanResult {
  scanResult: TicketScanResult | null
  isProcessing: boolean
  error: Error | null
  scanTicket: (file: File) => void
  resetScan: () => void
}

export function useTicketScan(
  ocrService: OCRService,
  productRepository: ProductRepository
): UseTicketScanResult {
  const [scanResult, setScanResult] = useState<TicketScanResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const scanTicket = async (file: File): Promise<void> => {
    setIsProcessing(true)
    setError(null)
    setScanResult(null)

    try {
      const scanTicketUseCase = new ScanTicket(ocrService, productRepository)
      const result = await scanTicketUseCase.execute({ imageFile: file })
      setScanResult(result)
    } catch (err) {
      console.error('Error scanning ticket:', err)
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setIsProcessing(false)
    }
  }

  const resetScan = useCallback((): void => {
    setScanResult(null)
    setError(null)
    setIsProcessing(false)
  }, [])

  return {
    scanResult,
    isProcessing,
    error,
    scanTicket,
    resetScan
  }
}
