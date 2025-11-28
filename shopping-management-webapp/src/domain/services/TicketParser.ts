import type { RawDetectedItem } from '../model/DetectedItem'
import { v4 as uuidv4 } from 'uuid'

export class TicketParser {
  parseLine(line: string): RawDetectedItem | null {
    const pattern = /^(.+?)\s+(\d+)\s+[\d,.]+$/
    const match = line.match(pattern)

    if (match) {
      return {
        id: uuidv4(),
        rawLine: line,
        productName: match[1].trim(),
        quantity: parseInt(match[2]),
        confidence: 0.5
      }
    }

    return null
  }

  parseText(text: string): RawDetectedItem[] {
    const lines = text.split('\n')
    const items: RawDetectedItem[] = []

    for (const line of lines) {
      const parsed = this.parseLine(line)
      if (parsed) {
        items.push(parsed)
      }
    }

    return items
  }
}
