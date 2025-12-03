export class ConfidenceThresholds {
  readonly highConfidence: number
  readonly mediumConfidence: number

  private constructor(highConfidence: number, mediumConfidence: number) {
    if (highConfidence < 0 || highConfidence > 1) {
      throw new Error('High confidence threshold must be between 0 and 1')
    }
    if (mediumConfidence < 0 || mediumConfidence > 1) {
      throw new Error('Medium confidence threshold must be between 0 and 1')
    }
    if (mediumConfidence >= highConfidence) {
      throw new Error('Medium confidence must be lower than high confidence')
    }

    this.highConfidence = highConfidence
    this.mediumConfidence = mediumConfidence
  }

  static create(highConfidence: number, mediumConfidence: number): ConfidenceThresholds {
    return new ConfidenceThresholds(highConfidence, mediumConfidence)
  }

  static default(): ConfidenceThresholds {
    return new ConfidenceThresholds(0.6, 0.5)
  }

  isHighConfidence(confidence: number): boolean {
    return confidence >= this.highConfidence
  }

  isMediumConfidence(confidence: number): boolean {
    return confidence >= this.mediumConfidence && confidence < this.highConfidence
  }

  isLowConfidence(confidence: number): boolean {
    return confidence < this.mediumConfidence
  }
}
