import { StockLevel } from '../model/StockLevel'

export class StockLevelCalculator {
  shouldAddToShoppingList(level: StockLevel): boolean {
    return level.value === 'low' || level.value === 'empty'
  }

  getLevelColor(level: StockLevel): string {
    const colorMap: Record<string, string> = {
      high: 'green',
      medium: 'yellow',
      low: 'red',
      empty: 'gray'
    }
    return colorMap[level.value]
  }

  getLevelPercentage(level: StockLevel): number {
    const percentageMap: Record<string, number> = {
      high: 87.5,
      medium: 50,
      low: 12.5,
      empty: 0
    }
    return percentageMap[level.value]
  }
}