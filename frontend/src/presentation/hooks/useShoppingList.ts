// Presentation Hook: Bridge between React and Clean Architecture
import { useState, useCallback } from 'react';
import type { ShoppingListItem } from '../../domain/entities/ShoppingListItem';
import { MockShoppingListRepository } from '../../infrastructure/repositories/MockShoppingListRepository';
import { ShoppingListService } from '../../application/services/ShoppingListService';
import { useAsync } from '../../lib/useAsync';

// Singleton instances (in a real app, this would come from DI container)
const repository = new MockShoppingListRepository();
const service = new ShoppingListService(repository);

export function useShoppingList() {
  const [items, setItems] = useState<ShoppingListItem[]>([]);

  // Use useAsync for the initial load so we have a consistent loading/error state
  const { loading, error, run } = useAsync(async () => {
    const allItems = await service.getAllItems();
    setItems(allItems);
    return allItems;
  }, []);

  // Update quantity
  const updateItemQuantity = useCallback(async (id: string, newQuantity: number) => {
    try {
      await service.updateQuantity(id, newQuantity);
      await run(); // Refresh data
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  }, [run]);

  // Toggle status
  const toggleItemStatus = useCallback(async (id: string) => {
    try {
      await service.toggleItemStatus(id);
      await run(); // Refresh data
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  }, [run]);

  // Mark all as bought
  const markAllAsBought = useCallback(async () => {
    try {
      await service.markAllAsBought();
      await run(); // Refresh data
    } catch (error) {
      console.error('Error marking all as bought:', error);
    }
  }, [run]);

  // Clear list (mark all as needed)
  const clearList = useCallback(async () => {
    try {
      await service.clearList();
      await run(); // Refresh data
    } catch (error) {
      console.error('Error clearing list:', error);
    }
  }, [run]);

  // Derived data
  const neededItems = items.filter(item => item.status.isNeeded());
  const boughtItems = items.filter(item => item.status.isBought());

  return {
    // Data
    items,
    neededItems,
    boughtItems,
    loading,
    error,

    // Actions
    updateItemQuantity,
    toggleItemStatus,
    markAllAsBought,
    clearList,
    refresh: run
  };
}