import { describe, it, expect } from 'vitest'
import { ProductMatcher } from '../../../domain/services/ProductMatcher'
import { Product } from '../../../domain/model/Product'
import { ProductId } from '../../../domain/model/ProductId'
import { UnitType } from '../../../domain/model/UnitType'
import type { RawDetectedItem } from '../../../application/dtos/TicketScanResult'
import { ConfidenceThresholds } from '../../../domain/model/ConfidenceThresholds'

describe('ProductMatcher', () => {
  const mockProducts = [
    new Product(
      ProductId.fromString('550e8400-e29b-41d4-a716-446655440001'),
      'Leche Pascual',
      UnitType.liters()
    ),
    new Product(
      ProductId.fromString('550e8400-e29b-41d4-a716-446655440002'),
      'Pan de Molde',
      UnitType.units()
    ),
    new Product(
      ProductId.fromString('550e8400-e29b-41d4-a716-446655440003'),
      'Zanahorias',
      UnitType.kg()
    )
  ]

  it('should match exact product name', () => {
    const matcher = new ProductMatcher(ConfidenceThresholds.default())
    const detectedItem: RawDetectedItem = {
      id: 'temp-1',
      rawLine: 'Leche Pascual    2    3.00',
      productName: 'Leche Pascual',
      quantity: 2,
      confidence: 0.5
    }

    const result = matcher.match(detectedItem, mockProducts)

    expect(result.matchedProductId).toBe('550e8400-e29b-41d4-a716-446655440001')
    expect(result.matchedProductName).toBe('Leche Pascual')
    expect(result.status).toBe('matched')
    expect(result.confidence).toBeGreaterThan(0.8)
  })
})
