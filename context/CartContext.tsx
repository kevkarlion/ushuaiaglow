'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { CartItem, CartState } from '@/types/cart';
import { trackAddToCart, trackRemoveFromCart, buildGA4Item } from '@/lib/ga4-ecommerce';

interface CartContextType extends CartState {
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  clearCartWithPurchase: (items: CartItem[], total: number) => void;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'ushuaia-cart';

function calculateTotals(items: CartItem[]): { totalItems: number; subtotal: number } {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { totalItems, subtotal };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
    setIsLoading(false);
    setIsHydrated(true);
  }, []);

  // Save to localStorage on update
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [items, isHydrated]);

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>, quantity = 1) => {
    // Track add_to_cart BEFORE updating state (to get accurate quantity)
    trackAddToCart({
      currency: 'ARS',
      value: item.price * quantity,
      items: [buildGA4Item(item.productId, item.title, item.price, quantity)]
    });
    
    setItems((currentItems) => {
      const existingItem = currentItems.find((i) => i.productId === item.productId);
      
      if (existingItem) {
        console.log('🛒 existing item, updating quantity:', existingItem.quantity + quantity);
        return currentItems.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      
      console.log('🛒 new item, adding to cart');
      return [...currentItems, { ...item, quantity }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    // Find item before removing to track event
    setItems((currentItems) => {
      const itemToRemove = currentItems.find((i) => i.productId === productId);
      
      // Track remove_from_cart BEFORE filtering
      if (itemToRemove) {
        trackRemoveFromCart({
          currency: 'ARS',
          value: itemToRemove.price * itemToRemove.quantity,
          items: [buildGA4Item(itemToRemove.productId, itemToRemove.title, itemToRemove.price, itemToRemove.quantity)]
        });
      }
      
      return currentItems.filter((i) => i.productId !== productId);
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) return;
    
    setItems((currentItems) =>
      currentItems.map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const clearCartWithPurchase = useCallback((itemsToSave: CartItem[], total: number) => {
    // Save purchase data before clearing cart
    if (typeof window !== 'undefined') {
      const purchaseData = {
        items: itemsToSave,
        total,
        timestamp: Date.now()
      };
      localStorage.setItem('last-purchase', JSON.stringify(purchaseData));
    }
    setItems([]);
  }, []);

  const { totalItems, subtotal } = calculateTotals(items);

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        clearCartWithPurchase,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}