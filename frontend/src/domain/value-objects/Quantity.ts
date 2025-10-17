// Value Object: Quantity
export class Quantity {
  private constructor(private readonly value: number) {
    if (value <= 0) {
      throw new Error('Quantity must be positive');
    }
    if (!Number.isInteger(value)) {
      throw new Error('Quantity must be an integer');
    }
  }

  static create(value: number): Quantity {
    return new Quantity(value);
  }

  static fromString(value: string): Quantity {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) {
      throw new Error(`Invalid quantity: ${value}`);
    }
    return new Quantity(numValue);
  }

  getValue(): number {
    return this.value;
  }

  add(other: Quantity): Quantity {
    return new Quantity(this.value + other.value);
  }

  subtract(other: Quantity): Quantity {
    const result = this.value - other.value;
    if (result <= 0) {
      throw new Error('Resulting quantity must be positive');
    }
    return new Quantity(result);
  }

  equals(other: Quantity): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value.toString();
  }
}