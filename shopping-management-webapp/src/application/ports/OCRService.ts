export interface OCRService {
  extractText(imageFile: File): Promise<string>
  getProviderName(): string
}
