// Value Object: ItemStatus
export type ItemStatus = 'needed' | 'bought';

export class ItemStatusVO {
  private constructor(private readonly value: ItemStatus) {}

  static needed(): ItemStatusVO {
    return new ItemStatusVO('needed');
  }

  static bought(): ItemStatusVO {
    return new ItemStatusVO('bought');
  }

  static fromString(status: string): ItemStatusVO {
    if (status !== 'needed' && status !== 'bought') {
      throw new Error(`Invalid status: ${status}`);
    }
    return new ItemStatusVO(status);
  }

  getValue(): ItemStatus {
    return this.value;
  }

  isNeeded(): boolean {
    return this.value === 'needed';
  }

  isBought(): boolean {
    return this.value === 'bought';
  }

  toggle(): ItemStatusVO {
    return this.value === 'needed'
      ? ItemStatusVO.bought()
      : ItemStatusVO.needed();
  }

  equals(other: ItemStatusVO): boolean {
    return this.value === other.value;
  }
}