import { describe, it, expect, beforeEach } from 'vitest'
import { ScanTicket } from '../../../application/use-cases/ScanTicket'
import { MockOCRService } from '../../../infrastructure/services/MockOCRService'
import type { ProductRepository } from '../../../domain/repositories/ProductRepository'
import { Product } from '../../../domain/model/Product'
import { ProductId } from '../../../domain/model/ProductId'
import { UnitType } from '../../../domain/model/UnitType'

class InMemoryProductRepository implements ProductRepository {
  private products: Product[] = []

  async save(): Promise<void> {
    throw new Error('Not implemented')
  }

  async findAll(): Promise<Product[]> {
    return this.products
  }

  async findById(): Promise<Product | null> {
    throw new Error('Not implemented')
  }

  async update(): Promise<void> {
    throw new Error('Not implemented')
  }

  async delete(): Promise<void> {
    throw new Error('Not implemented')
  }

  async findByName(): Promise<Product | null> {
    throw new Error('Not implemented')
  }

  setProducts(products: Product[]): void {
    this.products = products
  }
}

describe('ScanTicket', () => {
  let scanTicket: ScanTicket
  let ocrService: MockOCRService
  let productRepository: InMemoryProductRepository

  beforeEach(() => {
    ocrService = new MockOCRService()
    productRepository = new InMemoryProductRepository()
    scanTicket = new ScanTicket(ocrService, productRepository)
  })

  it('should extract text from image and parse products (pipe format)', async () => {
    const ticketText = 'Leche Pascual | 2\nPan de Molde | 1'
    ocrService.setMockText(ticketText)

    productRepository.setProducts([
      new Product(
        ProductId.fromString('550e8400-e29b-41d4-a716-446655440001'),
        'Leche Pascual',
        UnitType.liters()
      ),
      new Product(
        ProductId.fromString('550e8400-e29b-41d4-a716-446655440002'),
        'Pan de Molde',
        UnitType.units()
      )
    ])

    const mockFile = new File([''], 'ticket.jpg', { type: 'image/jpeg' })
    const result = await scanTicket.execute({ imageFile: mockFile })

    expect(result.rawText).toBe(ticketText)
    expect(result.detectedItems).toHaveLength(2)
    expect(result.detectedItems[0].productName).toBe('Leche Pascual')
    expect(result.detectedItems[0].quantity).toBe(2)
    expect(result.detectedItems[0].status).toBe('matched')
    expect(result.detectedItems[1].productName).toBe('Pan de Molde')
    expect(result.detectedItems[1].quantity).toBe(1)
    expect(result.detectedItems[1].status).toBe('matched')
    expect(result.ocrProvider).toBe('mock-ocr')
  })
})
