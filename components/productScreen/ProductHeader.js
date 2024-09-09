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
  const handleCallPress = () => {
    const phoneNumber = '+919924686611';
    Linking.openURL(`tel:${phoneNumber}`);
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

      <View style={styles.priceRow}>
        <View style={styles.priceDetails}>
        <Text style={styles.priceText}>Price:</Text>
          <Text style={styles.priceText}>
            {Number(discountedPrice).toLocaleString("en-IN", {
              maximumFractionDigits: 0,
              style: 'currency',
              currency: 'INR',
            })}
          </Text>
          <Text style={styles.discountedText}>
            {Number(price).toLocaleString("en-IN", {
              maximumFractionDigits: 0,
              style: 'currency',
              currency: 'INR',
            })}
          </Text>
        </View>
        <TouchableOpacity onPress={handleCallPress}>
          <Image style={styles.callIcon} source={require('../../assets/call.png')} />
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
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Space between price details and call icon
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
  callIcon: {
    width: 60,
    height: 60,
  },
});

export default ProductHeader;
