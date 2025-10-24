import { ProductId } from './ProductId';
import { UnitType } from './UnitType';

export class Product {
  private readonly _id: ProductId;
  private readonly _name: string;
  private readonly _unitType: UnitType;

  constructor(id: ProductId, name: string, unitType: UnitType) {
    if (!name || name.trim() === '') {
      throw new Error('Product name cannot be empty');
    }

    if (name.trim().length < 2) {
      throw new Error('Product name must be at least 2 characters');
    }

    this._id = id;
    this._name = name;
    this._unitType = unitType;
  }

  get id(): ProductId {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get unitType(): UnitType {
    return this._unitType;
  }
}