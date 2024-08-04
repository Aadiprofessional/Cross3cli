import React, {createContext, useState, useContext, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import Toast from 'react-native-toast-message';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({children}) => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = auth().onAuthStateChanged(newUser => {
      if (newUser) {
        setUser(newUser);
      } else {
        setUser(null);
        setCartItems([]); // Clear cart items on logout
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (user) {
      const unsubscribe = firestore()
        .collection('users')
        .doc(user.uid)
        .collection('cart')
        .onSnapshot(snapshot => {
          const newItems = snapshot.docs.map(doc => ({
            cartId: doc.id,
            ...doc.data(),
          }));
          setCartItems(newItems);
        });

      return () => unsubscribe();
    }
  }, [user]);

  const addToCart = async item => {
    if (user) {
      try {
        const response = await axios.post(
          `https://crossbee-server.vercel.app/addItem`,
          {
            uid: user.uid,
            item,
          },
        );

        if (response.data.text) {
          Toast.show({
            type: 'success',
            position: 'bottom',
            text1: 'Item added to cart successfully',
          });
        } else {
          Toast.show({
            type: 'error',
            position: 'bottom',
            text1: 'Failed to add item to cart',
          });
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Error adding item to cart',
          text2: error.message,
        });
      }
    }
  };

  const updateCartItemQuantity = async (cartId, newQuantity) => {
    if (user) {
      const cartRef = firestore()
        .collection('users')
        .doc(user.uid)
        .collection('cart');
      const itemRef = cartRef.doc(cartId);
      try {
        if (newQuantity < 1) {
          await itemRef.delete();
          Toast.show({
            type: 'success',
            position: 'bottom',
            text1: 'Item removed from cart successfully',
            text2: 'Quantity was less than 1',
          });
        } else {
          await itemRef.update({quantity: newQuantity});
          Toast.show({
            type: 'success',
            position: 'bottom',
            text1: 'Item quantity updated',
          });
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Error updating cart item',
          text2: error.message,
        });
      }
    }
  };

  const removeCartItem = async cartId => {
    if (user) {
      try {
        const response = await axios.post(
          `https://crossbee-server.vercel.app/removeItem`,
          {
            uid: user.uid,
            id: cartId,
          },
        );

        if (response.data.text) {
          Toast.show({
            type: 'success',
            position: 'bottom',
            text1: 'Item removed from cart successfully',
          });
        } else {
          Toast.show({
            type: 'error',
            position: 'bottom',
            text1: 'Failed to remove item from cart',
          });
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Error removing item from cart',
          text2: error.message,
        });
      }
    }
  };

  return (
    <CartContext.Provider
      value={{cartItems, addToCart, updateCartItemQuantity, removeCartItem}}>
      {children}
    </CartContext.Provider>
  );
};
