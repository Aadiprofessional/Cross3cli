import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import styles from '../styles/styles'; // Import the styles
import {colors} from '../styles/color';
import {useCart} from '../components/CartContext'; // Adjust the path to your CartContext
import auth from '@react-native-firebase/auth';

const ProductComponent = ({product}) => {
  const navigation = useNavigation();
  const {addToCart} = useCart(); // Get the addToCart function from CartContext
  const [isWished, setIsWished] = useState(false);

  const minCartValue = parseInt(product.minCartValue, 10) || 1;
  const [quantity, setQuantity] = useState(minCartValue); // Default quantity based on minCartValue

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

  const handleWishlistPress = () => {
    setIsWished(!isWished);
  };

  const handleAddToCart = () => {
    if (!product.outOfStock && product && quantity > 0) {
      const item = {
        productName: product.displayName,
        productId: product.productId,
        price: product.price,
        quantity: minCartValue, // Ensure quantity is minCartValue
        image: product.image,
        colorminCartValue: minCartValue,
        attributeSelected1: product.attribute1,
        attributeSelected2: product.attribute2,
        attributeSelected3: product.attribute3,
        attribute1: product.attribute1,
        attribute2: product.attribute2,
        attribute3: product.attribute3,
        attribute1Id: product.attribute1Id,
        attribute2Id: product.attribute2Id,
        attribute3Id: product.attribute3Id,
        additionalDiscount: product.additionalDiscount || 0,
        mainId: product.mainId,
        categoryId: product.categoryId,
      };

      addToCart(item); // Call the addToCart function from CartContext
      console.log('Adding to cart:', item);
    }
  };

  const formatPrice = price => {
    return price
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      .replace(/\d(?=(\d{2})+\d{3}\b)/g, '$&,');
  };

  const discountPercentage = product.additionalDiscount;
  const cutPrice = (product.price * (1-discountPercentage / 100)).toFixed(0);
  return (
    <TouchableOpacity style={styles.productContainer} onPress={handlePress}>
      <View style={styles.productContent}>
        <View style={styles.imageContainer}>
          <View style={styles.imageBox}>
            <Image source={{uri: product.image}} style={styles.productImage} />
          </View>
        </View>
        <View
          style={{flexDirection: 'row', alignItems: 'center', width: '100%'}}>
          <Text style={styles.productName} numberOfLines={1}>
            {product.displayName}
          </Text>
        </View>
        <View style={styles.discountContainer}>
          <Text style={styles.discountText}>{discountPercentage}% OFF</Text>
          <Text style={styles.cutPriceText}>₹{formatPrice(product.price)}</Text>
        </View>
        <View style={styles.hotDealsContainer}>
          <Text style={styles.originalPriceText}>
            ₹{formatPrice(cutPrice)}
          </Text>
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
            onPress={handlePress}>
            <Text style={styles.productDetailText}>Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const LatestProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const userId = auth().currentUser.uid;
      try {
        const response = await fetch(
          'https://crossbee-server-1036279390366.asia-south1.run.app/latestProducts?uid='+ userId,
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
