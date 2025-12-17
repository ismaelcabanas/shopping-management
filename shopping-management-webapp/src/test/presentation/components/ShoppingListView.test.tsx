import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ShoppingListView } from '../../../presentation/components/ShoppingListView'
import { ProductId } from '../../../domain/model/ProductId'
import type { ShoppingListItemWithDetails } from '../../../presentation/hooks/useShoppingList'

describe('ShoppingListView', () => {
  const mockItems: ShoppingListItemWithDetails[] = [
    {
      productId: ProductId.fromString('123e4567-e89b-12d3-a456-426614174000'),
      productName: 'Leche',
      reason: 'auto',
      stockLevel: 'low',
      addedAt: new Date(),
      checked: false
    },
    {
      productId: ProductId.fromString('123e4567-e89b-12d3-a456-426614174001'),
      productName: 'Pan',
      reason: 'manual',
      stockLevel: undefined,
      addedAt: new Date(),
      checked: false
    }
  ]

  describe('readonly mode', () => {
    it('should render items without checkboxes when readonly=true', () => {
      render(<ShoppingListView items={mockItems} readonly={true} />)

      expect(screen.getByText('Leche')).toBeInTheDocument()
      expect(screen.getByText('Pan')).toBeInTheDocument()
      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    })

    it('should display stock level badges correctly', () => {
      render(<ShoppingListView items={mockItems} readonly={true} />)

      expect(screen.getByText('Stock bajo')).toBeInTheDocument()
    })

    it('should show item count', () => {
      render(<ShoppingListView items={mockItems} readonly={true} />)

      expect(screen.getByText('2 productos')).toBeInTheDocument()
    })

    it('should show empty state message when no items', () => {
      render(<ShoppingListView items={[]} readonly={true} />)

      expect(screen.getByText('No hay productos en la lista de compras')).toBeInTheDocument()
    })
  })

  describe('interactive mode', () => {
    it('should render items with checkboxes when readonly=false', () => {
      render(<ShoppingListView items={mockItems} readonly={false} />)

      const checkboxes = screen.getAllByRole('checkbox')
      expect(checkboxes).toHaveLength(2)
    })

    it('should call onToggleChecked when checkbox clicked', async () => {
      const user = userEvent.setup()
      const onToggleChecked = vi.fn()

      render(
        <ShoppingListView
          items={mockItems}
          readonly={false}
          onToggleChecked={onToggleChecked}
        />
      )

      const firstCheckbox = screen.getAllByRole('checkbox')[0]
      await user.click(firstCheckbox)

      expect(onToggleChecked).toHaveBeenCalledWith(mockItems[0].productId)
    })

    it('should apply correct styling to checked items', () => {
      const checkedItems: ShoppingListItemWithDetails[] = [
        {
          ...mockItems[0],
          checked: true
        }
      ]

      render(<ShoppingListView items={checkedItems} readonly={false} />)

      const productName = screen.getByText('Leche')
      expect(productName).toHaveClass('line-through')
      expect(productName).toHaveClass('opacity-60')
    })

    it('should reflect checked state in checkboxes', () => {
      const checkedItems: ShoppingListItemWithDetails[] = [
        { ...mockItems[0], checked: true },
        { ...mockItems[1], checked: false }
      ]

      render(<ShoppingListView items={checkedItems} readonly={false} />)

      const checkboxes = screen.getAllByRole('checkbox') as HTMLInputElement[]
      expect(checkboxes[0].checked).toBe(true)
      expect(checkboxes[1].checked).toBe(false)
    })
  })

  describe('stock level badges', () => {
    it('should display "Stock bajo" badge for low stock', () => {
      const lowStockItem: ShoppingListItemWithDetails[] = [
        { ...mockItems[0], stockLevel: 'low' }
      ]

      render(<ShoppingListView items={lowStockItem} readonly={true} />)

      expect(screen.getByText('Stock bajo')).toBeInTheDocument()
    })

    it('should display "Sin stock" badge for empty stock', () => {
      const emptyStockItem: ShoppingListItemWithDetails[] = [
        { ...mockItems[0], stockLevel: 'empty' }
      ]

      render(<ShoppingListView items={emptyStockItem} readonly={true} />)

      expect(screen.getByText('Sin stock')).toBeInTheDocument()
    })

    it('should not display badge when stockLevel is undefined', () => {
      const noStockLevelItem: ShoppingListItemWithDetails[] = [
        { ...mockItems[0], stockLevel: undefined }
      ]

      render(<ShoppingListView items={noStockLevelItem} readonly={true} />)

      expect(screen.queryByText('Stock bajo')).not.toBeInTheDocument()
      expect(screen.queryByText('Sin stock')).not.toBeInTheDocument()
    })
  })
})
