import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/styles'; // Ensure this path is correct
import { colors } from '../styles/color';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useCart } from '../components/CartContext'; // Ensure this path is correct


const ProductComponent = ({ product }) => {
  const navigation = useNavigation();
  const { addToCart } = useCart();
  const [isWished, setIsWished] = useState(false);

  const minCartValue = parseInt(product.minCartValue, 10) || 1;
  const [quantity, setQuantity] = useState(minCartValue);

  const handlePress = () => {
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
    if (product && quantity > 0) {
      const item = {
        productName: product.displayName,
        productId: product.productId,
        price: product.price,
        quantity: minCartValue,
        image: product.image,
        colorminCartValue: minCartValue,
        attributeSelected1: product.attribute1,
        attributeSelected2: product.attribute2,
        attributeSelected3: product.attribute3,
        additionalDiscount: product.additionalDiscount || 0,
        discountedPrice: cutPrice,
        mainId: product.mainId,
        categoryId: product.categoryId,
        name: product.attribute3
      };

      addToCart(item);
    }
  };

  const discountPercentage = product.additionalDiscount;
  const cutPrice = (product.price * (1 - discountPercentage / 100)).toFixed(0);

  return (
    <TouchableOpacity style={styles.productContainer2} onPress={handlePress}>
      <View style={styles.productContent}>
        <View style={styles.imageContainer}>
          <View style={styles.imageBox}>
            <Image
              source={{ uri: product.image ||product.mainImage || 'https://firebasestorage.googleapis.com/v0/b/crossbee.appspot.com/o/no.png?alt=media&token=a464f751-0dc1-4759-945e-96ac1a5f3656' }}
              style={styles.productImage}
            />
          </View>
        </View>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
          <Text style={styles.productName} numberOfLines={1}>
            {product.displayName}
          </Text>
        </View>
        <View style={styles.discountContainer}>
          <Text style={styles.discountText}>{discountPercentage}% OFF</Text>
          <Text style={styles.cutPriceText}>{Number(product.price).toLocaleString("en-IN", {
            maximumFractionDigits: 0,
            style: 'currency',
            currency: 'INR',
          })}</Text>
        </View>
        <View style={styles.hotDealsContainer}>
          <Text style={styles.originalPriceText}>
            {Number(cutPrice).toLocaleString("en-IN", {
              maximumFractionDigits: 0,
              style: 'currency',
              currency: 'INR',
            })}
          </Text>
        </View>
        <View style={styles.actionButtonContainer}>
          {product.outOfStock ? (
            <View style={styles.outOfStockButton}>
              <Text style={styles.outOfStockText}>Out of Stock</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addToCartButton2}
              onPress={handleAddToCart}>
              <Text style={styles.addToCartText}>Add to Cart</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.productDetailButton2}
            onPress={handlePress}>
            <Text style={styles.productDetailText3}>Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductComponent;
