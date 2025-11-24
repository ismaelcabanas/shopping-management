/**
 * TicketScanResult - Application DTO
 *
 * Re-exporta los modelos de dominio y define el resultado del caso de uso.
 * Los DTOs de aplicación pueden importar y usar modelos de dominio.
 */
import type {
  DetectionStatus,
  RawDetectedItem,
  MatchedDetectedItem
} from '../../domain/model/DetectedItem'

// Re-export domain models for convenience
export type { DetectionStatus, RawDetectedItem, MatchedDetectedItem }

export interface TicketScanResult {
  rawText: string
  detectedItems: MatchedDetectedItem[]
  confidence: number
  processingTimeMs: number
  ocrProvider: string
}
