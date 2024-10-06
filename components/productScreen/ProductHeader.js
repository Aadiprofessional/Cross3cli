import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import { colors } from '../../styles/color';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import MaterialIcons for the heart icon
import { useWishlist } from '../../components/WishlistContext'; // Import WishlistContext

const ProductHeader = ({
  product,
  name,
  description,
  price,
  discountedPrice,
  colorDeliveryTime,
  outOfStock, // Added outOfStock prop
}) => {
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist(); // Access wishlist and functions
  const [isWished, setIsWished] = useState(
    wishlist.some((item) => item.productId === product.productId) // Check if the product is already in the wishlist
  );

  const handleWishlistPress = () => {
    if (isWished) {
      removeFromWishlist(product); // Remove product from wishlist
    } else {
      addToWishlist(product); // Add product to wishlist
    }
    setIsWished(!isWished); // Update the heart icon state
  };

  const handleCallPress = () => {
    const phoneNumber = '+919924686611';
    Linking.openURL(`tel:${phoneNumber}`);
  };

  return (
    <View style={styles.productDetails}>
      <TouchableOpacity onPress={handleCallPress} style={styles.callIconContainer}>
        <Image style={styles.callIcon} source={require('../../assets/call.png')} />
      </TouchableOpacity>
      
      {/* Wishlist Heart Icon */}
      <TouchableOpacity style={styles.heartIconContainer} onPress={handleWishlistPress}>
        <Icon name={isWished ? 'favorite' : 'favorite-border'} size={30} color={isWished ? 'red' : 'black'} />
      </TouchableOpacity>

      <Text style={styles.title}>{name}</Text>

      <View style={styles.priceRow}>
        <View style={styles.priceDetails}>
          <Text style={styles.priceText}>Price:</Text>
          <Text style={styles.priceText}>
            {outOfStock
              ? 'XXXX' // Display 'XXXX' if outOfStock is true
              : Number(discountedPrice).toLocaleString('en-IN', {
                  maximumFractionDigits: 0,
                  style: 'currency',
                  currency: 'INR',
                })}
          </Text>
          {!outOfStock && price !== discountedPrice && (
            <Text style={styles.discountedText}>
              {Number(price).toLocaleString('en-IN', {
                maximumFractionDigits: 0,
                style: 'currency',
                currency: 'INR',
              })}
            </Text>
          )}
        </View>
        <View style={styles.deliveryContainer}>
          <Image
            source={require('../../assets/delivery.png')}
            style={styles.shippingIcon}
          />
          <Text style={styles.truckText}>{colorDeliveryTime} Days</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  productDetails: {
    width: '90%',
    marginTop: 10,
    position: 'relative',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Outfit-Bold',
    marginBottom: 10,
    color: colors.TextBlack,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  priceDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 24,
    fontFamily: 'Outfit-Medium',
    color: colors.TextBlack,
    marginRight: 10,
  },
  discountedText: {
    fontSize: 18,
    textDecorationLine: 'line-through',
    color: colors.TextBlack,
    fontFamily: 'Outfit-Medium',
  },
  deliveryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: -40,
    top: -40,
    zIndex: 30,
    padding: 10,
  },
  truckText: {
    color: '#333333',
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    marginLeft: 10,
  },
  shippingIcon: {
    width: 25,
    height: 25,
  },
  callIconContainer: {
    position: 'absolute',
    right: -30,
    top: 40,
    padding: 10,
    zIndex: 40,
  },
  callIcon: {
    width: 60,
    height: 60,
  },
  heartIconContainer: {
    position: 'absolute',
    top: -20,
    right: -30,
    zIndex: 50,
  },
});

export default ProductHeader;
