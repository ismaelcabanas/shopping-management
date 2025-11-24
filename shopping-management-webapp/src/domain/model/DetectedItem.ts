/**
 * DetectedItem - Domain Model
 *
 * Representa un producto detectado en un ticket escaneado.
 * Es un concepto de dominio puro, sin dependencias externas.
 */

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
