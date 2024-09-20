import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useCart } from '../components/CartContext';
import { useWishlist } from './WishlistContext';
import { colors } from '../styles/color';

const ProductComponent = ({ product }) => {
  const navigation = useNavigation();
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  
  // Check if the product is already in the wishlist
  const [isWished, setIsWished] = useState(wishlist.some(item => item.productId === product.productId));

  const handleWishlistPress = () => {
    // Toggle the wishlist state
    if (isWished) {
      removeFromWishlist(product);  // Remove product from wishlist
    } else {
      addToWishlist(product);  // Add product to wishlist
    }
    setIsWished(!isWished);  // Update the heart icon
  };

  const handlePress = () => {
    navigation.navigate('ProductDetailPage', {
      mainId: product.mainId,
      categoryId: product.categoryId,
      productId: product.productId,
      attribute1D: product.attribute1,
      attribute2D: product.attribute2,
      attribute3D: product.attribute3,
    });
  };

  const handleAddToCart = () => {
    // Add product to cart (same as in your original code)
    if (product) {
      const item = {
        productName: product.displayName,
        productId: product.productId,
        price: product.price,
        bag:product.bag,
        quantity: 1,  // You can adjust this logic
        image: product.image || product.mainImage,
        additionalDiscount: product.additionalDiscount || 0,
        mainId: product.mainId,
        categoryId: product.categoryId,
      };
      addToCart(item);  // Call the function from useCart
    }
  };

  const discountPercentage = product.additionalDiscount;
  const cutPrice = (product.price * (1 - discountPercentage / 100)).toFixed(0);

  return (
    <TouchableOpacity style={styles2.productContainer} onPress={handlePress}>
      <View style={styles2.productContent}>
        <View style={styles2.imageContainer}>
          <Image
            source={{
              uri: product.image || product.mainImage || 'https://firebasestorage.googleapis.com/v0/b/crossbee.appspot.com/o/no.png?alt=media&token=a464f751-0dc1-4759-945e-96ac1a5f3656',
            }}
            style={styles2.productImage}
          />
        </View>

        <Text style={styles2.productName} numberOfLines={1}>
          {product.displayName}
        </Text>

        {/* Heart Icon for Wishlist */}
        <TouchableOpacity style={styles2.heartIconContainer} onPress={handleWishlistPress}>
          <Icon
            name={isWished ? 'favorite' : 'favorite-border'}
            size={24}
            color={isWished ? 'red' : 'black'}
          />
        </TouchableOpacity>

        {/* Price and Discount */}
        {discountPercentage ? (
          <View style={styles2.discountContainer}>
            <Text style={styles2.discountText}>{discountPercentage}% OFF</Text>
            <Text style={styles2.cutPriceText}>
              {Number(product.price).toLocaleString('en-IN', {
                maximumFractionDigits: 0,
                style: 'currency',
                currency: 'INR',
              })}
            </Text>
          </View>
        ) : null}

        <View style={styles2.hotDealsContainer}>
          <Text style={styles2.originalPriceText}>
            {Number(cutPrice).toLocaleString('en-IN', {
              maximumFractionDigits: 0,
              style: 'currency',
              currency: 'INR',
            })}
          </Text>
        </View>

        <View style={styles2.actionButtonContainer}>
            {product.outOfStock ? (
              <View style={styles2.outOfStockButton}>
                <Text style={styles2.outOfStockText}>Out of Stock</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles2.addToCartButton}
                onPress={handleAddToCart}
              >
                <Text style={styles2.addToCartText}>Add to Cart</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles2.productDetailButton}
              onPress={handlePress}
            >
              <Text style={styles2.productDetailText}>Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

const styles2 = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 10, // Add padding around the entire container
    backgroundColor: '#fff',
    paddingVertical: 10,
  },
  heartIconContainer: {
    position: 'absolute',
    top: 165,
    right: 10,
    zIndex: 100,
  },
  productList: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Wraps the cards when needed
    justifyContent: 'space-between', // Evenly distribute space between items
  },
  productContainer: {
    width: '48%',
    height: 300, // Set fixed height for consistency
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    marginLeft: 5,
    borderColor: '#ddd',
    position: 'relative', // Enable absolute positioning for child elements
  },
  productContent: {
    flex: 1,
    padding: 10,
    alignItems: 'flex-start',
    width: '100%',
    position: 'relative',
  },
  imageContainer: {
    width: '100%',
    height: 150,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  productName: {
    fontSize: 12,
    color: colors.TextBlack,
    fontFamily: 'Outfit-Bold',
    textAlign: 'left',
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  discountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  discountText: {
    fontSize: 10,
    color: 'green',
    marginRight: 5,
    fontFamily: 'Outfit-Bold',
  },
  cutPriceText: {
    fontSize: 10,
    textDecorationLine: 'line-through',
    color: colors.TextBlack,
    fontFamily: 'Outfit-Medium',
    marginRight: 5,
  },
  originalPriceText: {
    fontSize: 15,
    color: colors.TextBlack,
    fontFamily: 'Outfit-Bold',
    marginLeft: 4,
  },
  hotDealsContainer: {
    alignItems: 'center',
  },
  actionButtonContainer: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10, // Add some padding around the buttons
  },
  addToCartButton: {
    backgroundColor: '#FCCC51',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    flex: 0, // Make the button occupy equal width
    marginRight: 10, // Space between buttons
  },
  productDetailButton: {
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 0, // Make the button occupy equal width
  },
  addToCartText: {
    color: '#333',
    fontFamily: 'Outfit-Medium',
    fontSize: 10,
  },

  productDetailText: {
    color: '#333',
    fontFamily: 'Outfit-Medium',
    fontSize: 10,
  },
  lowestPriceLabel: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: colors.second,
    padding: 5,
    borderRadius: 5,
    zIndex: 100,
  },
  lowestPriceText: {
    color: 'white',
    fontFamily: 'Outfit-Medium',
  },
  outOfStockButton: {
    borderColor: 'red',
    borderWidth: 0,
    borderRadius: 15,
    paddingVertical: 5,

    alignItems: 'center',
    backgroundColor: '#fff',
    marginRight: 15, // Add some spacing
  },
  outOfStockText: {
    color: 'red',
    fontFamily: 'Outfit-Bold',
    fontSize: 12,
  },
});

export default ProductComponent;
