import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../styles/color';
import styles from '../styles/styles'; // Import the styles

const ProductComponent = ({product}) => {
  const navigation = useNavigation();

  // Handle press function
  const handlePress = () => {
    console.log(
      `Navigating to ProductDetailPage with productId: ${product.productId}`,
    );
    navigation.navigate('ProductDetailPage', {
      mainId: product.mainId,
      categoryId: product.categoryId,
      productId: product.productId,
    });
  };

  return (
    <TouchableOpacity style={styles.productContainer} onPress={handlePress}>
      <View style={[styles.productContent, {borderColor: colors.primary}]}>
        <View style={styles.imageContainer}>
          <View style={styles.imageBox}>
            <Image source={{uri: product.image}} style={styles.productImage} />
          </View>
        </View>
        <Text style={styles.productName} numberOfLines={1}>
          {product.displayName}
        </Text>
        <Text style={styles.productPrice}>₹{product.price}</Text>
      </View>
    </TouchableOpacity>
  );
};

const LatestProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          'https://crossbee-server.vercel.app/latestProducts',
        );
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Latest Products</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.productList}>
        {products.map(product => (
          <View key={product.productId} style={styles.productWrapper}>
            <ProductComponent product={product} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default LatestProducts;
