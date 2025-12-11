import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StockLevelIndicator } from '../../../presentation/components/StockLevelIndicator';
import { StockLevel } from '../../../domain/model/StockLevel';

describe('StockLevelIndicator', () => {
  describe('Visual Rendering', () => {
    it('should render high level with green color', () => {
      // Arrange
      const level = StockLevel.create('high');

      // Act
      render(<StockLevelIndicator level={level} />);

      // Assert
      const indicator = screen.getByRole('progressbar');
      expect(indicator).toBeInTheDocument();
      expect(indicator).toHaveAttribute('aria-valuenow', '100');
      expect(indicator).toHaveAttribute('aria-label', 'Stock level: High');
    });

    it('should render medium level with yellow color', () => {
      // Arrange
      const level = StockLevel.create('medium');

      // Act
      render(<StockLevelIndicator level={level} />);

      // Assert
      const indicator = screen.getByRole('progressbar');
      expect(indicator).toHaveAttribute('aria-valuenow', '50');
      expect(indicator).toHaveAttribute('aria-label', 'Stock level: Medium');
    });

    it('should render low level with red color', () => {
      // Arrange
      const level = StockLevel.create('low');

      // Act
      render(<StockLevelIndicator level={level} />);

      // Assert
      const indicator = screen.getByRole('progressbar');
      expect(indicator).toHaveAttribute('aria-valuenow', '25');
      expect(indicator).toHaveAttribute('aria-label', 'Stock level: Low');
    });

    it('should render empty level with gray color', () => {
      // Arrange
      const level = StockLevel.create('empty');

      // Act
      render(<StockLevelIndicator level={level} />);

      // Assert
      const indicator = screen.getByRole('progressbar');
      expect(indicator).toHaveAttribute('aria-valuenow', '0');
      expect(indicator).toHaveAttribute('aria-label', 'Stock level: Empty');
    });
  });

  describe('Size Variants', () => {
    it('should render small size', () => {
      // Arrange
      const level = StockLevel.create('high');

      // Act
      render(<StockLevelIndicator level={level} size="small" />);

      // Assert
      const indicator = screen.getByRole('progressbar');
      expect(indicator).toBeInTheDocument();
    });

    it('should render medium size by default', () => {
      // Arrange
      const level = StockLevel.create('high');

      // Act
      render(<StockLevelIndicator level={level} />);

      // Assert
      const indicator = screen.getByRole('progressbar');
      expect(indicator).toBeInTheDocument();
    });

    it('should render large size', () => {
      // Arrange
      const level = StockLevel.create('high');

      // Act
      render(<StockLevelIndicator level={level} size="large" />);

      // Assert
      const indicator = screen.getByRole('progressbar');
      expect(indicator).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      // Arrange
      const level = StockLevel.create('medium');

      // Act
      render(<StockLevelIndicator level={level} />);

      // Assert
      const indicator = screen.getByRole('progressbar');
      expect(indicator).toHaveAttribute('aria-valuemin', '0');
      expect(indicator).toHaveAttribute('aria-valuemax', '100');
      expect(indicator).toHaveAttribute('aria-valuenow', '50');
      expect(indicator).toHaveAttribute('aria-label', 'Stock level: Medium');
    });
  });

  describe('Label Display', () => {
    it('should display level label when showLabel is true', () => {
      // Arrange
      const level = StockLevel.create('high');

      // Act
      render(<StockLevelIndicator level={level} showLabel={true} />);

      // Assert
      expect(screen.getByText('High')).toBeInTheDocument();
    });

    it('should not display level label by default', () => {
      // Arrange
      const level = StockLevel.create('high');

      // Act
      render(<StockLevelIndicator level={level} />);

      // Assert
      expect(screen.queryByText('High')).not.toBeInTheDocument();
    });
  });
});