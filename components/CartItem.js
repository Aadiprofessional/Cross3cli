import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors } from '../styles/color';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const CartItem = ({ item, onUpdateQuantity, onRemoveItem, isOrderSummary }) => {
  const {
    cartId,
    name,
    price,
    quantity,
    attributeSelected3,
    attributeSelected1,
    attributeSelected2,
    image,
    colorminCartValue,
    colormaxCartValue,
    additionalDiscount,
    mainId,
    product,
    productId,
    discountedPrice,
    productName,
    bag // Get the bag value from item
  } = item;

  const parsedBag = Number(bag); // Parse bag as a number
  const [itemQuantity, setItemQuantity] = useState(quantity);
  const navigation = useNavigation();

  useEffect(() => {
    setItemQuantity(quantity);
  }, [quantity]);

  const handleIncreaseQuantity = () => {
    const newQuantity = itemQuantity * parsedBag; // Multiply by bag value
    if (newQuantity > colormaxCartValue) {
      Toast.show({
        type: 'info',
        position: 'bottom',
        text1: `Maximum quantity is ${colormaxCartValue}`,
        text2: 'Cannot increase quantity further',
      });
      setItemQuantity(colormaxCartValue); // Cap it at max
    } else {
      setItemQuantity(newQuantity);
      onUpdateQuantity(cartId, newQuantity);
    }
  };
  
  const handleDecreaseQuantity = () => {
    const newQuantity = Math.max(itemQuantity / parsedBag, colorminCartValue); // Divide by bag value, ensuring it doesn't go below minCartValue
    if (newQuantity < colorminCartValue) {
      Toast.show({
        type: 'info',
        position: 'bottom',
        text1: `Minimum quantity is ${colorminCartValue}`,
        text2: 'Cannot decrease quantity further',
      });
      setItemQuantity(colorminCartValue); // Cap it at min
    } else {
      setItemQuantity(newQuantity);
      onUpdateQuantity(cartId, newQuantity);
    }
  };
  

  const handleImagePress = () => {
    
    
    navigation.navigate('ProductDetailPage', {
      productId, mainId, attribute1D: attributeSelected1,
      attribute2D: attributeSelected2,
      attribute3D: attributeSelected3,

    });
  };

  const handleRemoveItem = () => {
    onRemoveItem(cartId);
    Toast.show({
      type: 'info',
      position: 'bottom',
      text1: 'Removing item from cart',
    });
  };

  return (
    <View style={styles.cartItemContainer}>
      <TouchableOpacity
        style={styles.productImageContainer}
        onPress={handleImagePress}>
        <Image
          source={{ uri: image }}
          style={styles.productImage}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <View style={styles.productDetails}>
      <TouchableOpacity
        style={styles.productName}
        onPress={handleImagePress}>
        <Text >{productName}</Text>
        </TouchableOpacity>
        <Text style={styles.productPrice}>
          {Number(discountedPrice).toLocaleString("en-IN", {
            maximumFractionDigits: 2,
            style: 'currency',
            currency: 'INR',
          })}
        </Text>
        <View style={styles.itemColorContainer}>
        <View style={[styles.itemColor, { backgroundColor: colors.TextWhite }]}>
  <Text style={styles.itemColorText}>
    {`${attributeSelected1}, ${attributeSelected2}, ${attributeSelected3}`.length > 15 
      ? `${`${attributeSelected1}, ${attributeSelected2}, ${attributeSelected3}`.substring(0, 15)}...`
      : `${attributeSelected1}, ${attributeSelected2}, ${attributeSelected3}` }
  </Text>
</View>

          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={[styles.quantityButton, itemQuantity <= colorminCartValue && styles.disabledButton]}
              onPress={handleDecreaseQuantity}
              disabled={itemQuantity <= colorminCartValue}>
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{itemQuantity}</Text>
            <TouchableOpacity
              style={[styles.quantityButton, itemQuantity >= colormaxCartValue && styles.disabledButton]}
              onPress={handleIncreaseQuantity}
              disabled={itemQuantity >= colormaxCartValue}>
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.trashIcon}
            onPress={handleRemoveItem}>
            <Image
              source={require('../assets/trash.png')}
              style={styles.trashIconImage}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cartItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  productImageContainer: {
    width: 110,
    height: 110,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    padding: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  productDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    color: colors.TextBlack,
  },
  productPrice: {
    fontSize: 18,
    marginTop: 5,
    fontFamily: 'Outfit-SemiBold',
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
    color: colors.black,
    fontFamily: 'Outfit-Medium',
  },
  quantityContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: colors.TextWhite,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12.5,
    borderColor: '#000000',
    borderWidth: 1,
  },
  disabledButton: {
    backgroundColor: '#C2C2C288',
  },
  quantityButtonText: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Outfit-Medium',
  },
  quantityText: {
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    color: colors.TextBlack,
    marginHorizontal: 5,
  },
  trashIcon: {
    position: 'absolute',
    top: -35,  // Adjust as needed
    right: 10, // Adjust as needed
  },
  trashIconImage: {
    width: 24,
    height: 24,
    tintColor: colors.orange,
  },
});

export default CartItem;
