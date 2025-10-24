import { Product } from '../model/Product';
import { ProductId } from '../model/ProductId';

export interface ProductRepository {
  save(product: Product): Promise<void>;
  findAll(): Promise<Product[]>;
  findById(id: ProductId): Promise<Product | null>;
  findByName(name: string): Promise<Product | null>;
}