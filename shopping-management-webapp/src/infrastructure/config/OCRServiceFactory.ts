import type { OCRService } from '../../application/ports/OCRService';
import { GeminiVisionOCRService } from '../services/ocr/GeminiVisionOCRService';
import { OllamaVisionOCRService } from '../services/ocr/OllamaVisionOCRService';
import { MockOCRService } from '../services/MockOCRService';

/**
 * Supported OCR provider types
 */
export type OCRProviderType = 'gemini' | 'ollama' | 'mock';

/**
 * Factory for creating OCR service instances based on configuration.
 *
 * Supports provider selection via environment variable `VITE_OCR_PROVIDER`.
 * Defaults to 'gemini' for backward compatibility.
 *
 * @example
 * ```typescript
 * // Use environment variable
 * const ocrService = OCRServiceFactory.create();
 *
 * // Explicit provider override (useful for testing)
 * const mockService = OCRServiceFactory.create('mock');
 * ```
 */
export class OCRServiceFactory {
  /**
   * Creates an OCR service instance based on the specified or configured provider.
   *
   * @param provider - Explicit provider type. If not provided, reads from VITE_OCR_PROVIDER env var.
   * @returns Configured OCR service instance
   * @throws {Error} If provider is invalid or required configuration is missing
   */
  static create(provider?: OCRProviderType): OCRService {
    const selectedProvider =
      provider ||
      (import.meta.env.VITE_OCR_PROVIDER as OCRProviderType) ||
      'gemini'; // Default fallback

    switch (selectedProvider) {
      case 'gemini':
        return this.createGeminiService();

      case 'ollama':
        return this.createOllamaService();

      case 'mock':
        return this.createMockService();

      default:
        throw new Error(`Unknown OCR provider: ${selectedProvider}`);
    }
  }

  /**
   * Creates a Gemini Vision OCR service instance.
   *
   * @private
   * @throws {Error} If VITE_OCR_LLM_API_KEY is not set
   */
  private static createGeminiService(): OCRService {
    const apiKey = import.meta.env.VITE_OCR_LLM_API_KEY;

    if (!apiKey) {
      throw new Error(
        'VITE_OCR_LLM_API_KEY is required when VITE_OCR_PROVIDER=gemini. ' +
          'Get your API key at: https://makersuite.google.com/app/apikey'
      );
    }

    const model = import.meta.env.VITE_OCR_LLM_MODEL || 'gemini-2.0-flash';

    return new GeminiVisionOCRService(apiKey, model);
  }

  /**
   * Creates an Ollama Vision OCR service instance.
   *
   * @private
   */
  private static createOllamaService(): OCRService {
    const baseUrl =
      import.meta.env.VITE_OLLAMA_URL || 'http://localhost:11434';
    const model = import.meta.env.VITE_OLLAMA_MODEL || 'llava';

    return new OllamaVisionOCRService(baseUrl, model);
  }

  /**
   * Creates a mock OCR service instance for testing.
   *
   * @private
   */
  private static createMockService(): OCRService {
    return new MockOCRService('Mock product | 1');
  }
}
