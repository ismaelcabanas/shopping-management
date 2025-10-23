import type { ProductRepository } from '../../domain/repositories/ProductRepository';
import type { InventoryRepository } from '../../domain/repositories/InventoryRepository';
import { Product } from '../../domain/model/Product';
import { ProductId } from '../../domain/model/ProductId';
import { UnitType } from '../../domain/model/UnitType';
import { Quantity } from '../../domain/model/Quantity';
import { InventoryItem } from '../../domain/model/InventoryItem';

export interface AddProductToInventoryCommand {
  id: string;
  name: string;
  initialQuantity: number;
}

export class AddProductToInventory {
  private readonly productRepository: ProductRepository;
  private readonly inventoryRepository: InventoryRepository;

  constructor(
    productRepository: ProductRepository,
    inventoryRepository: InventoryRepository
  ) {
    this.productRepository = productRepository;
    this.inventoryRepository = inventoryRepository;
  }

  async execute(command: AddProductToInventoryCommand): Promise<Product> {
    // 1. Check if product with same name already exists (efficient query)
    const existingProduct = await this.productRepository.findByName(command.name);

    if (existingProduct) {
      throw new Error(`Product with name "${command.name}" already exists`);
    }

    // 2. Create ProductId from command (validates UUID format)
    const productId = ProductId.fromString(command.id);

    // 3. Create UnitType (only "units" supported in iteration 1)
    const unitType = UnitType.units();

    // 4. Create Product entity (validates name)
    const product = new Product(productId, command.name, unitType);

    // 5. Save Product to repository
    await this.productRepository.save(product);

    // 6. Create Quantity (validates >= 0)
    const initialQuantity = Quantity.create(command.initialQuantity);

    // 7. Create InventoryItem
    const inventoryItem = new InventoryItem(productId, initialQuantity, unitType);

    // 8. Save InventoryItem to repository
    await this.inventoryRepository.save(inventoryItem);

    // 9. Return created Product
    return product;
  }
}