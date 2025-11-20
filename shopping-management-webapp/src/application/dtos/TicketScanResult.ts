export type DetectionStatus = 'matched' | 'unmatched' | 'low-confidence'

export interface RawDetectedItem {
  id: string
  rawLine: string
  productName: string
  quantity: number
  confidence: number
}

export interface MatchedDetectedItem extends RawDetectedItem {
  matchedProductId?: string
  matchedProductName?: string
  status: DetectionStatus
}

export interface TicketScanResult {
  rawText: string
  detectedItems: MatchedDetectedItem[]
  confidence: number
  processingTimeMs: number
  ocrProvider: string
}
