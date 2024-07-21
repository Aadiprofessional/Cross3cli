import React, { createContext, useState, useContext, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribeAuth = auth().onAuthStateChanged(newUser => {
      setUser(newUser);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchCartItems();
    }
  }, [user]);

  const fetchCartItems = async () => {
    if (user) {
      const cartRef = firestore().collection('users').doc(user.uid).collection('cart');
      const snapshot = await cartRef.get();
      const items = snapshot.docs.map(doc => ({ cartId: doc.id, ...doc.data() }));
      setCartItems(items);
    }
  };

  const addToCart = async (item) => {
    if (user) {
      const cartRef = firestore().collection('users').doc(user.uid).collection('cart');
      await cartRef.add(item);
      fetchCartItems(); // Refresh cart items after adding
    }
  };

  const updateCartItemQuantity = async (cartId, newQuantity) => {
    if (user) {
      const cartRef = firestore().collection('users').doc(user.uid).collection('cart');
      const itemRef = cartRef.doc(cartId);
      if (newQuantity < 1) {
        await itemRef.delete();
      } else {
        await itemRef.update({ quantity: newQuantity });
      }
      fetchCartItems(); // Refresh cart items after update
    }
  };

  const removeCartItem = async (cartId) => {
    if (user) {
      const cartRef = firestore().collection('users').doc(user.uid).collection('cart');
      const itemRef = cartRef.doc(cartId);
      await itemRef.delete();
      fetchCartItems(); // Refresh cart items after removal
    }
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, updateCartItemQuantity, removeCartItem, fetchCartItems }}
    >
      {children}
    </CartContext.Provider>
  );
};
