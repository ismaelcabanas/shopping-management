import type { ProductRepository } from '../../domain/repositories/ProductRepository';
import type { Product } from '../../domain/model/Product';

export class GetAllProducts {
  private readonly productRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

  async execute(): Promise<Product[]> {
    return await this.productRepository.findAll();
  }
}