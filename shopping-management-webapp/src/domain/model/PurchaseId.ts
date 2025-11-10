import { v4 as uuidv4 } from 'uuid';

export class PurchaseId {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static generate(): PurchaseId {
    return new PurchaseId(uuidv4());
  }

  static fromString(uuid: string): PurchaseId {
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(uuid)) {
      throw new Error('Invalid UUID format');
    }

    return new PurchaseId(uuid);
  }

  get value(): string {
    return this._value;
  }

  equals(other: PurchaseId): boolean {
    return this._value === other._value;
  }
}
