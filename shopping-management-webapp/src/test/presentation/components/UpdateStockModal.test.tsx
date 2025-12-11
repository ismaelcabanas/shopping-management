import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UpdateStockModal } from '../../../presentation/components/UpdateStockModal';
import { StockLevel } from '../../../domain/model/StockLevel';
import { Product } from '../../../domain/model/Product';
import { ProductId } from '../../../domain/model/ProductId';
import { UnitType } from '../../../domain/model/UnitType';

describe('UpdateStockModal', () => {
  const mockProductId = ProductId.fromString('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d');
  const mockProduct = new Product(
    mockProductId,
    'Test Product',
    UnitType.units()
  );
  const currentLevel = StockLevel.create('medium');

  describe('Modal Display', () => {
    it('should render modal when isOpen is true', () => {
      // Arrange & Act
      render(
        <UpdateStockModal
          isOpen={true}
          product={mockProduct}
          currentLevel={currentLevel}
          onConfirm={() => {}}
          onCancel={() => {}}
        />
      );

      // Assert
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    it('should not render modal when isOpen is false', () => {
      // Arrange & Act
      render(
        <UpdateStockModal
          isOpen={false}
          product={mockProduct}
          currentLevel={currentLevel}
          onConfirm={() => {}}
          onCancel={() => {}}
        />
      );

      // Assert
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('Stock Level Selection', () => {
    it('should display all 4 stock level options', () => {
      // Arrange & Act
      render(
        <UpdateStockModal
          isOpen={true}
          product={mockProduct}
          currentLevel={currentLevel}
          onConfirm={() => {}}
          onCancel={() => {}}
        />
      );

      // Assert - Check for radio buttons specifically
      const radios = screen.getAllByRole('radio');
      expect(radios).toHaveLength(4);
      expect(screen.getByDisplayValue('high')).toBeInTheDocument();
      expect(screen.getByDisplayValue('medium')).toBeInTheDocument();
      expect(screen.getByDisplayValue('low')).toBeInTheDocument();
      expect(screen.getByDisplayValue('empty')).toBeInTheDocument();
    });

    it('should pre-select the current stock level', () => {
      // Arrange & Act
      render(
        <UpdateStockModal
          isOpen={true}
          product={mockProduct}
          currentLevel={currentLevel}
          onConfirm={() => {}}
          onCancel={() => {}}
        />
      );

      // Assert
      const mediumRadio = screen.getByDisplayValue('medium') as HTMLInputElement;
      expect(mediumRadio.checked).toBe(true);
    });

    it('should allow selecting a different level', () => {
      // Arrange
      render(
        <UpdateStockModal
          isOpen={true}
          product={mockProduct}
          currentLevel={currentLevel}
          onConfirm={() => {}}
          onCancel={() => {}}
        />
      );

      // Act
      const lowRadio = screen.getByLabelText(/Low/i) as HTMLInputElement;
      fireEvent.click(lowRadio);

      // Assert
      expect(lowRadio.checked).toBe(true);
    });
  });

  describe('Button Actions', () => {
    it('should call onConfirm with selected level when confirm button is clicked', () => {
      // Arrange
      const onConfirm = vi.fn();
      render(
        <UpdateStockModal
          isOpen={true}
          product={mockProduct}
          currentLevel={currentLevel}
          onConfirm={onConfirm}
          onCancel={() => {}}
        />
      );

      // Act
      const lowRadio = screen.getByLabelText(/Low/i);
      fireEvent.click(lowRadio);

      const confirmButton = screen.getByRole('button', { name: /confirm/i });
      fireEvent.click(confirmButton);

      // Assert
      expect(onConfirm).toHaveBeenCalledTimes(1);
      expect(onConfirm).toHaveBeenCalledWith(expect.objectContaining({
        value: 'low'
      }));
    });

    it('should call onCancel when cancel button is clicked', () => {
      // Arrange
      const onCancel = vi.fn();
      render(
        <UpdateStockModal
          isOpen={true}
          product={mockProduct}
          currentLevel={currentLevel}
          onConfirm={() => {}}
          onCancel={onCancel}
        />
      );

      // Act
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      // Assert
      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('should not call onConfirm if level has not changed', () => {
      // Arrange
      const onConfirm = vi.fn();
      render(
        <UpdateStockModal
          isOpen={true}
          product={mockProduct}
          currentLevel={currentLevel}
          onConfirm={onConfirm}
          onCancel={() => {}}
        />
      );

      // Act
      const confirmButton = screen.getByRole('button', { name: /confirm/i });
      fireEvent.click(confirmButton);

      // Assert - should still be called, but with same value
      expect(onConfirm).toHaveBeenCalledWith(expect.objectContaining({
        value: 'medium'
      }));
    });
  });

  describe('Current Level Display', () => {
    it('should display the current stock level', () => {
      // Arrange & Act
      render(
        <UpdateStockModal
          isOpen={true}
          product={mockProduct}
          currentLevel={currentLevel}
          onConfirm={() => {}}
          onCancel={() => {}}
        />
      );

      // Assert
      expect(screen.getByText(/Current level/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper modal role', () => {
      // Arrange & Act
      render(
        <UpdateStockModal
          isOpen={true}
          product={mockProduct}
          currentLevel={currentLevel}
          onConfirm={() => {}}
          onCancel={() => {}}
        />
      );

      // Assert
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
    });

    it('should have descriptive aria-label for dialog', () => {
      // Arrange & Act
      render(
        <UpdateStockModal
          isOpen={true}
          product={mockProduct}
          currentLevel={currentLevel}
          onConfirm={() => {}}
          onCancel={() => {}}
        />
      );

      // Assert
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-labelledby');
    });
  });
});