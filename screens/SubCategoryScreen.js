import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import auth from '@react-native-firebase/auth';
import { useCart } from '../components/CartContext'; // Ensure this path is correct
import { colors } from '../styles/color'; // Ensure this path is correct

const SubCategoryScreen = ({ route }) => {
  const { mainId, categoryId } = route.params || {};
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    const userId = auth().currentUser?.uid;
    if (!userId) {
      console.error('User is not authenticated');
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post(
        'https://crossbee-server-1036279390366.asia-south1.run.app/products?uid=' + userId,
        {
          main: mainId,
          category: categoryId,
        },
      );

      console.log('Fetched products:', response.data);
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products: ', error);
      setLoading(false);
    }
  }, [mainId, categoryId]);

  useEffect(() => {
    if (mainId && categoryId) {
      fetchProducts();
    }
  }, [mainId, categoryId, fetchProducts]);

  const [isWished, setIsWished] = useState(false);
  const { addToCart } = useCart();

  const handlePress = (product) => {
    if (!product) return;
    console.log(
      `Navigating to ProductDetailPage with productId: ${product.productId}`,
    );
    navigation.navigate('ProductDetailPage', {
      mainId: product.mainId,
      categoryId: product.categoryId,
      productId: product.productId,
    });
  };

  const renderProductItem = (product) => {
    const discountPercentage = product.additionalDiscount;
    const minCartValue = parseInt(product.minCartValue, 10) || 1;
    const cutPrice = (product.price * (1 - discountPercentage / 100)).toFixed(0);
    if (!product) return null;

    const handleAddToCart = (product) => {
      if (!product) return;
      const minCartValue = parseInt(product.minCartValue, 10) || 1;
      if (minCartValue > 0) {
        const item = {
          productName: product.displayName,
          productId: product.productId,
          price: product.price,
          quantity: minCartValue,
          image: product.mainImage || 'default_image_url',
          colorminCartValue: minCartValue,
          attributeSelected1: product.attribute1,
          attributeSelected2: product.attribute2,
          attributeSelected3: product.attribute3,
          additionalDiscount: product.additionalDiscount || 0,
          discountedPrice: cutPrice,
          mainId: product.mainId,
          categoryId: product.categoryId,
        };

        addToCart(item);
      }
    };

    return (
      <TouchableOpacity
        key={product.productId}
        style={styles.productContainer}
        onPress={() => handlePress(product)}
      >
        <View style={styles.productContent}>
          <View style={styles.imageContainer}>
            <View style={styles.imageBox}>
              <Image
                source={{ uri: product.mainImage || 'https://firebasestorage.googleapis.com/v0/b/crossbee.appspot.com/o/no.png?alt=media&token=a464f751-0dc1-4759-945e-96ac1a5f3656' }}
                style={styles.productImage}
              />
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
            <Text style={styles.productName} numberOfLines={1}>
              {product.displayName}
            </Text>
          </View>
          <View style={styles.discountContainer}>
            <Text style={styles.discountText}>{discountPercentage}% OFF</Text>
            <Text style={styles.cutPriceText}>₹{product.price}</Text>
          </View>
          <View style={styles.hotDealsContainer}>
            <Text style={styles.originalPriceText}>₹{cutPrice}</Text>
          </View>
          <View style={styles.actionButtonContainer}>
            {product.outOfStock ? (
              <View style={styles.outOfStockButton}>
                <Text style={styles.outOfStockText}>Out of Stock</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.addToCartButton}
                onPress={handleAddToCart}>
                <Text style={styles.addToCartText}>Add to Cart</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.productDetailButton}
              onPress={() => handlePress(product)}
            >
              <Text style={styles.productDetailText}>Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {products.length > 0 ? (
            <View style={styles.productList}>
              {products.map((product) => renderProductItem(product))}
            </View>
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
    marginTop: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    paddingVertical: 10,
  },
  productList: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Ensure products wrap to the next line
    justifyContent: 'space-between', // Distribute space between items
  },
  productContainer: {
    width: '48%', // This makes two products fit in one row
    marginBottom: 16, // Add some spacing between rows
    borderWidth: 1,
    borderColor: '#ECECEC',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  outOfStockText: {color: '#FF0000', fontFamily: 'Outfit-Medium', fontSize: 14},
  productContent: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    alignItems: 'flex-start',
  },
  imageContainer: {
    width: '100%',
    height: 100,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  imageBox: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  productName: {
    fontSize: 12,
    color: colors.TextBlack,
    fontFamily: 'Outfit-Bold',
    textAlign: 'left',
    marginVertical: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  discountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  discountText: {
    fontSize: 10,
    color: 'green',
    marginRight: 5,
    fontFamily: 'Outfit-Bold',
  },
  cutPriceText: {
    fontSize: 10,
    textDecorationLine: 'line-through',
    color: colors.TextBlack,
    fontFamily: 'Outfit-Medium',
    marginRight: 5,
  },
  originalPriceText: {
    fontSize: 15,
    color: colors.TextBlack,
    fontFamily: 'Outfit-Bold',
  },
  hotDealsContainer: {
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  actionButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  addToCartButton: {
    backgroundColor: '#FCCC51',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginLeft: -15,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#333',
    fontFamily: 'Outfit-Medium',
    fontSize: 12,
  },
  productDetailButton: {
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 15,
    paddingVertical: 5,
    marginLeft: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  productDetailText: {
    color: '#333',
    fontFamily: 'Outfit-Medium',
    fontSize: 12,
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
    fontSize: 16,
    color: colors.TextBlack,
  },
});

export default SubCategoryScreen;
