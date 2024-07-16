import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../styles/color';
import CartItem from '../components/CartItem';

const CartScreen = () => {
  const [cartItems, setCartItems] = useState([
    {id: 1, name: 'Product A', price: 19.99, quantity: 1},
    {id: 2, name: 'Product B', price: 24.99, quantity: 1},
    {id: 3, name: 'Product C', price: 14.99, quantity: 1},
  ]);

  const navigation = useNavigation();

  const updateCartItemQuantity = (itemId, newQuantity) => {
    const updatedItems = cartItems.map(item =>
      item.id === itemId ? {...item, quantity: newQuantity} : item,
    );
    setCartItems(updatedItems);
  };

  const handleGetQuotation = () => {
    navigation.navigate('Quotation');
  };

  const handlePlaceOrder = () => {
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    navigation.navigate('OrderSummary', {cartItems, totalAmount});
  };

  const handleRemoveItem = itemId => {
    const updatedItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedItems);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.cartText}>Cart</Text>
          <Text style={styles.cartItemCount}>({cartItems.length} items)</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.subtotalText}>Subtotal:</Text>
          <Text style={styles.totalAmountText}>
            $
            {cartItems
              .reduce((sum, item) => sum + item.price * item.quantity, 0)
              .toFixed(2)}
          </Text>
        </View>
      </View>
      <View style={styles.cartItemsContainer}>
        {cartItems.map(item => (
          <CartItem
            key={item.id}
            id={item.id}
            name={item.name}
            price={item.price}
            quantity={item.quantity}
            onUpdateQuantity={updateCartItemQuantity}
            onRemoveItem={handleRemoveItem}
          />
        ))}
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: colors.second}]}
          onPress={handleGetQuotation}>
          <Text style={styles.buttonText}>Get Quotation</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: colors.main}]}
          onPress={handlePlaceOrder}>
          <Text style={styles.buttonText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.main,
    padding: 15,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  cartItemCount: {
    fontSize: 18,
    color: '#fff',
    marginLeft: 10,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtotalText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 5,
  },
  totalAmountText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  cartItemsContainer: {
    flex: 1,
    padding: 10,
  },
  buttonsContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  button: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CartScreen;
