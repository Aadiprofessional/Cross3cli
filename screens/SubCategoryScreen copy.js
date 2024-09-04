import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {colors} from '../styles/color';

const SubCategoryScreen2 = ({route}) => {
  const {name} = route.params || {}; // Use `name` to fetch data
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await axios.post(
        'https://crossbee-server-1036279390366.asia-south1.run.app/getCategories',
        {
          main: name, // Use `name` as main category parameter
        },
      );

      console.log('Fetched products:', response.data); // Log the fetched data
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products: ', error);
      setLoading(false);
    }
  }, [name]);

  useEffect(() => {
    if (name) {
      fetchProducts();
    }
  }, [name, fetchProducts]);

  const navigateToSubCategory = useCallback(
    (mainId, categoryId) => {
      navigation.navigate('SubCategoryScreen', {mainId, categoryId});
    },
    [navigation],
  );

  const productItems = useMemo(
    () =>
      products.map(product => (
        <TouchableOpacity
          key={product.id}
          style={styles.productItem}
          onPress={() => navigateToSubCategory(name, product.id)} // Navigate to SubCategoryScreen with mainId and categoryId
        >
          <View style={styles.productImageContainer}>
            <Image
              source={{uri: product.image}} // Use product.image
              style={styles.productImage}
            />
          </View>
          <Text style={styles.productName}>{product.name}</Text>
        </TouchableOpacity>
      )),
    [products, navigateToSubCategory],
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {productItems.length > 0 ? (
            productItems
          ) : (
            <View style={styles.noProductsContainer}>
              <Text style={styles.noProductsText}>No products found</Text>
            </View>
          )}
        </ScrollView>
      )}
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
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  productItem: {
    width: '30%',
    marginBottom: 20,
    marginLeft: '3.33%', // Add some right margin for spacing
  },
  productImageContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    overflow: 'hidden',
    aspectRatio: 1,
    marginTop: 10,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  productName: {
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    textAlign: 'center',
    color: colors.TextBlack,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noProductsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noProductsText: {
    fontSize: 18,
    fontFamily: 'Outfit-Medium',
    color: colors.TextBlack,
  },
});

export default SubCategoryScreen2;
