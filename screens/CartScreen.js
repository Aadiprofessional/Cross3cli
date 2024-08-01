import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useCart} from '../components/CartContext'; // Adjust this import if necessary
import firestore from '@react-native-firebase/firestore';
import { colors } from '../styles/color';
import CartItem from '../components/CartItem';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
const CartScreen = () => {
  const { cartItems, updateCartItemQuantity, removeCartItem } = useCart(); // Assuming CartContext is used
  const navigation = useNavigation();

  const handleGetQuotation = async () => {
    try {
      const user = auth().currentUser; // Ensure auth is imported and initialized
      if (!user) {
        console.error('User not authenticated');
        return;
      }

      const response = await axios.post(`https://crossbee-server.vercel.app/generateQuotation`, {
        cartItems,
        uid : user.uid 
      });

      if (response.data.text) {
        console.log('Item added to cart successfully');
        navigation.navigate('Quotation'); // Navigate to Quotation screen after saving
       
      
      } else {
        console.error('Failed to checkout');
      }
    } catch (error) {
      console.error('Error saving quotation: ', error);
    }
  };

  const handlePlaceOrder = () => {
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    navigation.navigate('OrderSummary', { cartItems, totalAmount });
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
            ₹{cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
          </Text>
        </View>
      </View>
      <ScrollView style={styles.cartItemsContainer}>
        {cartItems.map(item => (
          <CartItem
            key={item.cartId}
            item={item}
            onUpdateQuantity={updateCartItemQuantity}
            onRemoveItem={removeCartItem}
          />
        ))}
      </ScrollView>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.second }]}
          onPress={handleGetQuotation}
        >
          <Text style={styles.buttonText}>Get Quotation</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.main }]}
          onPress={handlePlaceOrder}
        >
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
