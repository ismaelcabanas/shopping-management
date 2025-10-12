import React, { useState } from "react";
import type { ShoppingListItem } from "../../domain/entities/ShoppingListItem";

interface ShoppingListItemProps {
  item: ShoppingListItem;
  onQuantityChange: (id: string, newQuantity: number) => void;
  onStatusToggle: (id: string) => void;
}

const ShoppingListItemComponent: React.FC<ShoppingListItemProps> = ({
  item,
  onQuantityChange,
  onStatusToggle,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempQuantity, setTempQuantity] = useState(item.quantity.getValue().toString());

  const handleEdit = () => {
    setIsEditing(true);
    setTempQuantity(item.quantity.getValue().toString());
  };

  const handleSave = () => {
    const newQuantity = parseInt(tempQuantity, 10);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      onQuantityChange(item.id, newQuantity);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempQuantity(item.quantity.getValue().toString());
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <div
      className={`p-4 border rounded-lg shadow-sm transition-all ${
        item.status.isBought()
          ? "bg-green-50 border-green-200 opacity-75"
          : "bg-white border-gray-200 hover:shadow-md"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          {/* Checkbox */}
          <input
            type="checkbox"
            checked={item.status.isBought()}
            onChange={() => onStatusToggle(item.id)}
            className="h-5 w-5 text-green-600 rounded border-gray-300 focus:ring-green-500"
          />

          {/* Product Name */}
          <div className="flex-1">
            <h3
              className={`font-medium ${
                item.status.isBought()
                  ? "line-through text-gray-500"
                  : "text-gray-900"
              }`}
            >
              {item.productName}
            </h3>
            <p className="text-sm text-gray-500">
              Estado:{" "}
              {item.status.isNeeded() ? "⚠️ Stock bajo" : "✅ Comprado"}
            </p>
          </div>

          {/* Quantity Section */}
          <div className="flex items-center gap-2">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={tempQuantity}
                  onChange={(e) => setTempQuantity(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                  autoFocus
                />
                <span className="text-sm text-gray-600">{item.unit}</span>
                <button
                  onClick={handleSave}
                  className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                >
                  ✓
                </button>
                <button
                  onClick={handleCancel}
                  className="px-2 py-1 bg-gray-400 text-white text-xs rounded hover:bg-gray-500"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span
                  className={`font-semibold ${
                    item.status.isBought() ? "text-gray-500" : "text-gray-900"
                  }`}
                >
                  [{item.quantity.getValue()}]
                </span>
                <span className="text-sm text-gray-600">{item.unit}</span>
                <button
                  onClick={handleEdit}
                  className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded hover:bg-blue-200 transition-colors"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingListItemComponent;
