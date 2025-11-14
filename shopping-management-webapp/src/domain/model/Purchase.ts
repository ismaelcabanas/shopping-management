import { PurchaseId } from './PurchaseId';
import { PurchaseItem } from './PurchaseItem';

export class Purchase {
  public readonly id: PurchaseId;
  public readonly purchaseDate: Date;
  public readonly items: PurchaseItem[];

  constructor(
    id: PurchaseId,
    purchaseDate: Date,
    items: PurchaseItem[]
  ) {
    this.id = id;
    this.purchaseDate = purchaseDate;
    this.items = items;
  }

  get totalQuantity(): number {
    return this.items.reduce((sum, item) => sum + item.quantity.value, 0);
  }

  validate(): void {
    if (this.items.length === 0) {
      throw new Error('Purchase must have at least one item');
    }
  }
}
