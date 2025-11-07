export class UnitType {
  private readonly _value: string;
  private static readonly VALID_UNITS = ['units', 'kg', 'liters'];

  private constructor(value: string) {
    this._value = value;
  }

  static units(): UnitType {
    return new UnitType('units');
  }

  static kg(): UnitType {
    return new UnitType('kg');
  }

  static liters(): UnitType {
    return new UnitType('liters');
  }

  static create(value: string): UnitType {
    if (!UnitType.VALID_UNITS.includes(value)) {
      throw new Error(`Invalid unit type: ${value}. Valid units are: ${UnitType.VALID_UNITS.join(', ')}`);
    }
    return new UnitType(value);
  }

  static fromString(value: string): UnitType {
    return UnitType.create(value);
  }

  get value(): string {
    return this._value;
  }
}