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
    const userId = auth().currentUser?.uid; // Optional chaining to avoid accessing property of undefined
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
    if (!product) return; // Add a check to ensure product is defined
    console.log(
      `Navigating to ProductDetailPage with productId: ${product.productId}`,
    );
    navigation.navigate('ProductDetailPage', {
      mainId: product.mainId,
      categoryId: product.categoryId,
      productId: product.productId,
    });
  };

  const handleAddToCart = (product) => {
    if (!product) return; // Add a check to ensure product is defined
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
        mainId: product.mainId,
        categoryId: product.categoryId,
      };

      addToCart(item);
    }
  };

  const renderProductItem = (product) => {
    if (!product) return null; // Add a check to ensure product is defined
    const discountPercentage = product.additionalDiscount;
    const cutPrice = (product.price * (1 - discountPercentage / 100)).toFixed(0);
    const minCartValue = parseInt(product.minCartValue, 10) || 1;

    return (
      <TouchableOpacity
        key={product.productId} // Add key for list items
        style={styles.productContainer2}
        onPress={() => handlePress(product)}
      >
        <View style={styles.productContent}>
          <View style={styles.imageContainer}>
            <View style={styles.imageBox}>
              <Image
                source={{ uri: product.mainImage || 'default_image_url' }}
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
            <TouchableOpacity
              style={styles.addToCartButton2}
              onPress={() => handleAddToCart(product)}
            >
              <Text style={styles.addToCartText2}>Add to Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.productDetailButton2}
              onPress={() => handlePress(product)}
            >
              <Text style={styles.productDetailText2}>Details</Text>
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
  title: {
    fontSize: 20,

    fontFamily: 'Outfit-Medium',
    marginBottom: 10,
    marginLeft: 10,
    color: colors.TextBlack,
    textAlign: 'left', // Align title text to the left
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
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden', // Ensure contents don't overflow the rounded corners
    borderWidth: 1, // Add border width
    borderColor: '#ddd', // Border color
  },
  productContainer2: {
    width: '48%', // This makes two products fit in one row
    marginBottom: 16, // Add some spacing between rows
    borderWidth: 1,
    borderColor: '#ECECEC',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  productContent: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10, // Add padding for better spacing
    alignItems: 'flex-start', // Align items to the left
  },

  outOfStockText: {color: '#FF0000', fontFamily: 'Outfit-Medium', fontSize: 14},

  imageContainer: {
    width: '100%',
    height: 100, // Adjust height for the image
    alignItems: 'center',
    borderBottomWidth: 1, // Add border to the bottom of the image container
    borderBottomColor: '#ddd', // Border color
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
    resizeMode: 'contain', // Ensure image fits inside without stretching
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
  wishlistIcon: {
    marginLeft: 'auto', // Push the icon to the right end
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
  hotDealsText: {
    fontSize: 8,
    color: '#333',
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
    alignItems: 'center',
    marginLeft: -9,
  },
  addToCartText: {
    color: '#333',
    fontFamily: 'Outfit-Medium',
    fontSize: 12,
  },
  productDetailButton: {
    borderColor: '#333', // Use borderColor instead of border for correct application
    borderWidth: 1, // Ensure border width is set for visibility
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginLeft: 15,
    backgroundColor: '#fff', // Example background color
    color: '#333', // Example text color, if you are using text-based components
  },
  productDetailText: {
    color: '#333',
    fontFamily: 'Outfit-Medium',
    fontSize: 12,
  },
  addToCartButton2: {
    backgroundColor: '#FCCC51',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginLeft: -9,
  },
  addToCartText2: {
    color: '#333',
    fontFamily: 'Outfit-Medium',
    fontSize: 8,
  },
  productDetailButton2: {
    borderColor: '#333', // Use borderColor instead of border for correct application
    borderWidth: 1, // Ensure border width is set for visibility
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginLeft: 15,
    backgroundColor: '#fff', // Example background color
    color: '#333', // Example text color, if you are using text-based components
  },
  productDetailText2: {
    color: '#333',
    fontFamily: 'Outfit-Medium',
    fontSize: 8,
  },
});

export default SubCategoryScreen;
