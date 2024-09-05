import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
} from 'react-native';
import { colors } from '../../styles/color';

const ProductHeader = ({
  name,
  description,
  price,
  scrollViewRef,
  colorDeliveryTime,
  discountedPrice
}) => {
  const handleCall = () => {
    const phoneNumber = '9924686611';
    const url = `tel:${phoneNumber}`;
    Linking.openURL(url).catch(err =>
      console.error('Error opening dialer:', err),
    );
  };

  const formatPrice = price => {
    return price
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      .replace(/\d(?=(\d{2})+\d{3}\b)/g, '$&,');
  };

  const handleViewMore = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  return (
    <View style={styles.productDetails}>
      <View style={styles.priceContainer2}>
        <Text style={styles.title}>{name}</Text>
        <View style={styles.deliveryContainer}>
          <Image
            source={require('../../assets/delivery.png')}
            style={styles.shippingIcon}
          />
          <Text style={styles.truckText}>{colorDeliveryTime} Days</Text>
        </View>
      </View>
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionText}>
          {description.length > 20
            ? `${description.substring(0, 20)}...`
            : description}
        </Text>
        {description.length > 20 && (
          <TouchableOpacity onPress={handleViewMore}>
            <Text style={styles.viewMoreText}>View More</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.priceContainer}>
      <Text style={styles.priceText}>Price:</Text>
        <Text style={styles.priceText2}>₹{formatPrice(price)}</Text>
        <Text style={styles.priceText}>₹{formatPrice(discountedPrice)}</Text>
        <TouchableOpacity onPress={handleCall}>
          <Image
            source={require('../../assets/call.png')}
            style={styles.callIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  productDetails: {
    width: '90%',
    marginTop: 10,
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
  viewMoreText: {
    color: colors.main,
    fontSize: 14,
    fontFamily: 'Outfit-Bold',
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  priceContainer2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Distributes space between name and delivery info
    marginTop: 10,
  },
  deliveryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  truckText: {
    color: '#333333',
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    marginLeft: 10, // Space between icon and text
  },
  descriptionContainer: {
    flexDirection: 'row',  // Align items in a row
    alignItems: 'center',  // Vertically center the text
  },
  shippingIcon: {
    width: 25,
    height: 25,
  },
  priceText: {
    fontSize: 24,
    fontFamily: 'Outfit-Medium',
    color: colors.TextBlack,
  },
  priceText2: {
    fontSize: 18,
    textDecorationLine: 'line-through',
    color: colors.TextBlack,
    fontFamily: 'Outfit-Medium',
    marginRight: -80,
    marginLeft : -85,
  },
  callIcon: {
    width: 65,
    height: 65,
    position: 'absolute',
    bottom: -50,
    right: -20,
    zIndex: 100,
  },
});

export default ProductHeader;
