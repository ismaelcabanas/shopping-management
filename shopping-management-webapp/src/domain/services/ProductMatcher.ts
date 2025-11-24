import type { RawDetectedItem, MatchedDetectedItem } from '../model/DetectedItem'
import type { Product } from '../model/Product'
import type { ConfidenceThresholds } from '../model/ConfidenceThresholds'

export class ProductMatcher {
  private thresholds: ConfidenceThresholds

  constructor(thresholds: ConfidenceThresholds) {
    this.thresholds = thresholds
  }

  match(detectedItem: RawDetectedItem, products: Product[]): MatchedDetectedItem {
    const bestMatch = this.findBestMatch(detectedItem.productName, products)

    if (bestMatch && bestMatch.similarity >= this.thresholds.highConfidence) {
      return {
        ...detectedItem,
        matchedProductId: bestMatch.product.id.value,
        matchedProductName: bestMatch.product.name,
        confidence: bestMatch.similarity,
        status: 'matched'
      }
    }

    if (bestMatch && bestMatch.similarity >= this.thresholds.mediumConfidence) {
      return {
        ...detectedItem,
        matchedProductId: bestMatch.product.id.value,
        matchedProductName: bestMatch.product.name,
        confidence: bestMatch.similarity,
        status: 'low-confidence'
      }
    }

    return {
      ...detectedItem,
      confidence: detectedItem.confidence,
      status: 'unmatched'
    }
  }

  private findBestMatch(
    name: string,
    products: Product[]
  ): { product: Product; similarity: number } | null {
    let bestMatch: { product: Product; similarity: number } | null = null

    for (const product of products) {
      const similarity = this.calculateSimilarity(
        name.toLowerCase(),
        product.name.toLowerCase()
      )

      if (!bestMatch || similarity > bestMatch.similarity) {
        bestMatch = { product, similarity }
      }
    }

    return bestMatch
  }

  private calculateSimilarity(str1: string, str2: string): number {
    if (str1 === str2) return 1.0

    const distance = this.levenshteinDistance(str1, str2)
    const maxLength = Math.max(str1.length, str2.length)

    if (maxLength === 0) return 1.0

    return (maxLength - distance) / maxLength
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = []

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i]
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          )
        }
      }
    }

    return matrix[str2.length][str1.length]
  }
}
