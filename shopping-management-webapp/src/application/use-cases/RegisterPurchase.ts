import type { ProductRepository } from '../../domain/repositories/ProductRepository';
import type { InventoryRepository } from '../../domain/repositories/InventoryRepository';
import { Purchase } from '../../domain/model/Purchase';
import { PurchaseId } from '../../domain/model/PurchaseId';
import { PurchaseItem } from '../../domain/model/PurchaseItem';
import { ProductId } from '../../domain/model/ProductId';
import { Quantity } from '../../domain/model/Quantity';
import { InventoryItem } from '../../domain/model/InventoryItem';

export interface PurchaseItemInput {
  productId: string;
  quantity: number;
}

export interface RegisterPurchaseCommand {
  items: PurchaseItemInput[];
}

export class RegisterPurchase {
  private readonly productRepository: ProductRepository;
  private readonly inventoryRepository: InventoryRepository;

  constructor(
    productRepository: ProductRepository,
    inventoryRepository: InventoryRepository
  ) {
    this.productRepository = productRepository;
    this.inventoryRepository = inventoryRepository;
  }

  async execute(command: RegisterPurchaseCommand): Promise<void> {
    // Validate that there are items
    if (command.items.length === 0) {
      throw new Error('Purchase must have at least one item');
    }

    // Create Purchase entity for domain validations
    const purchaseItems = await Promise.all(
      command.items.map(async item => {
        const productId = ProductId.fromString(item.productId);

        // Verify that the product exists
        const product = await this.productRepository.findById(productId);
        if (!product) {
          throw new Error(`Product with id ${item.productId} not found`);
        }

        return new PurchaseItem(
          productId,
          Quantity.create(item.quantity)
        );
      })
    );

    const purchase = new Purchase(
      PurchaseId.generate(),
      new Date(),
      purchaseItems
    );

    purchase.validate();

    // Update inventory for each product
    for (const purchaseItem of purchase.items) {
      const product = await this.productRepository.findById(purchaseItem.productId);
      if (!product) continue;

      const existingInventory = await this.inventoryRepository.findByProductId(
        purchaseItem.productId
      );

      if (existingInventory) {
        // Sum quantity to existing inventory
        const newQuantity = Quantity.create(
          existingInventory.currentStock.value + purchaseItem.quantity.value
        );
        const updatedInventory = new InventoryItem(
          existingInventory.productId,
          newQuantity,
          existingInventory.unitType
        );
        await this.inventoryRepository.save(updatedInventory);
      } else {
        // Create new inventory
        const newInventory = new InventoryItem(
          purchaseItem.productId,
          purchaseItem.quantity,
          product.unitType
        );
        await this.inventoryRepository.save(newInventory);
      }
    }
  }
}
