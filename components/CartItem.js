import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {colors} from '../styles/color';

const CartItem = ({name, price}) => {
  const [quantity, setQuantity] = useState(1);

  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <View style={styles.cartItemContainer}>
      <View style={styles.productImageContainer}>
        {/* Placeholder image */}
        <Text style={styles.productImage}>Product.png</Text>
      </View>
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{name}</Text>
        <Text style={styles.productPrice}>${price.toFixed(2)}</Text>
        <View style={styles.itemColorContainer}>
          <View style={[styles.itemColor, {backgroundColor: colors.main}]}>
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
        <Text style={styles.quantityText}>{quantity}</Text>
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
    backgroundColor: colors.primary, // Replace with your primary color
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
    fontSize: 20,
    color: '#000',
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'normal', // Regular text
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'normal', // Regular text
    marginTop: 5,
  },
  itemColorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  itemColor: {
    width: 40,
    height: 20,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.main, // Replace with your main color
  },
  itemColorText: {
    fontSize: 14,
    color: '#fff',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityButton: {
    backgroundColor: colors.main, // Replace with your main color
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
