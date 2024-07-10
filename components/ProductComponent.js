import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../styles/color';

const ProductComponent = ({ imageSource, description, price }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    // Navigate to ProductDetailPage
    navigation.navigate('ProductDetailPage', { imageSource, description, price });
  };

  return (
    <TouchableOpacity style={styles.productContainer} onPress={handlePress}>
      <View style={styles.productContent}>
        <View style={styles.productImageContainer}>
          <View style={styles.productImage}>
            <Icon name={imageSource} size={40} color="#484848" />
          </View>
        </View>
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
    width: '48%', // Adjust based on your requirement for two products per row
    marginBottom: 20,
  },
  productContent: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  productImageContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  productImage: {
    width: 40,
    height: 40,
    // Adjust styling for product image as needed
  },
  productDescription: {
    fontSize: 12,
    color: colors.black,
    textAlign: 'center',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    color: colors.black,
    textAlign: 'center',
  },
});

export default ProductComponent;
