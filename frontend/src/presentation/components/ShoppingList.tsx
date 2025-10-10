import React from "react";
import { useShoppingList } from "../hooks/useShoppingList";
import ShoppingListItemComponent from "./ShoppingListItem";

const ShoppingList: React.FC = () => {
  const {
    neededItems,
    boughtItems,
    loading,
    updateItemQuantity,
    toggleItemStatus,
    markAllAsBought,
    clearList
  } = useShoppingList();

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl">🔄</div>
          <p className="text-gray-500 mt-2">Cargando lista de compras...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          🛒 Shopping Manager - Lista de Compras
        </h1>
      </div>

      {/* Needed Items Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          📋 Productos Necesarios ({neededItems.length})
        </h2>

        <div className="space-y-3">
          {neededItems.map((item) => (
            <ShoppingListItemComponent
              key={item.id}
              item={item}
              onQuantityChange={updateItemQuantity}
              onStatusToggle={toggleItemStatus}
            />
          ))}
        </div>

        {neededItems.length === 0 && (
          <p className="text-gray-500 text-center py-8">
            ¡No hay productos pendientes! 🎉
          </p>
        )}
      </div>

      {/* Bought Items Section */}
      {boughtItems.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            ✅ Productos Comprados ({boughtItems.length})
          </h2>

          <div className="space-y-2">
            {boughtItems.map((item) => (
              <ShoppingListItemComponent
                key={item.id}
                item={item}
                onQuantityChange={updateItemQuantity}
                onStatusToggle={toggleItemStatus}
              />
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={markAllAsBought}
          disabled={neededItems.length === 0}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Marcar Todos como Comprados
        </button>

        <button
          onClick={clearList}
          disabled={boughtItems.length === 0}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Limpiar Lista
        </button>
      </div>
    </div>
  );
};

export default ShoppingList;
