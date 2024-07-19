import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../styles/color';
import { products } from '../data/productData'; // Import your products array

const ProductComponent = ({ id }) => {
  const navigation = useNavigation();

  // Find the product by id
  const product = products.find(item => item.id === id);

  // Handle press function
  const handlePress = () => {
    console.log(`Navigating to ProductDetailPage with productId: ${id}`);
    navigation.navigate('ProductDetailPage', { productId: id });
  };

  // Check if product exists
  if (!product) {
    return null; // Handle the case when product is not found
  }

  const { mainImage, productName, description, price } = product;

  return (
    <TouchableOpacity style={styles.productContainer} onPress={handlePress}>
      <View style={[styles.productContent, { borderColor: colors.primary }]}>
        <View style={styles.imageContainer}>
          <View style={styles.imageBox}>
            <Image source={mainImage} style={styles.productImage} />
          </View>
        </View>
        <Text style={styles.productName} numberOfLines={1}>
          {productName}
        </Text>
        <Text style={styles.productPrice}>₹{price}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productContainer: {
    width: '48%',
    aspectRatio: 1, // Ensure a square aspect ratio
    marginBottom: 20,
    backgroundColor: colors.primary,
    borderRadius: 10,
    overflow: 'hidden', // Ensure contents don't overflow the rounded corners
  },
  productContent: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  imageContainer: {
    width: '100%',
    height: '60%', // 60% of the productContent height
    aspectRatio: 1, // Ensure a square aspect ratio for the image container
    marginBottom: 10,
    alignItems: 'center',
  },
  imageBox: {
    width: '90%', // Adjust as needed for the size of the white box
    height: '100%', // Take full height of the image container
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center', // Center the image inside the white box
    justifyContent: 'center', // Center the image inside the white box
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain', // Ensure image fits inside without cropping
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold', // Bold font for product name
    color: colors.TextBlack,
    textAlign: 'center',
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 12,
    color: colors.TextBlack,
    textAlign: 'center',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    color: colors.TextBlack,
    textAlign: 'center',
  },
});

export default ProductComponent;
