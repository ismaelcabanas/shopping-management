export class ProductId {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static fromString(uuid: string): ProductId {
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(uuid)) {
      throw new Error('Invalid UUID format');
    }

    return new ProductId(uuid);
  }

  get value(): string {
    return this._value;
  }

  equals(other: ProductId): boolean {
    return this._value === other._value;
  }
}