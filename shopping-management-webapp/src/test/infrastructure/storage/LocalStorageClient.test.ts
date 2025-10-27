import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { LocalStorageClient } from '../../../infrastructure/storage/LocalStorageClient';

describe('LocalStorageClient', () => {
  let client: LocalStorageClient;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    client = new LocalStorageClient();
  });

  afterEach(() => {
    // Clean up after each test
    localStorage.clear();
  });

  describe('get()', () => {
    it('should return the deserialized object when key exists', () => {
      // Arrange
      const data = { name: 'Test Product', quantity: 10 };
      localStorage.setItem('shopping_manager_test', JSON.stringify(data));

      // Act
      const result = client.get<typeof data>('test');

      // Assert
      expect(result).toEqual(data);
    });

    it('should return null when key does not exist', () => {
      // Act
      const result = client.get<string>('nonexistent');

      // Assert
      expect(result).toBeNull();
    });

    it('should return null when JSON is corrupted', () => {
      // Arrange
      localStorage.setItem('shopping_manager_test', 'invalid{json}');

      // Act
      const result = client.get<object>('test');

      // Assert
      expect(result).toBeNull();
    });

    it('should work with string values', () => {
      // Arrange
      localStorage.setItem('shopping_manager_test', JSON.stringify('hello'));

      // Act
      const result = client.get<string>('test');

      // Assert
      expect(result).toBe('hello');
    });

    it('should work with number values', () => {
      // Arrange
      localStorage.setItem('shopping_manager_test', JSON.stringify(42));

      // Act
      const result = client.get<number>('test');

      // Assert
      expect(result).toBe(42);
    });

    it('should work with array values', () => {
      // Arrange
      const data = [1, 2, 3, 4, 5];
      localStorage.setItem('shopping_manager_test', JSON.stringify(data));

      // Act
      const result = client.get<number[]>('test');

      // Assert
      expect(result).toEqual(data);
    });

    it('should work with complex nested objects', () => {
      // Arrange
      const data = {
        products: [
          { id: '1', name: 'Product 1' },
          { id: '2', name: 'Product 2' },
        ],
        metadata: { count: 2 },
      };
      localStorage.setItem('shopping_manager_test', JSON.stringify(data));

      // Act
      const result = client.get<typeof data>('test');

      // Assert
      expect(result).toEqual(data);
    });
  });

  describe('set()', () => {
    it('should save an object correctly', () => {
      // Arrange
      const data = { name: 'Leche', quantity: 5 };

      // Act
      client.set('test', data);

      // Assert
      const stored = localStorage.getItem('shopping_manager_test');
      expect(stored).toBe(JSON.stringify(data));
    });

    it('should save a string correctly', () => {
      // Act
      client.set('test', 'hello world');

      // Assert
      const stored = localStorage.getItem('shopping_manager_test');
      expect(stored).toBe(JSON.stringify('hello world'));
    });

    it('should save an array correctly', () => {
      // Arrange
      const data = [1, 2, 3];

      // Act
      client.set('test', data);

      // Assert
      const stored = localStorage.getItem('shopping_manager_test');
      expect(stored).toBe(JSON.stringify(data));
    });

    it('should overwrite existing values', () => {
      // Arrange
      client.set('test', 'first value');

      // Act
      client.set('test', 'second value');

      // Assert
      const result = client.get<string>('test');
      expect(result).toBe('second value');
    });

    it('should throw error when trying to save null', () => {
      // Act & Assert
      expect(() => client.set('test', null)).toThrow(
        'Cannot save null value. Use remove() to delete a key.'
      );
    });

    it('should throw error when trying to save undefined', () => {
      // Act & Assert
      expect(() => client.set('test', undefined)).toThrow(
        'Cannot save undefined value. Use remove() to delete a key.'
      );
    });
  });

  describe('remove()', () => {
    it('should remove an existing key', () => {
      // Arrange
      client.set('test', 'value');
      expect(client.get<string>('test')).toBe('value');

      // Act
      client.remove('test');

      // Assert
      expect(client.get<string>('test')).toBeNull();
    });

    it('should not fail when removing a non-existent key', () => {
      // Act & Assert
      expect(() => client.remove('nonexistent')).not.toThrow();
    });
  });

  describe('clear()', () => {
    it('should remove all keys with the app prefix', () => {
      // Arrange
      client.set('key1', 'value1');
      client.set('key2', 'value2');
      client.set('key3', 'value3');

      // Act
      client.clear();

      // Assert
      expect(client.get<string>('key1')).toBeNull();
      expect(client.get<string>('key2')).toBeNull();
      expect(client.get<string>('key3')).toBeNull();
    });

    it('should not remove keys from other apps', () => {
      // Arrange
      client.set('our_key', 'our_value');
      localStorage.setItem('other_app_key', 'other_value');

      // Act
      client.clear();

      // Assert
      expect(client.get<string>('our_key')).toBeNull();
      expect(localStorage.getItem('other_app_key')).toBe('other_value');
    });
  });

  describe('prefix handling', () => {
    it('should automatically add prefix to keys', () => {
      // Act
      client.set('mykey', 'myvalue');

      // Assert
      const rawKey = localStorage.getItem('shopping_manager_mykey');
      expect(rawKey).toBe(JSON.stringify('myvalue'));
    });

    it('should handle the prefix transparently for get operations', () => {
      // Arrange
      localStorage.setItem('shopping_manager_test', JSON.stringify('direct'));

      // Act
      const result = client.get<string>('test');

      // Assert
      expect(result).toBe('direct');
    });
  });
});