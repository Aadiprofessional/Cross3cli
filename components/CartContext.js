import React, { createContext, useState, useContext, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const user = auth().currentUser; // Get the currently logged-in user
  const cartRef = firestore().collection('users').doc(user?.uid).collection('cart');

  useEffect(() => {
    const unsubscribe = cartRef.onSnapshot(snapshot => {
      const items = snapshot.docs.map(doc => ({ cartId: doc.id, ...doc.data() }));
      setCartItems(items);
    });

    return () => unsubscribe();
  }, [user]);

  const addToCart = async (item) => {
    await cartRef.add(item); // Add item to Firestore
  };

  const updateCartItemQuantity = async (cartId, newQuantity) => {
    const itemRef = cartRef.doc(cartId);
    if (newQuantity < 1) {
      await itemRef.delete();
    } else {
      await itemRef.update({ quantity: newQuantity });
    }
  };

  const removeCartItem = async (cartId) => {
    const itemRef = cartRef.doc(cartId);
    await itemRef.delete();
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, updateCartItemQuantity, removeCartItem }}
    >
      {children}
    </CartContext.Provider>
  );
};
