import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../styles/color'; // Assuming you have defined colors elsewhere

const ProductComponent = ({ id, mainImage, description, price }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    console.log(`Navigating to ProductDetailPage with productId: ${id}`);
    navigation.navigate('ProductDetailPage', { productId: id });
  };

  return (
    <TouchableOpacity style={styles.productContainer} onPress={handlePress}>
      <View style={styles.productContent}>
        <Image source={mainImage} style={styles.productImage} />
        <Text style={styles.productDescription} numberOfLines={2}>
          {description}
        </Text>
        <Text style={styles.productPrice}>{price}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productContainer: {
    width: '48%',
    marginBottom: 20,
  },
  productContent: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  productImage: {
    width: 120,
    height: 120,
    marginBottom: 10,
    resizeMode: 'cover',
  },
  productDescription: {
    fontSize: 14,
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
