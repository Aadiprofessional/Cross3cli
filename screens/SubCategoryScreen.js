import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import { colors } from '../styles/color'; // Import color styles

// Example data - Replace with actual data fetched from your source
const products = [
  { id: 1, name: 'Product 1', image: require('../assets/product.png') },
  { id: 2, name: 'Product 2', image: require('../assets/product.png') },
  { id: 3, name: 'Product 3', image: require('../assets/product.png') },
  { id: 4, name: 'Product 4', image: require('../assets/product.png') },
  { id: 5, name: 'Product 5', image: require('../assets/product.png') },
  { id: 6, name: 'Product 6', image: require('../assets/product.png') },
  { id: 7, name: 'Product 7', image: require('../assets/product.png') },
  { id: 8, name: 'Product 8', image: require('../assets/product.png') },
  { id: 9, name: 'Product 9', image: require('../assets/product.png') },
];

const SubCategoryScreen = ({ route }: { route: any }) => {
  const { subcategory } = route.params;
  const navigation = useNavigation();

  const navigateToProductDetail = (productId: number) => {
    navigation.navigate('ProductDetailPage', { productId });
  };

  return (
    <View style={styles.container}>
      {/* Product Grid */}
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {products.map((product) => (
          <TouchableOpacity
            key={product.id}
            style={styles.productItem}
            onPress={() => navigateToProductDetail(product.id)}
          >
            <View style={styles.productImageContainer}>
              <Image source={product.image} style={styles.productImage} />
            </View>
            <Text style={styles.productName}>{product.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
  },
  scrollViewContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productItem: {
    width: '30%', // Adjust based on your design
    marginBottom: 20,
  },
  productImageContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    overflow: 'hidden',
    aspectRatio: 1, // Square aspect ratio
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain', // Fit the image inside the container
  },
  productName: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default SubCategoryScreen;
