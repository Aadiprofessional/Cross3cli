import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../styles/color';
import {products} from '../data/productData'; // Import your products array

const ProductComponent = ({id}) => {
  const navigation = useNavigation();

  // Find the product by id
  const product = products.find(item => item.id === id);

  // Handle press function
  const handlePress = () => {
    console.log(`Navigating to ProductDetailPage with productId: ${id}`);
    navigation.navigate('ProductDetailPage', {productId: id});
  };

  // Check if product exists
  if (!product) {
    return null; // Handle the case when product is not found
  }

  const {mainImage, productName, price} = product;

  return (
    <TouchableOpacity style={styles.productContainer} onPress={handlePress}>
      <View style={[styles.productContent, {borderColor: colors.primary}]}>
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

const UpcomingProducts = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upcoming Products</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.productList}>
        {products &&
          products.map(product => (
            <View key={product.id} style={styles.productWrapper}>
              <ProductComponent id={product.id} />
            </View>
          ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    paddingVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Outfit-Bold',
    marginBottom: 10,
    marginLeft: 10,
    color: colors.TextBlack,
    
  },
  productList: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productWrapper: {
    width: 180, // Adjust width to control the size of the product container
    marginRight: 10, // Space between product containers
  },
  productContainer: {
    width: '100%',
    aspectRatio: 1, // Ensure a square aspect ratio
    backgroundColor: colors.primary,
    borderRadius: 10,
    overflow: 'hidden', // Ensure contents don't overflow the rounded corners
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
    fontFamily: 'Outfit-Bold',
    color: colors.TextBlack,
    textAlign: 'center',
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 12,
    fontFamily: 'Outfit-Bold',
    color: colors.TextBlack,
    textAlign: 'center',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontFamily: 'Outfit-Bold',
    color: colors.TextBlack,
    textAlign: 'center',
  },
});

export default UpcomingProducts;
