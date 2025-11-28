import { describe, it, expect } from 'vitest'
import { TicketParser } from '../../../domain/services/TicketParser'

describe('TicketParser', () => {
  it('should parse a simple product line with quantity', () => {
    const parser = new TicketParser()
    const line = 'LECHE PASCUAL 1L    2    3.50'

    const result = parser.parseLine(line)

    expect(result).not.toBeNull()
    expect(result?.productName).toBe('LECHE PASCUAL 1L')
    expect(result?.quantity).toBe(2)
    expect(result?.rawLine).toBe(line)
  })
})
