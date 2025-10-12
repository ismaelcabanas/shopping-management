// Presentation Hook: Bridge between React and Clean Architecture
import { useState, useEffect, useCallback } from 'react';
import type { ShoppingListItem } from '../../domain/entities/ShoppingListItem';
import { MockShoppingListRepository } from '../../infrastructure/repositories/MockShoppingListRepository';
import { ShoppingListService } from '../../application/services/ShoppingListService';

// Singleton instances (in a real app, this would come from DI container)
const repository = new MockShoppingListRepository();
const service = new ShoppingListService(repository);

export function useShoppingList() {
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load initial data
  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      const allItems = await service.getAllItems();
      setItems(allItems);
    } catch (error) {
      console.error('Error loading shopping list:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize data on mount
  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // Update quantity
  const updateItemQuantity = useCallback(async (id: string, newQuantity: number) => {
    try {
      await service.updateQuantity(id, newQuantity);
      await loadItems(); // Refresh data
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  }, [loadItems]);

  // Toggle status
  const toggleItemStatus = useCallback(async (id: string) => {
    try {
      await service.toggleItemStatus(id);
      await loadItems(); // Refresh data
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  }, [loadItems]);

  // Mark all as bought
  const markAllAsBought = useCallback(async () => {
    try {
      await service.markAllAsBought();
      await loadItems(); // Refresh data
    } catch (error) {
      console.error('Error marking all as bought:', error);
    }
  }, [loadItems]);

  // Clear list (mark all as needed)
  const clearList = useCallback(async () => {
    try {
      await service.clearList();
      await loadItems(); // Refresh data
    } catch (error) {
      console.error('Error clearing list:', error);
    }
  }, [loadItems]);

  // Derived data
  const neededItems = items.filter(item => item.status.isNeeded());
  const boughtItems = items.filter(item => item.status.isBought());

  return {
    // Data
    items,
    neededItems,
    boughtItems,
    loading,

    // Actions
    updateItemQuantity,
    toggleItemStatus,
    markAllAsBought,
    clearList,
    refresh: loadItems
  };
}