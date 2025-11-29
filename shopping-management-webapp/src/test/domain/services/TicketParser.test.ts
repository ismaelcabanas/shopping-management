import { describe, it, expect } from 'vitest'
import { TicketParser } from '../../../domain/services/TicketParser'

describe('TicketParser', () => {
  it('should parse a simple product line with quantity (pipe format)', () => {
    const parser = new TicketParser()
    const line = 'LECHE PASCUAL 1L | 2'

    const result = parser.parseLine(line)

    expect(result).not.toBeNull()
    expect(result?.productName).toBe('LECHE PASCUAL 1L')
    expect(result?.quantity).toBe(2)
    expect(result?.rawLine).toBe(line)
  })

  it('should parse product with quantity indicator in name', () => {
    const parser = new TicketParser()
    const line = 'CORAZÓN LECHUGA 6U | 6'

    const result = parser.parseLine(line)

    expect(result).not.toBeNull()
    expect(result?.productName).toBe('CORAZÓN LECHUGA 6U')
    expect(result?.quantity).toBe(6)
  })

  it('should handle optional whitespace around pipe', () => {
    const parser = new TicketParser()
    const line = 'PAN INTEGRAL|1'

    const result = parser.parseLine(line)

    expect(result).not.toBeNull()
    expect(result?.productName).toBe('PAN INTEGRAL')
    expect(result?.quantity).toBe(1)
  })

  it('should return null for invalid format', () => {
    const parser = new TicketParser()
    const line = 'INVALID LINE WITHOUT PIPE'

    const result = parser.parseLine(line)

    expect(result).toBeNull()
  })
})
