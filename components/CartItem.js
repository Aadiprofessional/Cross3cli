import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {colors} from '../styles/color';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const CartItem = ({item, onUpdateQuantity, onRemoveItem}) => {
  const {
    cartId,
    name,
    price,
    quantity,
    attributeSelected3,
    image,
    colorminCartValue,
    additionalDiscount, // Add additionalDiscount
    mainId, // Added mainId
    categoryId, // Added categoryId
    productId, // Added productId
  } = item;
  
  const [itemQuantity, setItemQuantity] = useState(quantity);
  const navigation = useNavigation();

  useEffect(() => {
    setItemQuantity(quantity);
  }, [quantity]);

  const handleIncreaseQuantity = () => {
    const newQuantity = itemQuantity + 1;
    setItemQuantity(newQuantity);
    onUpdateQuantity(cartId, newQuantity);
  };

  const handleDecreaseQuantity = () => {
    const newQuantity = itemQuantity - 1;
    setItemQuantity(newQuantity);
    if (newQuantity < colorminCartValue) {
      setItemQuantity(colorminCartValue);
      Toast.show({
        type: 'info',
        position: 'bottom',
        text1: `Minimum quantity is ${colorminCartValue}`,
        text2: 'Cannot decrease quantity further',
      });
    } else {
      onUpdateQuantity(cartId, newQuantity);
    }
  };

  const handleImagePress = () => {
    navigation.navigate('ProductDetailPage', {productId, mainId, categoryId}); // Pass additional IDs
  };

  const handleRemoveItem = () => {
    onRemoveItem(cartId);
    Toast.show({
      type: 'info',
      position: 'bottom',
      text1: 'Removing item from cart',
    });
  };

  // Calculate discounted price
  const discountedPrice = price - additionalDiscount;

  return (
    <View style={styles.cartItemContainer}>
      <TouchableOpacity
        style={styles.productImageContainer}
        onPress={handleImagePress}>
        <Image
          source={{uri: image}}
          style={styles.productImage}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{name}</Text>
        <Text style={styles.productPrice}>
          ₹{(discountedPrice * itemQuantity).toFixed(2)} {/* Use discounted price */}
        </Text>
        <View style={styles.itemColorContainer}>
          <View style={[styles.itemColor, {backgroundColor: colors.main}]}>
            <Text style={styles.itemColorText}>{attributeSelected3}</Text>
          </View>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={handleRemoveItem}>
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={[
            styles.quantityButton,
            itemQuantity <= colorminCartValue && styles.disabledButton,
          ]}
          onPress={handleDecreaseQuantity}
          disabled={itemQuantity <= colorminCartValue}>
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{itemQuantity}</Text>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={handleIncreaseQuantity}>
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cartItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  productImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Outfit-Bold',
    color: colors.TextBlack,
  },
  productPrice: {
    fontSize: 18,
    marginTop: 5,
    fontWeight: 'bold',
    fontFamily: 'Outfit-Bold',
    color: colors.TextBlack,
  },
  itemColorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  itemColor: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: colors.GrayLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemColorText: {
    color: colors.TextWhite,
    fontWeight: 'bold',
    fontFamily: 'Outfit-Bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: colors.main,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  disabledButton: {
    backgroundColor: colors.mainlight, // Change this to a color that indicates disabled
  },
  quantityButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Outfit-Bold',
  },
  quantityText: {
    fontSize: 18,
    fontFamily: 'Outfit-Bold',
    color: colors.TextBlack,
    marginHorizontal: 10,
  },
  removeButton: {
    marginLeft: 10,
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: colors.orange,
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'Outfit-Bold',
  },
});

export default CartItem;
