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
  const handleStartShopping = () => {
    navigation.navigate('Home');
  };

  const handleGetQuotation = async () => {
    try {
      const user = auth().currentUser;
      if (!user) {
        console.error('User not authenticated');
        return;
      }

      const response = await axios.post(
        'https://crossbee-server.vercel.app/quotationCheckout',
        {
          cartItems,
          uid: user.uid,
        },
      );

      if (response.data.text) {
        console.log('Quotation generated successfully');
        navigation.navigate('InvoiceScreen', {invoiceData: response.data.data});
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
      routes: [{name: 'OTPVerificationScreen'}],
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FCCC51" />
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
            // eslint-disable-next-line react-native/no-inline-styles
            {backgroundColor: colors.main, alignSelf: 'center'},
          ]}
          onPress={navigateToOTP}>
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
        {cartItems.length === 0 ? (
          <View style={styles.emptyCartContainer}>
            <Image
              source={require('../assets/Cart.png')}
              style={styles.image2}
            />
            <Text style={styles.infoText}>Your cart is empty</Text>
            <TouchableOpacity
              style={styles.button3}
              onPress={handleStartShopping}>
              <Text style={styles.buttonText}>Start Shopping</Text>
            </TouchableOpacity>
          </View>
        ) : (
          cartItems.map(item => (
            <CartItem
              key={item.cartId}
              item={item}
              onUpdateQuantity={updateCartItemQuantity}
              onRemoveItem={removeCartItem}
            />
          ))
        )}
      </ScrollView>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: colors.second}]}
          onPress={handleGetQuotation}
          disabled={cartItems.length === 0}>
          <Text style={styles.buttonText}>Get Quotation</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: colors.main}]}
          onPress={handlePlaceOrder}
          disabled={cartItems.length === 0}>
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
    fontFamily: 'Outfit-Bold',
  },
  cartItemCount: {
    fontSize: 18,
    color: '#fff',
    marginLeft: 10,
    fontFamily: 'Outfit-Bold',
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
    fontFamily: 'Outfit-Bold',
  },
  totalAmountText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Outfit-Bold',
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartText: {
    fontSize: 18,
    color: colors.TextBlack,
    fontFamily: 'Outfit-Bold',
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
    fontFamily: 'Outfit-Bold',
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
    fontFamily: 'Outfit-Bold',
    color: colors.TextBlack,
    marginBottom: 20,
    textAlign: 'center',
  },
  image2: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noQuoteText: {
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'Outfit-Bold',
    marginBottom: 10,
    color: colors.TextBlack,
  },
  infoText: {
    fontSize: 26,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'black',
    fontFamily: 'Outfit-Bold',
  },
  button3: {
    backgroundColor: colors.main,
    width: '80%',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText2: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Outfit-Bold',
  },
});

export default CartScreen;
