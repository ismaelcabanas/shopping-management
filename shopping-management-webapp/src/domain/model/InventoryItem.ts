import { ProductId } from './ProductId';
import { Quantity } from './Quantity';
import { UnitType } from './UnitType';
import { StockLevel } from './StockLevel';

export class InventoryItem {
  private readonly _productId: ProductId;
  private readonly _currentStock: Quantity;
  private readonly _unitType: UnitType;
  private readonly _stockLevel: StockLevel;
  private readonly _lastUpdated: Date;

  constructor(
    productId: ProductId,
    currentStock: Quantity,
    unitType: UnitType,
    stockLevel?: StockLevel,
    lastUpdated?: Date
  ) {
    this._productId = productId;
    this._currentStock = currentStock;
    this._unitType = unitType;
    this._stockLevel = stockLevel ?? StockLevel.create('high');
    this._lastUpdated = lastUpdated ?? new Date();
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

  get stockLevel(): StockLevel {
    return this._stockLevel;
  }

  get lastUpdated(): Date {
    return this._lastUpdated;
  }

  updateStock(newQuantity: Quantity): InventoryItem {
    return new InventoryItem(
      this._productId,
      newQuantity,
      this._unitType,
      StockLevel.create('high'),
      new Date()
    );
  }

  updateStockLevel(newLevel: StockLevel): InventoryItem {
    return new InventoryItem(this._productId, this._currentStock, this._unitType, newLevel, new Date());
  }
}