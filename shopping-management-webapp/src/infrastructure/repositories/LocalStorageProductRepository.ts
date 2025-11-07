import type { ProductRepository } from '../../domain/repositories/ProductRepository';
import { Product } from '../../domain/model/Product';
import { ProductId } from '../../domain/model/ProductId';
import { UnitType } from '../../domain/model/UnitType';
import { LocalStorageClient } from '../storage/LocalStorageClient';

interface ProductDTO {
  id: string;
  name: string;
  unitType: string;
}

export class LocalStorageProductRepository implements ProductRepository {
  private readonly storageKey = 'products';
  private readonly storage: LocalStorageClient;

  constructor() {
    this.storage = new LocalStorageClient();
  }

  async save(product: Product): Promise<void> {
    const products = await this.findAll();

    // Check if product with same id already exists
    const existingIndex = products.findIndex(p => p.id.equals(product.id));

    if (existingIndex >= 0) {
      // Update existing product
      products[existingIndex] = product;
    } else {
      // Add new product
      products.push(product);
    }

    // Convert to DTOs and save
    const dtos = products.map(p => this.toDTO(p));
    this.storage.set(this.storageKey, dtos);
  }

  async findAll(): Promise<Product[]> {
    const dtos = this.storage.get<ProductDTO[]>(this.storageKey);

    if (!dtos) {
      return [];
    }

    return dtos.map(dto => this.fromDTO(dto));
  }

  async findById(id: ProductId): Promise<Product | null> {
    const products = await this.findAll();
    return products.find(p => p.id.equals(id)) || null;
  }

  async findByName(name: string): Promise<Product | null> {
    const products = await this.findAll();
    return products.find(p => p.name.toLowerCase() === name.toLowerCase()) || null;
  }

  async delete(id: ProductId): Promise<void> {
    const products = await this.findAll();
    const index = products.findIndex(p => p.id.equals(id));

    if (index === -1) {
      throw new Error('Product not found');
    }

    products.splice(index, 1);

    // Convert to DTOs and save
    const dtos = products.map(p => this.toDTO(p));
    this.storage.set(this.storageKey, dtos);
  }

  private toDTO(product: Product): ProductDTO {
    return {
      id: product.id.value,
      name: product.name,
      unitType: product.unitType.value,
    };
  }

  private fromDTO(dto: ProductDTO): Product {
    const productId = ProductId.fromString(dto.id);
    const unitType = UnitType.create(dto.unitType);
    return new Product(productId, dto.name, unitType);
  }
}