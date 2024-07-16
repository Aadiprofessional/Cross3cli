import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../styles/color';
import CartItem from '../components/CartItem';

const QuotationScreen = () => {
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
    console.log('Get Quotation button pressed');
  };

  const handlePlaceOrder = () => {
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    navigation.navigate('OrderSummary', {cartItems, totalAmount});
  };

  const handleCheckout = () => {
    console.log('Checkout button pressed');
  };

  const handleRemoveItem = itemId => {
    const updatedItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedItems);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.headerButton, styles.quotesButton]}
          onPress={handleGetQuotation}>
          <Text style={[styles.headerButtonText, {color: '#fff'}]}>Quotes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.headerButton,
            styles.ordersButton,
            {color: '#00000064'},
          ]}
          onPress={handlePlaceOrder}>
          <Text style={[styles.headerButtonText, {color: '#00000070'}]}>
            Orders
          </Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.quotesBox, styles.shadow]}>
        <ScrollView contentContainerStyle={styles.boxContent}>
          <View style={styles.row}>
            <Text style={styles.label}>Quotation number:</Text>
            <Text style={styles.label}>Created on:</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.value}>#789012</Text>
            <Text style={styles.value}>22 June 2024</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
          </View>
          <Text style={[styles.value, {color: '#F59F13'}]}>Pending</Text>

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

          <TouchableOpacity
            style={[styles.checkoutButton, {backgroundColor: colors.main}]}
            onPress={handleCheckout}>
            <Text style={[styles.buttonText, {color: '#fff'}]}>Checkout</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={[styles.ordersBox, styles.shadow]}>
        <ScrollView contentContainerStyle={styles.boxContent}>
          <View style={styles.row}>
            <Text style={styles.label}>Quotation number:</Text>
            <Text style={styles.label}>Created on:</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.value}>#789012</Text>
            <Text style={styles.value}>22 June 2024</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
          </View>
          <Text style={[styles.value, {color: '#F59F13'}]}>Pending</Text>

          <TouchableOpacity
            style={[styles.checkoutButton, {backgroundColor: colors.main}]}
            onPress={handleCheckout}>
            <Text style={[styles.buttonText, {color: '#fff'}]}>Checkout</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerButton: {
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '45%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  quotesButton: {
    backgroundColor: colors.main,
  },
  ordersButton: {
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 1,
  },
  headerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quotesBox: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  ordersBox: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  boxContent: {
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: '#787878',
    fontWeight: 'normal',
  },
  value: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
  },
  checkoutButton: {
    width: '80%',
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
});

export default QuotationScreen;
