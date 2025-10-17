import { describe, it, expect } from 'vitest'
import { calculateTotal, formatPrice, needsRestock } from './priceCalculator'

describe('Price Calculator - Unit Tests', () => {
  describe('calculateTotal', () => {
    it('debería calcular el total de items correctamente', () => {
      const items = [
        { price: 10, quantity: 2 },
        { price: 5, quantity: 3 },
      ]

      const result = calculateTotal(items)

      expect(result).toBe(35) // (10*2) + (5*3) = 35
    })

    it('debería retornar 0 para un array vacío', () => {
      const result = calculateTotal([])
      expect(result).toBe(0)
    })

    it('debería manejar cantidades decimales', () => {
      const items = [{ price: 2.5, quantity: 1.5 }]
      const result = calculateTotal(items)
      expect(result).toBeCloseTo(3.75)
    })
  })

  describe('formatPrice', () => {
    it('debería formatear el precio con 2 decimales y símbolo de euro por defecto', () => {
      const result = formatPrice(10.5)
      expect(result).toBe('10.50 €')
    })

    it('debería permitir especificar otra moneda', () => {
      const result = formatPrice(25.99, '$')
      expect(result).toBe('25.99 $')
    })

    it('debería redondear a 2 decimales', () => {
      const result = formatPrice(10.556)
      expect(result).toBe('10.56 €')
    })
  })

  describe('needsRestock', () => {
    it('debería retornar true cuando el stock actual es menor que el mínimo', () => {
      const result = needsRestock(5, 10)
      expect(result).toBe(true)
    })

    it('debería retornar true cuando el stock actual es igual al mínimo', () => {
      const result = needsRestock(10, 10)
      expect(result).toBe(true)
    })

    it('debería retornar false cuando el stock actual es mayor que el mínimo', () => {
      const result = needsRestock(15, 10)
      expect(result).toBe(false)
    })
  })
})

