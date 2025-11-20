import type { OCRService } from '../../application/ports/OCRService'

export class MockOCRService implements OCRService {
  private mockText: string

  constructor(mockText: string = '') {
    this.mockText = mockText
  }

  async extractText(_imageFile: File): Promise<string> {
    return Promise.resolve(this.mockText)
  }

  getProviderName(): string {
    return 'mock-ocr'
  }

  setMockText(text: string): void {
    this.mockText = text
  }
}
