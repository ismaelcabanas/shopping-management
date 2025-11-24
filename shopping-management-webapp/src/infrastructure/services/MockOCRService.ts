import type { OCRService } from '../../application/ports/OCRService'

export class MockOCRService implements OCRService {
  private mockText: string
  private mockResponses: Record<string, string> = {
    'default': 'Leche | 2\nPan | 3',
    'new-products': 'Tomates | 5\nPlátanos | 2',
    'mixed': 'Leche | 2\nTomates | 5\nPan | 1',
    'blank': ''
  }

  constructor(mockText: string = '') {
    this.mockText = mockText
  }

  async extractText(imageFile: File): Promise<string> {
    // If mockText was set explicitly, use it
    if (this.mockText) {
      return this.mockText
    }

    // Otherwise, return predefined response based on filename
    const filename = imageFile.name.toLowerCase()

    if (filename.includes('new')) return this.mockResponses['new-products']
    if (filename.includes('mixed')) return this.mockResponses['mixed']
    if (filename.includes('blank')) return this.mockResponses['blank']

    return this.mockResponses['default']
  }

  getProviderName(): string {
    return 'mock-ocr'
  }

  setMockText(text: string): void {
    this.mockText = text
  }
}
