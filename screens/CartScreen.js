import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  Alert,
  FlatList,
  Pressable,
  Image,
  style,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useCart } from '../components/CartContext'; // Adjust this import if necessary
import { colors } from '../styles/color';
import CartItem from '../components/CartItem';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import CustomHeader2 from '../components/CustomHeader2';

const CartScreen = () => {
  const { cartItems, updateCartItemQuantity, removeCartItem } = useCart(); // Assuming CartContext is used
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchCartData = useCallback(async () => {
    const user = auth().currentUser;

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

  const fetchCompanies = async () => {
    try {
      const user = auth().currentUser;
      if (!user) {
        console.error('User not authenticated');
        return;
      }

      const response = await axios.post(
        'https://crossbee-server-1036279390366.asia-south1.run.app/getCompanies',
        { uid: user.uid },
      );

      if (response.status === 200) {
        setCompanies(response.data);
        setModalVisible(true);
      } else {
        Alert.alert('Error', `Failed to load companies: ${response.status}`);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to load companies');
      console.error('Failed to load companies', err);
    }
  };

  const handleSelectCompany = companyId => {
    setSelectedCompanyId(companyId);
    setModalVisible(false); // Close the modal when a company is selected
    handleGetQuotation(companyId); // Pass the selected companyId to the API request
  };

  const handleGetQuotation = async companyId => {
    try {
      const user = auth().currentUser;
      if (!user) {
        console.error('User not authenticated');
        return;
      }

      const response = await axios.post(
        'https://crossbee-server-1036279390366.asia-south1.run.app/quotationCheckout',
        {
          cartItems,
          uid: user.uid,
          companyId,
        },
      );

      if (response.data.text) {
        console.log('Quotation generated successfully');
        navigation.navigate('InvoiceScreen', {
          invoiceData: response.data.data,
          url : response.data.invoice,
          quotationId: response.data.quotationId,
        });
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

    // Calculate total additional discount
    const totalAdditionalDiscount = (
      cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) -
      cartItems.reduce((sum, item) => sum + item.discountedPrice * item.quantity, 0)
    ).toFixed(0); // .toFixed(0) will give you a string representation

    const totalAdditionalDiscountValue = parseFloat(totalAdditionalDiscount); // Convert to a number if needed


    navigation.navigate('OrderSummary', {
      cartItems,
      totalAmount,
      totalAdditionalDiscountValue, // Pass the total additional discount
    });
    console.log(totalAdditionalDiscount);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.main} />
      </View>
    );
  }
console.log(cartItems);


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
            {Number(
              cartItems
                .reduce((sum, item) => sum + item.discountedPrice * item.quantity, 0)
                .toFixed(0)
            ).toLocaleString("en-IN", {
              maximumFractionDigits: 0,
              style: 'currency',
              currency: 'INR',
            })}
          </Text>

        </View>
      </View>
      <ScrollView style={styles.cartItemsContainer}>
        {cartItems.length === 0 ? (
          <View style={styles.emptyCartContainer}>
            <Image
              source={require('../assets/Cart.png')}
              style={styles.image}
            />
            <Text style={styles.emptyCartText}>Your cart is empty</Text>
            <TouchableOpacity
              style={styles.button3}
              onPress={() => navigation.navigate('Home')}>
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
          style={[styles.button, { backgroundColor: colors.second }]}
          onPress={fetchCompanies}
          disabled={cartItems.length === 0}>
          <Text style={styles.buttonText}>Get Quotation</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.main }]}
          onPress={handlePlaceOrder}
          disabled={cartItems.length === 0}>
          <Text style={styles.buttonText}>Place Order</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for selecting company */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select a Company</Text>
            <FlatList
              data={companies}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <Pressable
                  style={[
                    styles.companyItem,
                    item.id === selectedCompanyId && styles.selectedCompanyItem,
                  ]}
                  onPress={() => handleSelectCompany(item.id)}>
                  <Text style={styles.companyText}>{item.name}</Text>
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
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

    fontFamily: 'Outfit-Medium',
  },
  cartItemCount: {
    fontSize: 18,
    color: '#fff',
    marginLeft: 10,
    fontFamily: 'Outfit-Medium',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtotalText: {
    fontSize: 20,
    color: '#fff',

    marginRight: 5,
    fontFamily: 'Outfit-Medium',
  },
  totalAmountText: {
    fontSize: 20,
    color: '#fff',
    fontFamily: 'Outfit-Medium',
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartText: {
    fontSize: 18,
    color: colors.TextBlack,
    fontFamily: 'Outfit-Medium',
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

    fontFamily: 'Outfit-Medium',
  },
  button2: {
    height: 40,
    width: 250,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.TextBlack,
  },
  button3: {
    height: 50,
    width: 250,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.main,
    borderRadius: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    color: colors.TextBlack,
    marginBottom: 10,
    fontFamily: 'Outfit-Bold',
  },
  companyItem: {
    padding: 10,
    borderRadius: 6,
    marginBottom: 5,
    backgroundColor: colors.TextBlack,
  },
  selectedCompanyItem: {
    backgroundColor: colors.second,
  },
  companyText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Outfit-Bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginPromptText: {
    fontSize: 18,

    textAlign: 'center',
    color: colors.TextBlack,
    fontFamily: 'Outfit-Bold',
    padding: 10,
  },
});

export default CartScreen;
