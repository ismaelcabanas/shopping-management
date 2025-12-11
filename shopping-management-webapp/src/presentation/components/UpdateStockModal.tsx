import { useState } from 'react';
import { Product } from '../../domain/model/Product';
import { StockLevel } from '../../domain/model/StockLevel';
import { StockLevelIndicator } from './StockLevelIndicator';

interface UpdateStockModalProps {
  isOpen: boolean;
  product: Product;
  currentLevel: StockLevel;
  onConfirm: (newLevel: StockLevel) => void;
  onCancel: () => void;
}

type StockLevelValue = 'high' | 'medium' | 'low' | 'empty';

const STOCK_LEVELS: Array<{ value: StockLevelValue; label: string; description: string }> = [
  { value: 'high', label: 'High', description: 'Plenty in stock' },
  { value: 'medium', label: 'Medium', description: 'Normal level' },
  { value: 'low', label: 'Low', description: 'Buy soon' },
  { value: 'empty', label: 'Empty', description: 'Out of stock' },
];

export const UpdateStockModal = ({
  isOpen,
  product,
  currentLevel,
  onConfirm,
  onCancel,
}: UpdateStockModalProps) => {
  const [selectedLevel, setSelectedLevel] = useState<StockLevelValue>(currentLevel.value as StockLevelValue);

  if (!isOpen) {
    return null;
  }

  const handleConfirm = () => {
    onConfirm(StockLevel.create(selectedLevel));
  };

  const modalId = 'update-stock-modal-title';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full m-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby={modalId}
      >
        <h2 id={modalId} className="text-xl font-semibold mb-4">
          {product.name}
        </h2>

        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">Current level:</p>
          <StockLevelIndicator level={currentLevel} size="large" showLabel={true} />
        </div>

        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-3">Update stock level:</p>
          <div className="space-y-3">
            {STOCK_LEVELS.map((level) => (
              <label
                key={level.value}
                className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <input
                  type="radio"
                  name="stockLevel"
                  value={level.value}
                  checked={selectedLevel === level.value}
                  onChange={(e) => setSelectedLevel(e.target.value as StockLevelValue)}
                  className="w-4 h-4 text-blue-600"
                />
                <div className="flex-1">
                  <div className="font-medium">{level.label}</div>
                  <div className="text-sm text-gray-500">{level.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};