import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const { success, warning } = useToast();

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    if (!product || product.stock <= 0) {
      warning('This product is currently out of stock');
      return;
    }

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.product._id === product._id
      );

      if (existingIndex > -1) {
        const currentQty = prevItems[existingIndex].quantity;
        const newQty = Math.min(currentQty + quantity, product.stock);

        if (newQty === currentQty) {
          warning(`Maximum available stock reached (${product.stock} items)`);
          return prevItems;
        }

        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
        };
        success(`Updated quantity for ${product.name} (${newQty})`);
        return updated;
      } else {
        const initialQty = Math.min(quantity, product.stock);
        success(`Added ${product.name} to cart`);
        return [...prevItems, { product, quantity: initialQty }];
      }
    });
  };

  const updateQuantity = (productId, quantity) => {
    setCartItems((prevItems) => {
      const item = prevItems.find((i) => i.product._id === productId);
      if (!item) return prevItems;

      if (quantity <= 0) {
        return prevItems.filter((i) => i.product._id !== productId);
      }

      const clampedQty = Math.min(quantity, item.product.stock);
      if (clampedQty < quantity) {
        warning(`Cannot exceed available stock of ${item.product.stock}`);
      }

      return prevItems.map((i) =>
        i.product._id === productId ? { ...i, quantity: clampedQty } : i
      );
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.product._id !== productId)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (acc, item) => acc + (item.product?.price || 0) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
