import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../components/CartContext';
import { useWishlist } from './WishlistContext';
import { colors } from '../styles/color';
import LinearGradient from 'react-native-linear-gradient';

const ProductComponent = ({ product, lowestPrice, cartVisible }) => { // Added cartVisible prop
  const navigation = useNavigation();
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const minCartValue = parseInt(product.minCartValue, 10) || 1;
  const [quantity, setQuantity] = useState(minCartValue);
  const [isWished, setIsWished] = useState(wishlist.some(item => item.productId === product.productId));
  const [loading, setLoading] = useState(true); // Loading state
  const animatedValue = useRef(new Animated.Value(0)).current;

  const gradientInterpolation = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#e0e0e0', '#f0f0f0'], // Change the gradient colors as per your need
  });

  const handleWishlistPress = () => {
    if (isWished) {
      removeFromWishlist(product);
    } else {
      addToWishlist(product);
    }
    setIsWished(!isWished);
  };

  const handlePress = () => {
    navigation.navigate('ProductDetailPage', {
      mainId: product.mainId,
      productId: product.productId,
      attribute1D: product.attribute1,
      attribute2D: product.attribute2,
      attribute3D: product.attribute3,
      mainName: product.mainName,
      productName: product.product
    });
  };
  console.log(product);

  const handleAddToCart = () => {
    if (!product.outOfStock && quantity > 0) {
      const item = {
        productName: product.displayName,
        productId: product.productId,
        price: product.price,
        quantity: minCartValue * product.bag,
        image: product.image || product.mainImage,
        colorminCartValue: minCartValue,
        attributeSelected1: product.attribute1,
        bag: product.bag,
        attributeSelected2: product.attribute2,
        attributeSelected3: product.attribute3,
        attribute1: product.attribute1,
        attribute2: product.attribute2,
        attribute3: product.attribute3,
        attribute1Id: product.attribute1Id,
        attribute2Id: product.attribute2Id,
        attribute3Id: product.attribute3Id,
        additionalDiscount: product.additionalDiscount || 0,
        mainId: product.mainId,
        discountedPrice: cutPrice,
        name: product.attribute3,
        colormaxCartValue: product.inventory,
        gst: product.gst,
      };

      addToCart(item);
      console.log('Adding to cart:', item);
    }
  };

  const discountPercentage = product.additionalDiscount;
  const cutPrice = (product.price * (1 - discountPercentage / 100)).toFixed(0);


  return (
    <TouchableOpacity style={styles.productContainer} onPress={handlePress}>
      <View style={styles.productContent}>
        {product.lowestPrice && (
          <View style={styles.lowestPriceLabel}>
            <Text style={styles.lowestPriceText}>Highest Discount</Text>
          </View>
        )}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: (product.image && !product.image.includes('undefined'))
                ? product.image
                : (product.mainImage && !product.mainImage.includes('undefined'))
                  ? product.mainImage
                  : 'https://firebasestorage.googleapis.com/v0/b/crossbee.appspot.com/o/no.png?alt=media&token=a464f751-0dc1-4759-945e-96ac1a5f3656',
            }}
            style={styles.productImage}
          />

        </View>

        <View style={styles.productNameContainer}>
          <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">
            {product.displayName}
          </Text>
          <TouchableOpacity style={styles.heartIconContainer} onPress={handleWishlistPress}>
            <Icon
              name={isWished ? 'favorite' : 'favorite-border'}
              size={24}
              color={isWished ? 'red' : 'black'}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.productName2} numberOfLines={1}>
          {product.attribute1},{product.attribute2},{product.attribute3}
        </Text>
        {discountPercentage ? (
          <View style={styles.discountContainer}>
            <Text style={styles.discountText}>{discountPercentage}% OFF</Text>
            <Text style={styles.cutPriceText}>
              {Number(product.price).toLocaleString('en-IN', {
                maximumFractionDigits: 0,
                style: 'currency',
                currency: 'INR',
              })}
            </Text>
          </View>
        ) : null}

        <View style={styles.hotDealsContainer}>
          <Text style={styles.originalPriceText}>
            {Number(cutPrice).toLocaleString('en-IN', {
              maximumFractionDigits: 0,
              style: 'currency',
              currency: 'INR',
            })}
          </Text>
        </View>

        <View style={styles.footerContainer}>
          {cartVisible ? null : (
            product.outOfStock ? (
              <View style={styles.outOfStockButton}>
                <Text style={styles.outOfStockText}>Out of Stock</Text>
              </View>
            ) : (
              <>
                <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
                  <Text style={styles.addToCartText}>Add to Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.productDetailButton} onPress={handlePress}>
                  <Text style={styles.productDetailText}>Details</Text>
                </TouchableOpacity>
              </>
            )
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  skeletonContainer: {
    width: '48%',
    height: 270,
    marginVertical: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  skeletonImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
  },
  skeletonText: {
    width: '80%',
    height: 15,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginVertical: 5,
  },
  skeletonTextSmall: {
    width: '50%',
    height: 15,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginVertical: 5,
  },
  productContainer: {

    height: 270, // Fixed height
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginLeft: 5,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  productContent: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'space-between', // Ensure items are spaced between
  },
  imageContainer: {
    width: '100%',
    height: 120,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  
  productNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 15,
    color: colors.TextBlack,
    fontFamily: 'Outfit-Bold',
    flex: 1,
    paddingRight: 30, // Add padding to avoid overlap with heart icon
  },
  heartIconContainer: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  
  productName2: {
    fontSize: 13,
    color: colors.TextBlack,
    fontFamily: 'Outfit-Medium',
    marginVertical: 0, // Remove vertical margin
    flex: 1,
  },
  discountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  discountText: {
    fontSize: 10,
    color: 'green',
    marginRight: 5,
  },
  cutPriceText: {
    fontSize: 10,
    textDecorationLine: 'line-through',
    color: colors.TextBlack,
  },
  originalPriceText: {
    fontSize: 15,
    color: colors.TextBlack,
    fontFamily: 'Outfit-Bold',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 10, // Add padding to create gap with content above
  },
 
  productDetailButton: {
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    flex: 1,
  },
  addToCartButton: {
    backgroundColor: '#FCCC51',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    flex: 1,
    marginRight: 5,
  },
  
  productDetailText: {
    color: '#333',
    fontFamily: 'Outfit-Medium',
    fontSize: 9,
    textAlign: 'center',
    textAlignVertical: 'center', // Center text vertically on Android
  },
  addToCartText: {
    color: '#333',
    fontFamily: 'Outfit-Medium',
    fontSize: 9,
    textAlign: 'center',
    textAlignVertical: 'center', // Center text vertically on Android
  },
  
  outOfStockButton: {
    borderColor: 'red',
    borderWidth: 0,
    borderRadius: 15,
    paddingVertical: 5,
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '100%',
  },
  outOfStockText: {
    color: 'red',
    fontFamily: 'Outfit-Bold',
    fontSize: 12,
  },
  lowestPriceLabel: {
    position: 'absolute',
    top: 1,
    left: 1,
    backgroundColor: colors.second,
    padding: 5,
    borderRadius: 5,
    zIndex: 100,
  },
  lowestPriceText: {
    color: 'white',
  },
});

export default ProductComponent;
