import type { OCRService } from '../../../application/ports/OCRService';

/**
 * OCR Service using Ollama with LLaVA vision model
 *
 * Requires:
 * 1. Ollama installed locally (https://ollama.com)
 * 2. LLaVA model pulled: `ollama pull llava`
 * 3. Ollama server running: `ollama serve` (default: http://localhost:11434)
 *
 * Advantages:
 * - 100% free and unlimited
 * - Privacy-friendly (all processing local)
 * - Context understanding (not just OCR, but semantic understanding)
 * - Offline capable
 *
 * @see docs/architecture/ocr-providers.md for alternatives
 */
export class OllamaVisionOCRService implements OCRService {
  private readonly baseUrl: string;
  private readonly model: string;

  /**
   * @param baseUrl - Ollama API base URL (default: http://localhost:11434)
   * @param model - Model to use (default: llava)
   */
  constructor(
    baseUrl: string = 'http://localhost:11434',
    model: string = 'llava'
  ) {
    this.baseUrl = baseUrl;
    this.model = model;
  }

  /**
   * Extract products and quantities from ticket image using Ollama LLaVA
   *
   * @param imageFile - Image file from user upload
   * @returns Extracted text in format "product_name | quantity" (one per line)
   * @throws Error if Ollama API fails or is unreachable
   */
  async extractText(imageFile: File): Promise<string> {
    try {
      // Convert File to base64
      const base64Data = await this.fileToBase64(imageFile);

      const prompt = this.buildPrompt();

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          prompt,
          images: [base64Data],
          stream: false, // Get complete response, not streaming
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Ollama API error: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();
      return result.response.trim();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error occurred during OCR processing');
    }
  }

  /**
   * Get the provider name for identification
   */
  getProviderName(): string {
    return 'ollama-llava';
  }

  /**
   * Convert File to base64 string (without data URI prefix)
   */
  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result as string;
        // Remove data URI prefix (data:image/jpeg;base64,)
        const base64 = result.includes(',') ? result.split(',')[1] : result;
        resolve(base64);
      };

      reader.onerror = () => reject(new Error('Failed to read file'));

      reader.readAsDataURL(file);
    });
  }

  /**
   * Build the prompt for Ollama to extract products from ticket
   */
  private buildPrompt(): string {
    return `Analyze this shopping receipt/ticket image and extract ONLY the products with their quantities.

IMPORTANT RULES:
1. Format each line as: "product_name | quantity"
2. Extract ONLY the purchased items (products bought)
3. Ignore prices, totals, store name, date, and other metadata
4. If quantity is not visible, assume 1
5. Use the exact product name as shown on the ticket
6. One product per line
7. Do NOT include explanations, just the data

Example output:
Leche Entera | 2
Pan de Molde | 1
Arroz Integral | 3
Tomates | 1

Now extract the products from the image:`;
  }
}
