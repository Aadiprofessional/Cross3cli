import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {colors} from '../styles/color';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const CartItem = ({item, onUpdateQuantity, onRemoveItem, isOrderSummary}) => {
  const {
    cartId,
    name,
    price,
    quantity,
    attributeSelected3,
    image,
    colorminCartValue,
    additionalDiscount,
    mainId,
    categoryId,
    productId,
    discountedPrice,
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
  const formatPrice = price => {
    return price
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      .replace(/\d(?=(\d{2})+\d{3}\b)/g, '$&,');
  };

  // Calculate discounted price
 

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
        <Text style={styles.productName}>{productId}</Text>

        <Text style={styles.productPrice}>
          ₹{formatPrice((discountedPrice * itemQuantity).toFixed(2))}{' '}
          {/* Use discounted price */}
        </Text>
        <View style={styles.itemColorContainer}>
          <View style={[styles.itemColor, {backgroundColor: colors.TextWhite}]}>
            <Text style={styles.itemColorText}>{attributeSelected3}</Text>
          </View>
          {!isOrderSummary && (
            <>
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
              <TouchableOpacity
                style={styles.removeButton}
                onPress={handleRemoveItem}>
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </>
          )}
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
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  productImageContainer: {
    width: 110, // Increased width
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
    justifyContent: 'space-between', // Adjust content positioning
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
    position: 'absolute', // Position it absolutely
    bottom: 10, // Adjust the position
    right: 10, // Adjust the position
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: colors.TextWhite,
    width: 25, // Smaller size
    height: 25, // Smaller size
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12.5, // Adjust border radius accordingly
    borderColor: '#000000',
    borderWidth: 1,
  },
  disabledButton: {
    backgroundColor: '#C2C2C288',
  },
  quantityButtonText: {
    fontSize: 16, // Adjust font size
    color: '#000',
    fontFamily: 'Outfit-Medium',
  },
  quantityText: {
    fontSize: 16, // Adjust font size
    fontFamily: 'Outfit-Medium',
    color: colors.TextBlack,
    marginHorizontal: 5, // Adjust margin
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

    fontFamily: 'Outfit-Bold',
  },
});

export default CartItem;
