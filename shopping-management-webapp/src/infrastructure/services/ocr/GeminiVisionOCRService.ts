import type { OCRService } from '../../../application/ports/OCRService';

/**
 * OCR Service using Google Gemini Vision API
 *
 * Requirements:
 * 1. Gemini API key (free tier: 60 requests/minute)
 * 2. Get your key at: https://makersuite.google.com/app/apikey
 *
 * Advantages:
 * - Free tier with generous limits (60 req/min)
 * - Excellent quality for text extraction
 * - Fast (<2 seconds per image)
 * - Cloud-based (no local resources needed)
 *
 * @see docs/architecture/ocr-providers.md for alternatives
 */
export class GeminiVisionOCRService implements OCRService {
  private readonly apiKey: string;
  private readonly model: string;
  private readonly apiUrl: string;

  /**
   * @param apiKey - Gemini API key
   * @param model - Model to use (default: gemini-2.0-flash)
   */
  constructor(
    apiKey: string,
    model: string = 'gemini-2.0-flash'
  ) {
    if (!apiKey) {
      throw new Error('Gemini API key is required');
    }
    this.apiKey = apiKey;
    this.model = model;
    this.apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent`;
  }

  /**
   * Extract products and quantities from ticket image using Gemini Vision
   *
   * @param imageFile - Image file from user upload
   * @returns Extracted text in format "product_name | quantity" (one per line)
   * @throws Error if Gemini API fails
   */
  async extractText(imageFile: File): Promise<string> {
    try {
      // Convert File to base64
      const base64Data = await this.fileToBase64(imageFile);

      const prompt = this.buildPrompt();

      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: prompt
              },
              {
                inline_data: {
                  mime_type: imageFile.type,
                  data: base64Data
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 2048
        }
      };

      const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Gemini API error: ${response.status} - ${errorData.error?.message || response.statusText}`
        );
      }

      const result = await response.json();

      // Extract text from Gemini response
      const extractedText = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!extractedText) {
        throw new Error('No text extracted from Gemini response');
      }

      return extractedText.trim();
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
    return 'gemini-vision';
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
   * Build the prompt for Gemini to extract products from ticket
   */
  private buildPrompt(): string {
    return `This is a grocery receipt document. Extract ONLY product names and quantities.

Format: product_name | quantity

Rules:
- Extract ONLY purchased items (products)
- Keep exact product names as shown (even if abbreviated)
- IMPORTANT: Detect quantity from multiple sources:
  * In product name: "LECHUGA 6U" → quantity = 6
  * Next line format: "6 Un x 0.97 €/un" → quantity = 6
  * Next line format: "4 x 1.50" → quantity = 4
  * If no quantity indicator, use 1
- Skip prices, dates, store name, totals, taxes, payment method
- One product per line in output
- NO explanations, ONLY data

Example output:
Leche Entera | 6
Lechuga 6U | 6
Pan | 1

Extract products:`;
  }
}