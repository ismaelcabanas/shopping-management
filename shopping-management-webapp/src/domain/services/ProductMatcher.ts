import type { RawDetectedItem, MatchedDetectedItem } from '../../application/dtos/TicketScanResult'
import type { Product } from '../model/Product'
import type { ConfidenceThresholds } from '../model/ConfidenceThresholds'

const STOPWORDS = ['pack', 'de', 'el', 'la', 'un', 'una', 'il', 'entera', 'desnatada', 'semidesnatada', 'rojo', 'rama', 'sueltas', 'gallinero', 'al', 'corazon']
const BRAND_NAMES = ['pascual', 'hacendado', 'president', 'danone', 'zespri', 'gabeceras', 'gabaceras', 'canario']

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
    const normalized1 = this.normalizeProductName(str1)
    const normalized2 = this.normalizeProductName(str2)

    if (normalized1 === normalized2) return 1.0

    const tokenSimilarity = this.tokenBasedSimilarity(normalized1, normalized2)

    const distance = this.levenshteinDistance(normalized1, normalized2)
    const maxLength = Math.max(normalized1.length, normalized2.length)
    const levenshteinSimilarity = maxLength === 0 ? 1.0 : (maxLength - distance) / maxLength

    return (tokenSimilarity * 0.6) + (levenshteinSimilarity * 0.4)
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

  private normalizeProductName(name: string): string {
    let normalized = name.toLowerCase()

    normalized = normalized.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

    STOPWORDS.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi')
      normalized = normalized.replace(regex, '')
    })

    normalized = normalized.replace(/\d+\s*(u|un|unidades|x|g|kg|l|ml)/gi, '')

    BRAND_NAMES.forEach(brand => {
      const regex = new RegExp(`\\b${brand}\\b`, 'gi')
      normalized = normalized.replace(regex, '')
    })

    normalized = normalized.replace(/\s+/g, ' ').trim()

    return normalized
  }

  private tokenBasedSimilarity(str1: string, str2: string): number {
    const tokens1 = str1.split(/\s+/).filter(token => token.length >= 3)
    const tokens2 = str2.split(/\s+/).filter(token => token.length >= 3)

    if (tokens1.length === 0 || tokens2.length === 0) return 0

    let bestMatchScore = 0
    for (const token1 of tokens1) {
      for (const token2 of tokens2) {
        if (token1 === token2) {
          return 1.0
        }
        if (token1.includes(token2) || token2.includes(token1)) {
          const matchScore = Math.min(token1.length, token2.length) / Math.max(token1.length, token2.length)
          bestMatchScore = Math.max(bestMatchScore, matchScore)
        }
      }
    }

    return bestMatchScore
  }
}
