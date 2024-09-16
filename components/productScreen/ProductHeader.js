import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import { colors } from '../../styles/color';

const ProductHeader = ({
  name,
  description,
  price,
  discountedPrice,
  colorDeliveryTime,
  outOfStock, // Added outOfStock prop
}) => {
  const handleCallPress = () => {
    const phoneNumber = '+919924686611';
    Linking.openURL(`tel:${phoneNumber}`);
  };

  return (
    <View style={styles.productDetails}>
      <TouchableOpacity onPress={handleCallPress} style={styles.callIconContainer}>
        <Image style={styles.callIcon} source={require('../../assets/call.png')} />
      </TouchableOpacity>
      <Text style={styles.title}>{name}</Text>

      <View style={styles.priceRow}>
        <View style={styles.priceDetails}>
          <Text style={styles.priceText}>Price:</Text>
          <Text style={styles.priceText}>
            {outOfStock
              ? 'XXXX' // Display 'xxxx' if outOfStock is true
              : Number(discountedPrice).toLocaleString('en-IN', {
                  maximumFractionDigits: 0,
                  style: 'currency',
                  currency: 'INR',
                })}
          </Text>
          {!outOfStock && (
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
    position: 'relative', // This will allow absolute positioning inside
  },
  title: {
    fontSize: 20,
    fontFamily: 'Outfit-Bold',
    marginBottom: 10,
    color: colors.TextBlack,
  },
  descriptionText: {
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    marginBottom: 5,
    color: colors.TextBlack,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Space between price details and delivery container
    alignItems: 'center', // Vertically align items
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
    marginRight: 10, // Gap between price and discounted price
  },
  discountedText: {
    fontSize: 18,
    textDecorationLine: 'line-through', // Strikethrough for the discounted price
    color: colors.TextBlack,
    fontFamily: 'Outfit-Medium',
  },
  deliveryContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Align text and icon horizontally
    position: 'absolute',
    right: -20, // Align to the right end
    top: -40, // Adjust the top position as needed
    zIndex: 30, // Ensure it's above other components
    padding: 10, // Adjust padding if needed
  },
  truckText: {
    color: '#333333',
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    marginLeft: 10, // Space between icon and text
  },
  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shippingIcon: {
    width: 25,
    height: 25,
  },
  callIconContainer: {
    position: 'absolute',
    right: -20,
    top: 70,
    padding: 10, // Adjust padding if needed
    zIndex: 40, // Ensure it's above the delivery container
  },
  callIcon: {
    width: 60,
    height: 60,
  },
});

export default ProductHeader;
