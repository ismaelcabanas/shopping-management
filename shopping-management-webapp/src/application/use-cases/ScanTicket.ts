import type { OCRService } from '../ports/OCRService'
import type { ProductRepository } from '../../domain/repositories/ProductRepository'
import type { TicketScanResult } from '../dtos/TicketScanResult'
import { TicketParser } from '../../domain/services/TicketParser'
import { ProductMatcher } from '../../domain/services/ProductMatcher'
import { ConfidenceThresholds } from '../../domain/model/ConfidenceThresholds'

export interface ScanTicketCommand {
  imageFile: File
}

export class ScanTicket {
  private parser: TicketParser
  private matcher: ProductMatcher
  private ocrService: OCRService
  private productRepository: ProductRepository

  constructor(ocrService: OCRService, productRepository: ProductRepository) {
    this.ocrService = ocrService
    this.productRepository = productRepository
    this.parser = new TicketParser()
    this.matcher = new ProductMatcher(ConfidenceThresholds.default())
  }

  async execute(command: ScanTicketCommand): Promise<TicketScanResult> {
    const startTime = Date.now()

    const rawText = await this.ocrService.extractText(command.imageFile)

    const rawItems = this.parser.parseText(rawText)

    const products = await this.productRepository.findAll()
    const matchedItems = rawItems.map(item => this.matcher.match(item, products))

    const confidence = this.calculateGlobalConfidence(matchedItems)
    const processingTimeMs = Date.now() - startTime

    return {
      rawText,
      detectedItems: matchedItems,
      confidence,
      processingTimeMs,
      ocrProvider: this.ocrService.getProviderName()
    }
  }

  private calculateGlobalConfidence(items: typeof this.matcher.match extends (...args: any[]) => infer R ? R[] : never): number {
    if (items.length === 0) return 0
    const avgConfidence = items.reduce((sum, item) => sum + item.confidence, 0) / items.length
    return avgConfidence
  }
}
