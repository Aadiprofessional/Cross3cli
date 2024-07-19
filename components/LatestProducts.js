import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { colors } from '../styles/color';
import ProductComponent from './ProductComponent'; // Import the ProductComponent
import { products } from '../data/productData'; // Ensure you have the correct path for productData

const LatestProducts = () => {
  const handleDealPress = (dealId) => {
    console.log(`Clicked on deal ${dealId}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Latest Products</Text>
      <ScrollView contentContainerStyle={styles.productList}>
        {products && products.map(product => (
          <ProductComponent
            key={product.id}
            id={product.id}
            productName={product.productName} // Pass necessary props to ProductComponent
            description={product.description}
            price={product.price}
            mainImage={product.mainImage} // Ensure this matches your product structure
          />
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
    fontWeight: '600',
    marginBottom: 10,
    marginLeft: 10,
    color: colors.TextBlack,
  },
  productList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default LatestProducts;
