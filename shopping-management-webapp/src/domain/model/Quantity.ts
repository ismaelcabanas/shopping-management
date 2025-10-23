export class Quantity {
  private readonly _value: number;

  private constructor(value: number) {
    this._value = value;
  }

  static create(value: number): Quantity {
    if (value < 0) {
      throw new Error('Quantity cannot be negative');
    }
    return new Quantity(value);
  }

  get value(): number {
    return this._value;
  }
}