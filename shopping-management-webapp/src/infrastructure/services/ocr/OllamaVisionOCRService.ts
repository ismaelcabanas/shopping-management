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
    return `You are a helpful shopping assistant analyzing a grocery receipt for personal inventory management.

Task: Extract ONLY product names and quantities from this receipt. This is the user's own receipt for their personal shopping list app.

Output format (one per line):
product_name | quantity

Rules:
- Only extract product names and quantities
- Skip prices, dates, store info, totals
- If no quantity shown, use 1
- Use exact product names from receipt
- No explanations, just data

Example:
Milk | 2
Bread | 1
Rice | 3

Extract products:`;
  }
}
