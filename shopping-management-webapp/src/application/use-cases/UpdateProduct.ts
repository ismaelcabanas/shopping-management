import type { ProductRepository } from '../../domain/repositories/ProductRepository';
import { Product } from '../../domain/model/Product';
import { ProductId } from '../../domain/model/ProductId';
import { UnitType } from '../../domain/model/UnitType';

export interface UpdateProductCommand {
  id: string;
  name: string;
  unitType: string;
}

export class UpdateProduct {
  private readonly productRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

  async execute(command: UpdateProductCommand): Promise<void> {
    // 1. Verify product exists
    const productId = ProductId.fromString(command.id);
    const existingProduct = await this.productRepository.findById(productId);

    if (!existingProduct) {
      throw new Error('Product not found');
    }

    // 2. Check for duplicate name (if name changed)
    if (existingProduct.name.toLowerCase() !== command.name.toLowerCase()) {
      const duplicateProduct = await this.productRepository.findByName(command.name);
      if (duplicateProduct && !duplicateProduct.id.equals(productId)) {
        throw new Error('Product name already exists');
      }
    }

    // 3. Create updated product (validations happen in constructor)
    const unitType = UnitType.fromString(command.unitType);
    const updatedProduct = new Product(productId, command.name, unitType);

    // 4. Save updated product (save method works as upsert)
    await this.productRepository.save(updatedProduct);
  }
}