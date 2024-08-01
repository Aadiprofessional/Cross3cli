import React, { createContext, useState, useContext, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  useEffect( () => {
    // Listen for auth state changes
    const unsubscribeAuth = auth().onAuthStateChanged( newUser => {
        if ( newUser ) {
            setUser( newUser );
           
        }
    } );

    return () => unsubscribeAuth();
}, [] );

useEffect( () => {
    if ( user ) {
        const unsubscribe = firestore()
            .collection( 'users' ).doc( user.uid ).collection( 'cart' ) // Replace with your collection name
            .onSnapshot( ( snapshot ) => {
                const newItems = snapshot.docs.map( ( doc ) => ( {
                    cartId: doc.id,
                    ...doc.data()
                } ) );
                setCartItems( newItems );
            } );

        // Clean up the subscription on unmount
        return () => unsubscribe();
    }
}, [ user ] );
  


 const addToCart = async (item) => {
  if (user) {
    try {
      // Replace the URL with your API endpoint for adding items to the cart
      const response = await axios.post(`https://crossbee-server.vercel.app/addItem`, {
        uid: user.uid,
        item,
      });

      if (response.data.text) {
        console.log('Item added to cart successfully');
      
      } else {
        console.error('Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  }}
  const updateCartItemQuantity = async (cartId, newQuantity) => {
    if (user) {
      const cartRef = firestore().collection('users').doc(user.uid).collection('cart');
      const itemRef = cartRef.doc(cartId);
      if (newQuantity < 1) {
        await itemRef.delete();
      } else {
        await itemRef.update({ quantity: newQuantity });
      }
      // fetchCartItems(); // Refresh cart items after update
    }
  };

  const removeCartItem = async (cartId) => {
    if (user) {
      try {
        // Replace the URL with your API endpoint for adding items to the cart
        const response = await axios.post(`https://crossbee-server.vercel.app/removeItem`, {
          uid: user.uid,
          id: cartId,
        });
  
        if (response.data.text) {
          console.log('Item remove from cart successfully');
        
        } else {
          console.error('Failed to remove item from cart');
        }
      } catch (error) {
        console.error('Error removing item from cart:', error);
      }
    }
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, updateCartItemQuantity, removeCartItem }}
    >
      {children}
    </CartContext.Provider>
  );
};
