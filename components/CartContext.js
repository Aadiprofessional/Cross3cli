import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [nextItemId, setNextItemId] = useState(1); // State for generating unique temporary IDs

  const addToCart = (item) => {
    const newItem = { ...item, cartId: nextItemId }; // Assigning temporary ID
    setCartItems((prevItems) => [...prevItems, newItem]);
    setNextItemId(nextItemId + 1); // Incrementing for the next item
  };

  const updateCartItemQuantity = (cartId, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.cartId === cartId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeCartItem = (cartId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.cartId !== cartId));
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, updateCartItemQuantity, removeCartItem }}
    >
      {children}
    </CartContext.Provider>
  );
};
