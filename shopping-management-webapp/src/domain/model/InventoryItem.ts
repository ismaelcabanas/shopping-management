import { ProductId } from './ProductId';
import { Quantity } from './Quantity';
import { UnitType } from './UnitType';

export class InventoryItem {
  private readonly _productId: ProductId;
  private readonly _currentStock: Quantity;
  private readonly _unitType: UnitType;

  constructor(productId: ProductId, currentStock: Quantity, unitType: UnitType) {
    this._productId = productId;
    this._currentStock = currentStock;
    this._unitType = unitType;
  }

  get productId(): ProductId {
    return this._productId;
  }

  get currentStock(): Quantity {
    return this._currentStock;
  }

  get unitType(): UnitType {
    return this._unitType;
  }

  updateStock(newQuantity: Quantity): InventoryItem {
    return new InventoryItem(this._productId, newQuantity, this._unitType);
  }
}