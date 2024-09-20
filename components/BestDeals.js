import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles2 from '../styles/styles copy'; // Import the styles2
import { colors } from '../styles/color';
import { useCart } from '../components/CartContext'; // Adjust the path to your CartContext
import auth from '@react-native-firebase/auth';
import { useWishlist } from './WishlistContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ProductComponent = ({ product }) => {
  const navigation = useNavigation();
  const { addToCart } = useCart();
  const minCartValue = parseInt(product.minCartValue, 10) || 1;
  const [quantity, setQuantity] = useState(minCartValue);

  // Log the wishlist property for debugging
  useEffect(() => {
    console.log('Product:', product.productId, 'Wishlist status:', product.wishlist);
  }, [product]);

  // Wishlist state based on API response
  const [isWished, setIsWished] = useState(product.wishlist);
  const { addToWishlist, removeFromWishlist } = useWishlist();

  const handleWishlistPress = () => {
    console.log('Toggling wishlist status for product:', product.productId);
    if (isWished) {
      console.log('Removing from wishlist:', product.productId);
      removeFromWishlist(product);
    } else {
      console.log('Adding to wishlist:', product.productId);
      addToWishlist(product);
    }
    setIsWished(!isWished);  // Toggle the wishlist state
  };


  const handlePress = () => {
    navigation.navigate('ProductDetailPage', {
      mainId: product.mainId,
      categoryId: product.categoryId,
      productId: product.productId,
      attribute1D: product.attribute1,
      attribute2D: product.attribute2,
      attribute3D: product.attribute3,
    });
  };

  const handleAddToCart = () => {
    if (!product.outOfStock && product && quantity > 0) {
      const item = {
        productName: product.displayName,
        productId: product.productId,
        price: product.price,
        quantity: minCartValue,
        image: product.image,
        bag:product.bag,
        colorminCartValue: minCartValue,
        attributeSelected1: product.attribute1,
        attributeSelected2: product.attribute2,
        attributeSelected3: product.attribute3,
        additionalDiscount: product.additionalDiscount || 0,
        mainId: product.mainId,
        discountedPrice: cutPrice,
        categoryId: product.categoryId,
        name: product.attribute3,
        colormaxCartValue: product.inventory,
      };

      addToCart(item); // Call the addToCart function from CartContext
      console.log('Adding to cart:', item);
    }
  };

  // Calculate the discounted price
  const discountPercentage = product.additionalDiscount;
  const cutPrice = (product.price * (1 - discountPercentage / 100)).toFixed(0);

  return (
    <TouchableOpacity style={styles2.productContainer} onPress={handlePress}>
      <View style={styles2.productContent}>
        {product.lowestPrice && (
          <View style={styles2.lowestPriceLabel}>
            <Text style={styles2.lowestPriceText}>Highest Discount</Text>
          </View>
        )}
        <View style={styles2.imageContainer}>
          <Image
            source={{
              uri: product.image || 'https://firebasestorage.googleapis.com/v0/b/crossbee.appspot.com/o/no.png?alt=media&token=a464f751-0dc1-4759-945e-96ac1a5f3656',
            }}
            style={styles2.productImage}
          />
        </View>

        <Text style={styles2.productName} numberOfLines={1}>
          {product.displayName}
        </Text>

        {/* Heart Icon with dynamic color based on wishlist state */}
         {/* Heart Icon for Wishlist */}
         <TouchableOpacity style={styles2.heartIconContainer} onPress={handleWishlistPress}>
          <Icon
            name={isWished ? 'favorite' : 'favorite-border'}
            size={24}
            color={isWished ? 'red' : 'black'}
          />
        </TouchableOpacity>

        {/* Discount section */}
        {discountPercentage ? (
          <View style={styles2.discountContainer}>
            <Text style={styles2.discountText}>{discountPercentage}% OFF</Text>
            <Text style={styles2.cutPriceText}>
              {Number(product.price).toLocaleString('en-IN', {
                maximumFractionDigits: 0,
                style: 'currency',
                currency: 'INR',
              })}
            </Text>
          </View>
        ) : null}

        {/* Display discounted price */}
        <View style={styles2.hotDealsContainer}>
          <Text style={styles2.originalPriceText}>
            {Number(cutPrice).toLocaleString('en-IN', {
              maximumFractionDigits: 0,
              style: 'currency',
              currency: 'INR',
            })}
          </Text>
        </View>

        {/* Action buttons */}
        <View style={styles2.actionButtonContainer}>
          {product.outOfStock ? (
            <View style={styles2.outOfStockButton}>
              <Text style={styles2.outOfStockText}>Out of Stock</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles2.addToCartButton}
              onPress={handleAddToCart}
            >
              <Text style={styles2.addToCartText}>Add to Cart</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles2.productDetailButton}
            onPress={handlePress}
          >
            <Text style={styles2.productDetailText}>Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const BestDeals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false); // New state for error handling

  useEffect(() => {
    const fetchProducts = async () => {
      const userId = auth().currentUser.uid;
      try {
        const response = await fetch(
          'https://crossbee-server-1036279390366.asia-south1.run.app/bestDeals?uid=' + userId,
        );
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(true); // Set error state on failure
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <View style={styles2.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || products.length === 0) {
    return (
      <View style={styles2.errorContainer}>
        <Text style={styles2.errorText}>No product found</Text>
      </View>
    );
  }

  return (
    <View style={styles2.container}>
      <Text style={styles2.title}>Best Deals</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles2.productList}>
        {products.map(product => (
          <View key={product.productId} style={styles2.productWrapper}>
            <ProductComponent product={product} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default BestDeals;
