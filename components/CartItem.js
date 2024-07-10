import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors } from '../styles/color';

const CartItem = ({ id, name, price, quantity, onUpdateQuantity, onRemoveItem }) => {
  const [itemQuantity, setItemQuantity] = useState(quantity);
  const [selectedColor, setSelectedColor] = useState(colors.main); // Default color

  useEffect(() => {
    setItemQuantity(quantity);
  }, [quantity]);

  const handleIncreaseQuantity = () => {
    const newQuantity = itemQuantity + 1;
    setItemQuantity(newQuantity);
    onUpdateQuantity(id, newQuantity);
  };

  const handleDecreaseQuantity = () => {
    const newQuantity = itemQuantity - 1;
    setItemQuantity(newQuantity);
    onUpdateQuantity(id, newQuantity);

    if (newQuantity === 0) {
      onRemoveItem(id);
    }
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    // Optionally, you can handle color change logic here
  };

  return (
    <View style={styles.cartItemContainer}>
      <View style={styles.productImageContainer}>
        <Image
          source={require('../assets/product.png')} // Replace with your image source
          style={styles.productImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{name}</Text>
        <Text style={styles.productPrice}>${(price * itemQuantity).toFixed(2)}</Text>
        <View style={styles.itemColorContainer}>
          <View style={[styles.itemColor, { backgroundColor: selectedColor }]}>
            <Text style={styles.itemColorText}>Color</Text>
          </View>
        </View>
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={handleDecreaseQuantity}>
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
    shadowOffset: { width: 0, height: 2 },
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
  },
  productPrice: {
    fontSize: 18,
    marginTop: 5,
    fontWeight: 'bold',
  },
  itemColorContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  itemColor: {
    width: 40,
    height: 20,
    borderRadius: 5,
    marginRight: 10,
  },
  itemColorText: {
    fontSize: 14,
    textAlign: 'center',
    color: colors.background,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto', // Pushes to the right
  },
  quantityButton: {
    backgroundColor: colors.main,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  quantityButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  quantityText: {
    fontSize: 18,
    marginLeft: 10,
    marginRight: 10,
  },
});

export default CartItem;
