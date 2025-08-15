"use client";
import { createContext, useState, useContext } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Add to cart with color and size
  const addToCart = (item, color, size) => {
    setCart((prev) => {
      // Check if the item with the same color and size already exists
      const existing = prev.find(
        (i) => i.id === item.id && i.color === color && i.size === size
      );

      if (existing) {
        // If exists, increase the quantity by 1
        return prev.map((i) =>
          i.id === item.id && i.color === color && i.size === size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        // Otherwise, add new item with selected color and size
        return [...prev, { ...item, color, size, quantity: 1 }];
      }
    });
  };

  // Remove from cart based on id, color, and size
  const removeFromCart = (id, color, size) => {
    setCart((prev) =>
      prev.filter((i) => !(i.id === id && i.color === color && i.size === size))
    );
  };

  // Update item quantity in cart
  const updateQuantity = (id, color, size, quantity) => {
    setCart((prev) =>
      prev.map((i) =>
        i.id === id && i.color === color && i.size === size
          ? { ...i, quantity }
          : i
      )
    );
  };

  // Clear all items from the cart
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
