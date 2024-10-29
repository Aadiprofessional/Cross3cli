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
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useWishlist } from '../../components/WishlistContext';

const ProductHeader = ({
  product,
  name,
  description,
  price,
  discountedPrice,
  colorDeliveryTime,
  outOfStock,
}) => {
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [isWished, setIsWished] = useState(
    wishlist.some((item) => item.productId === product.productId)
  );

  const handleWishlistPress = () => {
    if (isWished) {
      removeFromWishlist(product);
    } else {
      addToWishlist(product);
    }
    setIsWished(!isWished);
  };

  const handleCallPress = () => {
    const phoneNumber = '+919924686611';
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const roundedPrice = Math.round(parseFloat(price));
  const roundedDiscountedPrice = Math.round(parseFloat(discountedPrice));

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleCallPress} style={styles.callIconContainer}>
        <Image style={styles.callIcon} source={require('../../assets/call.png')} />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.heartIconContainer} onPress={handleWishlistPress}>
        <Icon name={isWished ? 'favorite' : 'favorite-border'} size={30} color={isWished ? 'red' : 'black'} />
      </TouchableOpacity>

      <View style={styles.productDetails}>
        <Text style={styles.title}>{name}</Text>
        <View style={styles.priceRow}>
          <View style={styles.priceDetails}>
            <Text style={styles.priceText}>Price:</Text>
            <Text style={styles.priceText}>
              {outOfStock
                ? 'XXXX'
                : Number(discountedPrice).toLocaleString('en-IN', {
                    maximumFractionDigits: 0,
                    style: 'currency',
                    currency: 'INR',
                  })}
            </Text>
            {!outOfStock && roundedPrice !== roundedDiscountedPrice && (
              <Text style={styles.discountedText}>
                {Number(price).toLocaleString('en-IN', {
                  maximumFractionDigits: 0,
                  style: 'currency',
                  currency: 'INR',
                })}
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* Delivery Container positioned independently */}
      <View style={styles.deliveryContainer}>
        <Image source={require('../../assets/delivery.png')} style={styles.shippingIcon} />
        <Text style={styles.truckText}>{colorDeliveryTime}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  productDetails: {
    width: '100%',
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
    right: 0, // Aligns it to the right end of the parent
    top: 25, // Adjusts vertical position; you can change this to align as needed
    padding: 10,
    zIndex: 30,
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
    right: 10,
    top: 50,
    padding: 10,
    zIndex: 40,
  },
  callIcon: {
    width: 60,
    height: 60,
  },
  heartIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 50,
  },
});

export default ProductHeader;
