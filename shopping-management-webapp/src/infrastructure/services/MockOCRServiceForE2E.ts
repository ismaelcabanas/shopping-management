import type { OCRService } from '../../application/ports/OCRService'

/**
 * Mock OCR Service for E2E tests that returns predefined ticket data
 */
export class MockOCRServiceForE2E implements OCRService {
  private mockResponse: string

  constructor() {
    // Default mock response with 4 products
    this.mockResponse = `TICKET DE COMPRA
Milk | 3
Bread | 4
Rice | 1
Eggs | 6
TOTAL: $50.00`
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async extractText(_imageFile: File): Promise<string> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 100))
    return Promise.resolve(this.mockResponse)
  }

  getProviderName(): string {
    return 'mock-ocr-e2e'
  }

  setMockResponse(response: string): void {
    this.mockResponse = response
  }
}