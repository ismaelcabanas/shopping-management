export class LocalStorageClient {
  private readonly prefix = 'shopping_manager_';

  /**
   * Get a value from localStorage by key
   * @param key - The key without prefix
   * @returns The deserialized value or null if not found or corrupted
   */
  get<T>(key: string): T | null {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      const item = localStorage.getItem(prefixedKey);

      if (item === null) {
        return null;
      }

      return JSON.parse(item) as T;
    } catch {
      // If JSON is corrupted, return null
      return null;
    }
  }

  /**
   * Set a value in localStorage
   * @param key - The key without prefix
   * @param value - The value to store (cannot be null or undefined)
   * @throws Error if value is null or undefined
   */
  set<T>(key: string, value: T): void {
    if (value === null) {
      throw new Error('Cannot save null value. Use remove() to delete a key.');
    }

    if (value === undefined) {
      throw new Error('Cannot save undefined value. Use remove() to delete a key.');
    }

    const prefixedKey = this.getPrefixedKey(key);
    const serialized = JSON.stringify(value);
    localStorage.setItem(prefixedKey, serialized);
  }

  /**
   * Remove a key from localStorage
   * @param key - The key without prefix
   */
  remove(key: string): void {
    const prefixedKey = this.getPrefixedKey(key);
    localStorage.removeItem(prefixedKey);
  }

  /**
   * Clear all keys with the app prefix from localStorage
   * This will not affect keys from other applications
   */
  clear(): void {
    const keysToRemove: string[] = [];

    // Find all keys with our prefix
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.prefix)) {
        keysToRemove.push(key);
      }
    }

    // Remove all found keys
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }

  /**
   * Get the prefixed key for internal use
   * @param key - The key without prefix
   * @returns The key with app prefix
   */
  private getPrefixedKey(key: string): string {
    return `${this.prefix}${key}`;
  }
}