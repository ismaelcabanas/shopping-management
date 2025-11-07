import type { ProductRepository } from '../../domain/repositories/ProductRepository';
import { ProductId } from '../../domain/model/ProductId';

export class DeleteProduct {
  private readonly productRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

  async execute(productId: string): Promise<void> {
    // 1. Validate and create ProductId
    const id = ProductId.fromString(productId);

    // 2. Verify product exists
    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new Error('Product not found');
    }

    // 3. Delete the product
    await this.productRepository.delete(id);
  }
}
