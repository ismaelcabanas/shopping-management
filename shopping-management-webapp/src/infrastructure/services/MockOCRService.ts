import type { OCRService } from '../../application/ports/OCRService'

export class MockOCRService implements OCRService {
  private mockText: string

  constructor(mockText: string = '') {
    this.mockText = mockText
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async extractText(_imageFile: File): Promise<string> {
    // Ignore the imageFile parameter for mock
    return Promise.resolve(this.mockText)
  }

  getProviderName(): string {
    return 'mock-ocr'
  }

  setMockText(text: string): void {
    this.mockText = text
  }
}
