// Value Object: Unit
export class Unit {
  private static readonly VALID_UNITS = ['ud', 'kg', 'L', 'g', 'ml'] as const;

  private constructor(private readonly value: string) {
    if (!Unit.VALID_UNITS.includes(value as any)) {
      throw new Error(`Invalid unit: ${value}. Valid units: ${Unit.VALID_UNITS.join(', ')}`);
    }
  }

  static create(value: string): Unit {
    return new Unit(value);
  }

  static units(): Unit {
    return new Unit('ud');
  }

  static kilograms(): Unit {
    return new Unit('kg');
  }

  static liters(): Unit {
    return new Unit('L');
  }

  static grams(): Unit {
    return new Unit('g');
  }

  static milliliters(): Unit {
    return new Unit('ml');
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Unit): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  static getValidUnits(): readonly string[] {
    return Unit.VALID_UNITS;
  }
}