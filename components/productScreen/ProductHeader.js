import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking } from 'react-native';
import { colors } from '../../styles/color';

const ProductHeader = ({ name, description, price }) => {
  const handleCall = () => {
    const phoneNumber = '9924686611';
    const url = `tel:${phoneNumber}`;
    Linking.openURL(url).catch(err => console.error('Error opening dialer:', err));
  };

  return (
    <View style={styles.productDetails}>
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.descriptionText}>{description}</Text>
      <View style={styles.priceContainer}>
        <Text style={styles.priceText}>Price: ₹{price}</Text>
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
    marginTop: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Outfit-Medium',
    marginBottom: 10,
    color: colors.TextBlack,
  },
  descriptionText: {
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    marginBottom: 5,
    color: colors.TextBlack,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  priceText: {
    fontSize: 24,
    fontFamily: 'Outfit-Medium',
    color: colors.TextBlack,
  },
  callIcon: {
    width: 65,
    height: 65,
    marginRight: -5,
  },
});

export default ProductHeader;
