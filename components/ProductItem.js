// ProductItem.js

import React from 'react';
import { View, Text, StyleSheet,Image } from 'react-native';
import { colors } from '../styles/color';

const ProductItem = () => {
  return (
    <View style={styles.container}>
      <View style={styles.productContainer}>
        <View style={styles.imageContainer}>
          {/* Replace 'product.png' with your actual image import */}
          <Image source={require('../assets/product.png')} style={styles.image} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.description}>Product Description</Text>
          <Text style={styles.price}>$49.99</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  productContainer: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 10,
  },
  imageContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 5,
    marginRight: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  textContainer: {
    flex: 1,
  },
  description: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  price: {
    fontSize: 14,
    color: '#FFFFFF',
  },
});

export default ProductItem;
