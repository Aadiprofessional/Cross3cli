import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import styles from '../styles/styles'; // Ensure this path is correct
import {colors} from '../styles/color';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useCart} from '../components/CartContext'; // Ensure this path is correct


const ProductComponent = ({product}) => {
  const navigation = useNavigation();
  const {addToCart} = useCart();
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
        mainId: product.mainId,
        categoryId: product.categoryId,
      };

      addToCart(item);
    }
  };

  const discountPercentage = product.additionalDiscount;
  const cutPrice = (product.price * (1-discountPercentage / 100)).toFixed(0);

  return (
    <TouchableOpacity style={styles.productContainer2} onPress={handlePress}>
      <View style={styles.productContent}>
        <View style={styles.imageContainer}>
          <View style={styles.imageBox}>
            <Image
              source={{uri: product.image || 'default_image_url'}}
              style={styles.productImage}
            />
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
          <Text style={styles.cutPriceText}>₹{product.price}</Text>
        </View>
        <View style={styles.hotDealsContainer}>
          <Text style={styles.originalPriceText}>₹{cutPrice}</Text>
        </View>
        <View style={styles.actionButtonContainer}>
          <TouchableOpacity
            style={styles.addToCartButton2}
            onPress={handleAddToCart}>
            <Text style={styles.addToCartText2}>Add to Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.productDetailButton2}
            onPress={handlePress}>
            <Text style={styles.productDetailText2}>Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductComponent;
