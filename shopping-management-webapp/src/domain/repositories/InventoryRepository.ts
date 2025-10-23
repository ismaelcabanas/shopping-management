import { InventoryItem } from '../model/InventoryItem';
import { ProductId } from '../model/ProductId';

export interface InventoryRepository {
  save(item: InventoryItem): Promise<void>;
  findByProductId(productId: ProductId): Promise<InventoryItem | null>;
  findAll(): Promise<InventoryItem[]>;
}