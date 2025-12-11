import type { ShoppingListRepository } from '../../domain/repositories/ShoppingListRepository'
import type { ShoppingListItem, StockLevelValue } from '../../domain/model/ShoppingListItem'
import type { ProductId } from '../../domain/model/ProductId'
import { ProductId as ProductIdClass } from '../../domain/model/ProductId'
import { ShoppingListItem as ShoppingListItemClass } from '../../domain/model/ShoppingListItem'

interface ShoppingListItemDTO {
  productId: string
  reason: 'auto' | 'manual'
  stockLevel?: StockLevelValue
  addedAt: string
}

export class LocalStorageShoppingListRepository implements ShoppingListRepository {
  private readonly STORAGE_KEY = 'shopping-list'

  async findAll(): Promise<ShoppingListItem[]> {
    const data = localStorage.getItem(this.STORAGE_KEY)
    if (!data) {
      return []
    }

    const items: ShoppingListItemDTO[] = JSON.parse(data)
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

  private save(items: ShoppingListItem[]): void {
    const dtos = items.map(item => this.domainToDTO(item))
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dtos))
  }

  private domainToDTO(item: ShoppingListItem): ShoppingListItemDTO {
    return {
      productId: item.productId.value,
      reason: item.reason,
      stockLevel: item.stockLevel,
      addedAt: item.addedAt.toISOString()
    }
  }

  private dtoToDomain(dto: ShoppingListItemDTO): ShoppingListItem {
    const productId = ProductIdClass.fromString(dto.productId)

    if (dto.reason === 'auto' && dto.stockLevel) {
      return ShoppingListItemClass.createAuto(productId, dto.stockLevel)
    }

    return ShoppingListItemClass.createManual(productId)
  }
}
