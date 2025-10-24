export class UnitType {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static units(): UnitType {
    return new UnitType('units');
  }

  static create(value: string): UnitType {
    if (value !== 'units') {
      throw new Error('Only "units" is supported in this iteration');
    }
    return new UnitType(value);
  }

  get value(): string {
    return this._value;
  }
}