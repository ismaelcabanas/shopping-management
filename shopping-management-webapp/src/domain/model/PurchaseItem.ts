import { ProductId } from './ProductId';
import { Quantity } from './Quantity';

export class PurchaseItem {
  public readonly productId: ProductId;
  public readonly quantity: Quantity;

  constructor(
    productId: ProductId,
    quantity: Quantity
  ) {
    if (quantity.value <= 0) {
      throw new Error('Purchase quantity must be greater than 0');
    }
    this.productId = productId;
    this.quantity = quantity;
  }
}
