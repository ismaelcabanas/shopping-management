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

  const realWorldCatalog = [
    new Product(
      ProductId.fromString('550e8400-e29b-41d4-a716-446655440010'),
      'Plátanos',
      UnitType.kg()
    ),
    new Product(
      ProductId.fromString('550e8400-e29b-41d4-a716-446655440011'),
      'Tomates',
      UnitType.kg()
    ),
    new Product(
      ProductId.fromString('550e8400-e29b-41d4-a716-446655440012'),
      'Kiwis',
      UnitType.units()
    ),
    new Product(
      ProductId.fromString('550e8400-e29b-41d4-a716-446655440013'),
      'Huevos',
      UnitType.units()
    ),
    new Product(
      ProductId.fromString('550e8400-e29b-41d4-a716-446655440014'),
      'Plátano',
      UnitType.kg()
    ),
    new Product(
      ProductId.fromString('550e8400-e29b-41d4-a716-446655440015'),
      'Lechuga',
      UnitType.units()
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

  describe('Real-world ticket matching', () => {
    it('should match "PLATANO GABECERAS CANARIO" with "Plátanos" or "Plátano"', () => {
      const matcher = new ProductMatcher(ConfidenceThresholds.default())
      const detectedItem: RawDetectedItem = {
        id: 'temp-1',
        rawLine: 'PLATANO GABECERAS CANARIO',
        productName: 'PLATANO GABECERAS CANARIO',
        quantity: 1,
        confidence: 0.9
      }

      const result = matcher.match(detectedItem, realWorldCatalog)

      expect(['550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440014']).toContain(result.matchedProductId)
      expect(['Plátanos', 'Plátano']).toContain(result.matchedProductName)
      expect(result.status).toBe('matched')
      expect(result.confidence).toBeGreaterThanOrEqual(0.6)
    })

    it('should match "TOMATE ROJO RAMA" with "Tomates"', () => {
      const matcher = new ProductMatcher(ConfidenceThresholds.default())
      const detectedItem: RawDetectedItem = {
        id: 'temp-2',
        rawLine: 'TOMATE ROJO RAMA',
        productName: 'TOMATE ROJO RAMA',
        quantity: 1,
        confidence: 0.9
      }

      const result = matcher.match(detectedItem, realWorldCatalog)

      expect(result.matchedProductId).toBe('550e8400-e29b-41d4-a716-446655440011')
      expect(result.matchedProductName).toBe('Tomates')
      expect(result.status).toBe('matched')
      expect(result.confidence).toBeGreaterThanOrEqual(0.6)
    })

    it('should match "KIWI ZESPRI" with "Kiwis"', () => {
      const matcher = new ProductMatcher(ConfidenceThresholds.default())
      const detectedItem: RawDetectedItem = {
        id: 'temp-3',
        rawLine: 'KIWI ZESPRI',
        productName: 'KIWI ZESPRI',
        quantity: 1,
        confidence: 0.9
      }

      const result = matcher.match(detectedItem, realWorldCatalog)

      expect(result.matchedProductId).toBe('550e8400-e29b-41d4-a716-446655440012')
      expect(result.matchedProductName).toBe('Kiwis')
      expect(result.status).toBe('matched')
      expect(result.confidence).toBeGreaterThanOrEqual(0.6)
    })

    it('should match "HUEVOS SUELTAS GALLINERO AL" with "Huevos"', () => {
      const matcher = new ProductMatcher(ConfidenceThresholds.default())
      const detectedItem: RawDetectedItem = {
        id: 'temp-4',
        rawLine: 'HUEVOS SUELTAS GALLINERO AL',
        productName: 'HUEVOS SUELTAS GALLINERO AL',
        quantity: 1,
        confidence: 0.9
      }

      const result = matcher.match(detectedItem, realWorldCatalog)

      expect(result.matchedProductId).toBe('550e8400-e29b-41d4-a716-446655440013')
      expect(result.matchedProductName).toBe('Huevos')
      expect(result.status).toBe('matched')
      expect(result.confidence).toBeGreaterThanOrEqual(0.6)
    })

    it('should NOT match "BRÓCOLI 500G" with "Huevos"', () => {
      const matcher = new ProductMatcher(ConfidenceThresholds.default())
      const detectedItem: RawDetectedItem = {
        id: 'temp-5',
        rawLine: 'BRÓCOLI 500G',
        productName: 'BRÓCOLI 500G',
        quantity: 1,
        confidence: 0.9
      }

      const result = matcher.match(detectedItem, realWorldCatalog)

      expect(result.status).toBe('unmatched')
      expect(result.matchedProductId).toBeUndefined()
    })

    it('should match "PLATANO GABACERAS CANARIO" with "Plátano" (singular)', () => {
      const matcher = new ProductMatcher(ConfidenceThresholds.default())
      const detectedItem: RawDetectedItem = {
        id: 'temp-6',
        rawLine: 'PLATANO GABACERAS CANARIO',
        productName: 'PLATANO GABACERAS CANARIO',
        quantity: 1,
        confidence: 0.9
      }

      const result = matcher.match(detectedItem, realWorldCatalog)

      expect(result.matchedProductId).toBe('550e8400-e29b-41d4-a716-446655440014')
      expect(result.matchedProductName).toBe('Plátano')
      expect(result.status).toBe('matched')
      expect(result.confidence).toBeGreaterThanOrEqual(0.6)
    })

    it('should match "CORAZÓN LECHUGA 6U" with "Lechuga"', () => {
      const matcher = new ProductMatcher(ConfidenceThresholds.default())
      const detectedItem: RawDetectedItem = {
        id: 'temp-7',
        rawLine: 'CORAZÓN LECHUGA 6U',
        productName: 'CORAZÓN LECHUGA 6U',
        quantity: 1,
        confidence: 0.9
      }

      const result = matcher.match(detectedItem, realWorldCatalog)

      expect(result.matchedProductId).toBe('550e8400-e29b-41d4-a716-446655440015')
      expect(result.matchedProductName).toBe('Lechuga')
      expect(result.status).toBe('matched')
      expect(result.confidence).toBeGreaterThanOrEqual(0.6)
    })
  })
})
