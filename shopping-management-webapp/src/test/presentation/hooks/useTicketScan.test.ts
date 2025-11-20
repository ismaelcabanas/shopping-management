import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useTicketScan } from '../../../presentation/hooks/useTicketScan'
import { MockOCRService } from '../../../infrastructure/services/MockOCRService'
import type { ProductRepository } from '../../../domain/repositories/ProductRepository'
import { Product } from '../../../domain/model/Product'
import { ProductId } from '../../../domain/model/ProductId'
import { UnitType } from '../../../domain/model/UnitType'

class MockProductRepository implements ProductRepository {
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

  async findByName(): Promise<Product | null> {
    throw new Error('Not implemented')
  }

  async delete(): Promise<void> {
    throw new Error('Not implemented')
  }

  setProducts(products: Product[]): void {
    this.products = products
  }
}

describe('useTicketScan', () => {
  let ocrService: MockOCRService
  let productRepository: MockProductRepository

  beforeEach(() => {
    ocrService = new MockOCRService()
    productRepository = new MockProductRepository()
  })

  it('should initialize with null result and not processing', () => {
    const { result } = renderHook(() => useTicketScan(ocrService, productRepository))

    expect(result.current.scanResult).toBeNull()
    expect(result.current.isProcessing).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should scan ticket and return result', async () => {
    const ticketText = 'Leche Pascual    2    3.00'
    ocrService.setMockText(ticketText)

    productRepository.setProducts([
      new Product(
        ProductId.fromString('550e8400-e29b-41d4-a716-446655440001'),
        'Leche Pascual',
        UnitType.liters()
      )
    ])

    const { result } = renderHook(() => useTicketScan(ocrService, productRepository))

    const mockFile = new File([''], 'ticket.jpg', { type: 'image/jpeg' })

    act(() => {
      result.current.scanTicket(mockFile)
    })

    await waitFor(() => {
      expect(result.current.isProcessing).toBe(false)
    })

    expect(result.current.scanResult).not.toBeNull()
    expect(result.current.scanResult?.detectedItems).toHaveLength(1)
    expect(result.current.scanResult?.detectedItems[0].productName).toBe('Leche Pascual')
    expect(result.current.error).toBeNull()
  })

  it('should handle errors during scan', async () => {
    ocrService = new MockOCRService()
    const { result } = renderHook(() => useTicketScan(ocrService, productRepository))

    const mockFile = new File([''], 'ticket.jpg', { type: 'image/jpeg' })

    ocrService.extractText = async () => {
      throw new Error('OCR failed')
    }

    act(() => {
      result.current.scanTicket(mockFile)
    })

    await waitFor(() => {
      expect(result.current.isProcessing).toBe(false)
    })

    expect(result.current.error).not.toBeNull()
    expect(result.current.error?.message).toBe('OCR failed')
    expect(result.current.scanResult).toBeNull()
  })

  it('should reset scan state', async () => {
    const ticketText = 'Leche Pascual    2    3.00'
    ocrService.setMockText(ticketText)

    const { result } = renderHook(() => useTicketScan(ocrService, productRepository))

    const mockFile = new File([''], 'ticket.jpg', { type: 'image/jpeg' })

    act(() => {
      result.current.scanTicket(mockFile)
    })

    await waitFor(() => {
      expect(result.current.scanResult).not.toBeNull()
    })

    act(() => {
      result.current.resetScan()
    })

    expect(result.current.scanResult).toBeNull()
    expect(result.current.error).toBeNull()
    expect(result.current.isProcessing).toBe(false)
  })
})
