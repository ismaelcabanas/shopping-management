import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { OllamaVisionOCRService } from '../../../infrastructure/services/ocr/OllamaVisionOCRService';

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Helper to create mock File
function createMockFile(content: string = 'mock-image-data'): File {
  return new File([content], 'ticket.jpg', { type: 'image/jpeg' });
}

// Mock FileReader
class MockFileReader implements Partial<FileReader> {
  result: string | ArrayBuffer | null = null;
  onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => void) | null = null;
  onerror: ((this: FileReader, ev: ProgressEvent<FileReader>) => void) | null = null;
  DONE = 2 as const;
  EMPTY = 0 as const;
  LOADING = 1 as const;
  error: DOMException | null = null;
  readyState: 0 | 1 | 2 = 0;

  readAsDataURL() {
    // Simulate successful read with base64 data
    setTimeout(() => {
      this.result = 'data:image/jpeg;base64,/9j/4AAQSkZJRg==';
      if (this.onload) {
        this.onload.call(this as unknown as FileReader, {} as ProgressEvent<FileReader>);
      }
    }, 0);
  }

  abort(): void {}
  readAsArrayBuffer(): void {}
  readAsBinaryString(): void {}
  readAsText(): void {}
  addEventListener(): void {}
  removeEventListener(): void {}
  dispatchEvent(): boolean { return true; }
}

describe('OllamaVisionOCRService', () => {
  let service: OllamaVisionOCRService;
  let originalFileReader: typeof FileReader;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new OllamaVisionOCRService();

    // Mock FileReader
    originalFileReader = global.FileReader;
    global.FileReader = MockFileReader as unknown as typeof FileReader;
  });

  afterEach(() => {
    // Restore FileReader
    global.FileReader = originalFileReader;
  });

  it('should extract text from image using Ollama API', async () => {
    // Arrange
    const imageFile = createMockFile();
    const expectedResponse = {
      response: 'Leche | 2\nPan | 3\nArroz | 1',
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => expectedResponse,
    });

    // Act
    const result = await service.extractText(imageFile);

    // Assert
    expect(result).toBe('Leche | 2\nPan | 3\nArroz | 1');
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:11434/api/generate',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
    );
  });

  it('should send correct prompt to Ollama', async () => {
    // Arrange
    const imageFile = createMockFile();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: 'Test' }),
    });

    // Act
    await service.extractText(imageFile);

    // Assert
    const callArgs = mockFetch.mock.calls[0][1];
    const requestBody = JSON.parse(callArgs.body);

    expect(requestBody.model).toBe('llava');
    expect(requestBody.stream).toBe(false);
    expect(requestBody.prompt).toContain('shopping receipt');
    expect(requestBody.prompt).toContain('product_name | quantity');
  });

  it('should convert File to base64 and send to Ollama', async () => {
    // Arrange
    const imageFile = createMockFile();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: 'Test' }),
    });

    // Act
    await service.extractText(imageFile);

    // Assert
    const callArgs = mockFetch.mock.calls[0][1];
    const requestBody = JSON.parse(callArgs.body);

    // Should extract only the base64 part (without data:image/jpeg;base64, prefix)
    expect(requestBody.images).toHaveLength(1);
    expect(requestBody.images[0]).toBe('/9j/4AAQSkZJRg==');
  });

  it('should throw error when Ollama API fails', async () => {
    // Arrange
    const imageFile = createMockFile();
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    // Act & Assert
    await expect(service.extractText(imageFile)).rejects.toThrow(
      'Ollama API error: 500 Internal Server Error'
    );
  });

  it('should throw error when network fails', async () => {
    // Arrange
    const imageFile = createMockFile();
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    // Act & Assert
    await expect(service.extractText(imageFile)).rejects.toThrow('Network error');
  });

  it('should throw error when FileReader fails', async () => {
    // Arrange
    const imageFile = createMockFile();

    // Mock FileReader to fail
    class FailingMockFileReader implements Partial<FileReader> {
      result = null;
      onload = null;
      onerror: ((this: FileReader, ev: ProgressEvent<FileReader>) => void) | null = null;
      DONE = 2 as const;
      EMPTY = 0 as const;
      LOADING = 1 as const;
      error: DOMException | null = null;
      readyState: 0 | 1 | 2 = 0;

      readAsDataURL() {
        setTimeout(() => {
          if (this.onerror) {
            this.onerror.call(this as unknown as FileReader, {} as ProgressEvent<FileReader>);
          }
        }, 0);
      }

      abort(): void {}
      readAsArrayBuffer(): void {}
      readAsBinaryString(): void {}
      readAsText(): void {}
      addEventListener(): void {}
      removeEventListener(): void {}
      dispatchEvent(): boolean { return true; }
    }

    global.FileReader = FailingMockFileReader as unknown as typeof FileReader;

    // Act & Assert
    await expect(service.extractText(imageFile)).rejects.toThrow('Failed to read file');
  });

  it('should use configurable Ollama URL', async () => {
    // Arrange
    const customUrl = 'http://custom-ollama:8080';
    const customService = new OllamaVisionOCRService(customUrl);
    const imageFile = createMockFile();

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: 'Test' }),
    });

    // Act
    await customService.extractText(imageFile);

    // Assert
    expect(mockFetch).toHaveBeenCalledWith(
      'http://custom-ollama:8080/api/generate',
      expect.any(Object)
    );
  });

  it('should use configurable model name', async () => {
    // Arrange
    const service = new OllamaVisionOCRService(undefined, 'llava:13b');
    const imageFile = createMockFile();

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: 'Test' }),
    });

    // Act
    await service.extractText(imageFile);

    // Assert
    const callArgs = mockFetch.mock.calls[0][1];
    const requestBody = JSON.parse(callArgs.body);

    expect(requestBody.model).toBe('llava:13b');
  });

  it('should trim whitespace from response', async () => {
    // Arrange
    const imageFile = createMockFile();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: '  \n Leche | 2 \n\n  ' }),
    });

    // Act
    const result = await service.extractText(imageFile);

    // Assert
    expect(result).toBe('Leche | 2');
  });

  it('should return provider name', () => {
    // Act
    const providerName = service.getProviderName();

    // Assert
    expect(providerName).toBe('ollama-llava');
  });
});
