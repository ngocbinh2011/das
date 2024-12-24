import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [totalAmount, setTotalAmount] = useState(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    const newTotalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalAmount(newTotalAmount);
    localStorage.setItem('totalAmount', newTotalAmount);
  }, [cart]);

  const addToCart = (book, quantity) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.id === book.id);
      if (existingItem) {
        // Update quantity if the item already exists
        return prevCart.map(item =>
          item.id === book.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      // Add new item if it doesn't exist
      return [...prevCart, { ...book, quantity }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    setCart((prevCart) =>
      prevCart.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalAmount }}>
      {children}
    </CartContext.Provider>
  );
};