import type { InventoryRepository } from '../../domain/repositories/InventoryRepository';
import { InventoryItem } from '../../domain/model/InventoryItem';
import { ProductId } from '../../domain/model/ProductId';
import { Quantity } from '../../domain/model/Quantity';
import { UnitType } from '../../domain/model/UnitType';
import { LocalStorageClient } from '../storage/LocalStorageClient';

interface InventoryItemDTO {
  productId: string;
  currentStock: number;
  unitType: string;
}

export class LocalStorageInventoryRepository implements InventoryRepository {
  private readonly storageKey = 'inventory';
  private readonly storage: LocalStorageClient;

  constructor() {
    this.storage = new LocalStorageClient();
  }

  async save(item: InventoryItem): Promise<void> {
    const items = await this.findAll();

    // Check if item with same productId already exists
    const existingIndex = items.findIndex(i => i.productId.equals(item.productId));

    if (existingIndex >= 0) {
      // Update existing item
      items[existingIndex] = item;
    } else {
      // Add new item
      items.push(item);
    }

    // Convert to DTOs and save
    const dtos = items.map(i => this.toDTO(i));
    this.storage.set(this.storageKey, dtos);
  }

  async findAll(): Promise<InventoryItem[]> {
    const dtos = this.storage.get<InventoryItemDTO[]>(this.storageKey);

    if (!dtos) {
      return [];
    }

    return dtos.map(dto => this.fromDTO(dto));
  }

  async findByProductId(productId: ProductId): Promise<InventoryItem | null> {
    const items = await this.findAll();
    return items.find(i => i.productId.equals(productId)) || null;
  }

  private toDTO(item: InventoryItem): InventoryItemDTO {
    return {
      productId: item.productId.value,
      currentStock: item.currentStock.value,
      unitType: item.unitType.value,
    };
  }

  private fromDTO(dto: InventoryItemDTO): InventoryItem {
    const productId = ProductId.fromString(dto.productId);
    const quantity = Quantity.create(dto.currentStock);
    const unitType = UnitType.create(dto.unitType);
    return new InventoryItem(productId, quantity, unitType);
  }
}