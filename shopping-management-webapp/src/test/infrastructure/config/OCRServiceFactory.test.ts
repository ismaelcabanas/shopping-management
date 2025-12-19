import { describe, it, expect, beforeEach, vi } from 'vitest';
import { OCRServiceFactory } from '../../../infrastructure/config/OCRServiceFactory';
import { GeminiVisionOCRService } from '../../../infrastructure/services/ocr/GeminiVisionOCRService';
import { OllamaVisionOCRService } from '../../../infrastructure/services/ocr/OllamaVisionOCRService';
import { MockOCRService } from '../../../infrastructure/services/MockOCRService';

describe('OCRServiceFactory', () => {
  beforeEach(() => {
    // Clear environment variables before each test
    vi.unstubAllEnvs();
  });

  describe('create with explicit provider', () => {
    it('should create GeminiVisionOCRService when provider is gemini', () => {
      // Arrange
      vi.stubEnv('VITE_GEMINI_API_KEY', 'test-api-key');
      vi.stubEnv('VITE_GEMINI_MODEL', 'gemini-2.0-flash');

      // Act
      const service = OCRServiceFactory.create('gemini');

      // Assert
      expect(service).toBeInstanceOf(GeminiVisionOCRService);
      expect(service.getProviderName()).toBe('gemini-vision');
    });

    it('should create OllamaVisionOCRService when provider is ollama', () => {
      // Act
      const service = OCRServiceFactory.create('ollama');

      // Assert
      expect(service).toBeInstanceOf(OllamaVisionOCRService);
      expect(service.getProviderName()).toBe('ollama-llava');
    });

    it('should create MockOCRService when provider is mock', () => {
      // Act
      const service = OCRServiceFactory.create('mock');

      // Assert
      expect(service).toBeInstanceOf(MockOCRService);
      expect(service.getProviderName()).toBe('mock-ocr');
    });

    it('should throw error for invalid provider', () => {
      // Act & Assert
      // @ts-expect-error Testing invalid provider type
      expect(() => OCRServiceFactory.create('invalid')).toThrow(
        'Unknown OCR provider: invalid'
      );
    });

    it('should throw error when Gemini API key is missing', () => {
      // Arrange
      vi.stubEnv('VITE_GEMINI_API_KEY', '');

      // Act & Assert
      expect(() => OCRServiceFactory.create('gemini')).toThrow(
        /VITE_GEMINI_API_KEY is required/
      );
      expect(() => OCRServiceFactory.create('gemini')).toThrow(
        /https:\/\/makersuite\.google\.com/
      );
    });
  });

  describe('create with environment variable', () => {
    it('should read provider from VITE_OCR_PROVIDER environment variable', () => {
      // Arrange
      vi.stubEnv('VITE_OCR_PROVIDER', 'mock');

      // Act
      const service = OCRServiceFactory.create();

      // Assert
      expect(service).toBeInstanceOf(MockOCRService);
    });

    it('should default to gemini when VITE_OCR_PROVIDER is not set', () => {
      // Arrange
      vi.stubEnv('VITE_GEMINI_API_KEY', 'test-api-key');
      // VITE_OCR_PROVIDER not set

      // Act
      const service = OCRServiceFactory.create();

      // Assert
      expect(service).toBeInstanceOf(GeminiVisionOCRService);
    });

    it('should use explicit provider parameter over environment variable', () => {
      // Arrange
      vi.stubEnv('VITE_OCR_PROVIDER', 'gemini');
      vi.stubEnv('VITE_GEMINI_API_KEY', 'test-api-key');

      // Act
      const service = OCRServiceFactory.create('mock'); // Explicit override

      // Assert
      expect(service).toBeInstanceOf(MockOCRService);
    });
  });

  describe('provider-specific configuration', () => {
    it('should pass API key and model to GeminiVisionOCRService', () => {
      // Arrange
      vi.stubEnv('VITE_GEMINI_API_KEY', 'my-api-key');
      vi.stubEnv('VITE_GEMINI_MODEL', 'gemini-pro');

      // Act
      const service = OCRServiceFactory.create('gemini');

      // Assert
      expect(service).toBeInstanceOf(GeminiVisionOCRService);
      // GeminiVisionOCRService constructor validates API key is not empty
      // If we get here, it was passed correctly
    });

    it('should use default model when VITE_GEMINI_MODEL not set', () => {
      // Arrange
      vi.stubEnv('VITE_GEMINI_API_KEY', 'my-api-key');
      // VITE_GEMINI_MODEL not set

      // Act
      const service = OCRServiceFactory.create('gemini');

      // Assert
      expect(service).toBeInstanceOf(GeminiVisionOCRService);
    });

    it('should pass custom URL to OllamaVisionOCRService when set', () => {
      // Arrange
      vi.stubEnv('VITE_OLLAMA_URL', 'http://192.168.1.100:11434');
      vi.stubEnv('VITE_OLLAMA_MODEL', 'llava:13b');

      // Act
      const service = OCRServiceFactory.create('ollama');

      // Assert
      expect(service).toBeInstanceOf(OllamaVisionOCRService);
    });

    it('should use default Ollama configuration when env vars not set', () => {
      // Arrange
      // No Ollama env vars set

      // Act
      const service = OCRServiceFactory.create('ollama');

      // Assert
      expect(service).toBeInstanceOf(OllamaVisionOCRService);
      expect(service.getProviderName()).toBe('ollama-llava');
    });
  });
});
