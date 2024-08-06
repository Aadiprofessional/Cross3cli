import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../styles/color';

const ProductComponent = ({
  id,
  productName,
  imageSource,
  price,
  categoryId,
  mainId,
}) => {
  const navigation = useNavigation();

  const handlePress = () => {
    console.log(`Navigating to ProductDetailPage with productId: ${id}`);
    navigation.navigate('ProductDetailPage', {
      mainId,
      categoryId,
      productId: id,
    });
  };

  return (
    <TouchableOpacity style={styles.productContainer} onPress={handlePress}>
      <View style={[styles.productContent, {borderColor: colors.primary}]}>
        <View style={styles.imageContainer}>
          <View style={styles.imageBox}>
            <Image source={{uri: imageSource}} style={styles.productImage} />
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
  productList: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productWrapper: {
    width: 180, // Adjust width to control the size of the product container
    marginRight: 10, // Space between product containers
  },
  productContainer: {
    width: '47%',
    aspectRatio: 1, // Ensure a square aspect ratio
    backgroundColor: colors.primary,
    borderRadius: 10,
    overflow: 'hidden', // Ensure contents don't overflow the rounded corners
    marginBottom: 10,
  },
  productContent: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 2,
    alignItems: 'center',
    borderWidth: 1,
  },
  imageContainer: {
    width: '100%',
    height: '70%', // 60% of the productContent height
    aspectRatio: 1, // Ensure a square aspect ratio for the image container
    marginBottom: 1,
    marginTop: 3,
    alignItems: 'center',
  },
  imageBox: {
    width: '130%', // Adjust as needed for the size of the white box
    height: '100%', // Take full height of the image container
    backgroundColor: 'white',
    borderRadius: 5,
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
  productPrice: {
    fontSize: 16,
    color: colors.TextBlack,
    textAlign: 'center',
  },
});

export default ProductComponent;
