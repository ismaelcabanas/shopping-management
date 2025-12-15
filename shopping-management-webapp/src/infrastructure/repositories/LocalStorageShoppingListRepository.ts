import type { ShoppingListRepository } from '../../domain/repositories/ShoppingListRepository'
import type { ShoppingListItem, StockLevelValue } from '../../domain/model/ShoppingListItem'
import type { ProductId } from '../../domain/model/ProductId'
import { ProductId as ProductIdClass } from '../../domain/model/ProductId'
import { ShoppingListItem as ShoppingListItemClass } from '../../domain/model/ShoppingListItem'
import { LocalStorageClient } from '../storage/LocalStorageClient'

interface ShoppingListItemDTO {
  productId: string
  reason: 'auto' | 'manual'
  stockLevel?: StockLevelValue
  addedAt: string
  checked?: boolean
}

export class LocalStorageShoppingListRepository implements ShoppingListRepository {
  private readonly STORAGE_KEY = 'shopping-list'
  private readonly storage: LocalStorageClient

  constructor() {
    this.storage = new LocalStorageClient()
  }

  async findAll(): Promise<ShoppingListItem[]> {
    const items = this.storage.get<ShoppingListItemDTO[]>(this.STORAGE_KEY)
    if (!items) {
      return []
    }

    return items.map(dto => this.dtoToDomain(dto))
  }

  async findByProductId(productId: ProductId): Promise<ShoppingListItem | null> {
    const items = await this.findAll()
    return items.find(item => item.productId.equals(productId)) || null
  }

  async add(item: ShoppingListItem): Promise<void> {
    const items = await this.findAll()

    // Remove existing item if present (to update)
    const filteredItems = items.filter(
      existingItem => !existingItem.productId.equals(item.productId)
    )

    filteredItems.push(item)

    this.save(filteredItems)
  }

  async remove(productId: ProductId): Promise<void> {
    const items = await this.findAll()
    const filteredItems = items.filter(
      item => !item.productId.equals(productId)
    )

    this.save(filteredItems)
  }

  async exists(productId: ProductId): Promise<boolean> {
    const item = await this.findByProductId(productId)
    return item !== null
  }

  async toggleChecked(productId: ProductId): Promise<void> {
    const items = await this.findAll()
    const updatedItems = items.map(item =>
      item.productId.equals(productId) ? item.toggleChecked() : item
    )
    this.save(updatedItems)
  }

  async getCheckedItems(): Promise<ShoppingListItem[]> {
    const items = await this.findAll()
    return items.filter(item => item.checked)
  }

  private save(items: ShoppingListItem[]): void {
    const dtos = items.map(item => this.domainToDTO(item))
    this.storage.set(this.STORAGE_KEY, dtos)
  }

  private domainToDTO(item: ShoppingListItem): ShoppingListItemDTO {
    return {
      productId: item.productId.value,
      reason: item.reason,
      stockLevel: item.stockLevel,
      addedAt: item.addedAt.toISOString(),
      checked: item.checked
    }
  }

  private dtoToDomain(dto: ShoppingListItemDTO): ShoppingListItem {
    const productId = ProductIdClass.fromString(dto.productId)
    const checked = dto.checked ?? false // Backward compatibility: default to false

    let item: ShoppingListItem
    if (dto.reason === 'auto' && dto.stockLevel) {
      item = ShoppingListItemClass.createAuto(productId, dto.stockLevel)
    } else {
      item = ShoppingListItemClass.createManual(productId)
    }

    // If checked is true, toggle it to restore the state
    return checked ? item.toggleChecked() : item
  }
}
