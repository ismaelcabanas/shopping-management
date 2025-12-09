export type StockLevelValue = 'high' | 'medium' | 'low' | 'empty'

export class StockLevel {
  private readonly _value: StockLevelValue

  private constructor(value: StockLevelValue) {
    this._value = value
  }

  static create(value: string): StockLevel {
    if (!this.isValid(value)) {
      throw new Error('Invalid stock level')
    }
    return new StockLevel(value as StockLevelValue)
  }

  private static isValid(value: string): boolean {
    return ['high', 'medium', 'low', 'empty'].includes(value)
  }

  get value(): StockLevelValue {
    return this._value
  }

  equals(other: StockLevel): boolean {
    return this._value === other._value
  }

  toString(): string {
    return this._value
  }
}