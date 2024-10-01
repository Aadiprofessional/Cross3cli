import React, { createContext, useState, useContext, useEffect } from 'react';
import auth from '@react-native-firebase/auth';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      const userId = auth().currentUser.uid;
      if (userId) {
        try {
          const response = await fetch(`https://crossbee-server-1036279390366.asia-south1.run.app/getWishlist?uid=${userId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const data = await response.json();
          if (Array.isArray(data)) {
            setWishlist(data);
          } else {
            setWishlist([]); // Set an empty array if the response is not an array
          }
        } catch (err) {
          console.error('Failed to load wishlist:', err);
          setWishlist([]); // Handle error by setting an empty array
        }
      }
    };
  
    fetchWishlist();
  }, []);
  
  
  const addToWishlist = (product) => {
    const userId = auth().currentUser.uid; // Ensure uid is assigned here
    console.log(userId);
    if (userId) {
      console.log('User UID:', userId); // Log uid here after it's defined
      console.log('Product to add to wishlist:', product);

      fetch('https://crossbee-server-1036279390366.asia-south1.run.app/addWishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: userId,
          mainId: product.mainId,
      
          productId: product.productId,
          attribute1Id: product.attribute1Id,
          attribute2Id: product.attribute2Id,
          attribute3Id: product.attribute3Id,
        }),
      })
        .then(response => response.json())
        .then(data => {
          console.log('Add to wishlist response:', data);
          setWishlist((prevWishlist) => [...prevWishlist, product]);
        })
        .catch(error => console.error('Failed to add to wishlist:', error));
    }
  };

  const removeFromWishlist = (product) => {
    const userId = auth().currentUser.uid;
    console.log(userId);
    if (userId) {
      fetch('https://crossbee-server-1036279390366.asia-south1.run.app/removeWishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: userId,
          mainId: product.mainId,
        
          productId: product.productId,
          attribute1Id: product.attribute1Id,
          attribute2Id: product.attribute2Id,
          attribute3Id: product.attribute3Id,
        }),
      })
        .then(response => response.json())
        .then(data => {
          console.log('Removed from wishlist:', data);
          setWishlist((prevWishlist) =>
            prevWishlist.filter((item) => item.productId !== product.productId)
          );
        })
        .catch(error => console.error('Failed to remove from wishlist:', error));
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
