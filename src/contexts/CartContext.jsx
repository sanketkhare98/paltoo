import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNotifications } from './NotificationContext';

const CartContext = createContext();

function loadCart() {
  try {
    const stored = localStorage.getItem('paltoo_cart');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(loadCart);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { showToast } = useNotifications();

  useEffect(() => {
    try {
      localStorage.setItem('paltoo_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to persist cart:', e);
    }
  }, [cart]);

  const addToCart = useCallback((product, quantity = 1) => {
    if (!product) return;
    const qty = Math.max(1, parseInt(quantity, 10) || 1);

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === product.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + qty
        };
        return updated;
      }
      return [...prev, { ...product, quantity: qty }];
    });

    showToast(`Added ${quantity > 1 ? `${quantity}x ` : ''}${product.name} to cart! 🛒`, 'success');
  }, [showToast]);

  const removeFromCart = useCallback((productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
    showToast('Removed item from cart', 'info');
  }, [showToast]);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== productId));
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    localStorage.removeItem('paltoo_cart');
  }, []);

  const cartItemCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);
  const cartSubtotal = cart.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 1)), 0);

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    cartItemCount,
    cartSubtotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
