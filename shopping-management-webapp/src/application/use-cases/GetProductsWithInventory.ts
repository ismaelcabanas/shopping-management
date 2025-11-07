import type { ProductRepository } from '../../domain/repositories/ProductRepository';
import type { InventoryRepository } from '../../domain/repositories/InventoryRepository';

export interface ProductWithInventory {
  id: string;
  name: string;
  quantity: number;
  unitType: string;
}

export class GetProductsWithInventory {
  private readonly productRepository: ProductRepository;
  private readonly inventoryRepository: InventoryRepository;

  constructor(
    productRepository: ProductRepository,
    inventoryRepository: InventoryRepository
  ) {
    this.productRepository = productRepository;
    this.inventoryRepository = inventoryRepository;
  }

  async execute(): Promise<ProductWithInventory[]> {
    // 1. Get all products
    const products = await this.productRepository.findAll();

    // 2. Get inventory for each product and combine information
    const productsWithInventory: ProductWithInventory[] = await Promise.all(
      products.map(async (product) => {
        const inventoryItem = await this.inventoryRepository.findByProductId(product.id);

        return {
          id: product.id.value,
          name: product.name,
          quantity: inventoryItem?.currentStock.value ?? 0,
          unitType: product.unitType.value,
        };
      })
    );

    // 3. Sort alphabetically by name
    productsWithInventory.sort((a, b) => a.name.localeCompare(b.name));

    // 4. Return combined data
    return productsWithInventory;
  }
}