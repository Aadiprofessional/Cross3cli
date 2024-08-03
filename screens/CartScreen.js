import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {useCart} from '../components/CartContext'; // Adjust this import if necessary
import {colors} from '../styles/color';
import CartItem from '../components/CartItem';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import OTPVerificationScreen from './OTPVerificationScreen';

const CartScreen = () => {
  const {cartItems, updateCartItemQuantity, removeCartItem} = useCart(); // Assuming CartContext is used
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  const fetchCartData = useCallback(async () => {
    const user = auth().currentUser;
    setIsUserLoggedIn(!!user); // Check if the user is logged in

    if (!user) {
      setLoading(false);
      return;
    }

    // Fetch data if user is authenticated
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchCartData();

      return () => {
        // Cleanup if needed
      };
    }, [fetchCartData]),
  );

  const handleGetQuotation = async () => {
    try {
      const user = auth().currentUser;
      if (!user) {
        console.error('User not authenticated');
        return;
      }

      const response = await axios.post(
        'https://crossbee-server.vercel.app/generateQuotation',
        {
          cartItems,
          uid: user.uid,
        },
      );

      if (response.data.text) {
        console.log('Quotation generated successfully');
        navigation.navigate('Quotation');
      } else {
        console.error('Failed to generate quotation');
      }
    } catch (error) {
      console.error('Error generating quotation: ', error);
    }
  };

  const handlePlaceOrder = () => {
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    navigation.navigate('OrderSummary', {cartItems, totalAmount});
  };

  const navigateToOTP = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'OTPScreen'}],
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.main} />
      </View>
    );
  }

  if (!isUserLoggedIn) {
    return (
      <View style={styles.container}>
        <Image source={require('../assets/Login.png')} style={styles.image} />
        <Text style={styles.loginPromptText}>
          Please log in to access your cart.
        </Text>
        <TouchableOpacity
          style={[
            styles.button2,
            {backgroundColor: colors.main, alignSelf: 'center'},
          ]}
          onPress={OTPVerificationScreen}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
            ₹
            {cartItems
              .reduce((sum, item) => sum + item.price * item.quantity, 0)
              .toFixed(2)}
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
  button2: {
    height: 50,
    width: 90,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  loginPromptContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  loginPromptText: {
    fontSize: 16,
    color: colors.TextBlack,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default CartScreen;
