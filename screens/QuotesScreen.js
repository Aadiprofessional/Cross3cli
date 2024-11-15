import React, { useCallback, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { colors } from '../styles/color';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/Feather';
import axios from 'axios';
import { Linking } from 'react-native';

const QuotesScreen = () => {
  const navigation = useNavigation();
  const [quotations, setQuotations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeButton, setActiveButton] = useState('quotes');
  const formatDate = timestamp => {
    if (!timestamp) return 'Unknown Date'; // Handle undefined timestamps

    let date;
    if (timestamp.toDate) {
      // Firestore Timestamp
      date = timestamp.toDate();
    } else if (typeof timestamp === 'string' || typeof timestamp === 'number') {
      // Unix timestamp or date string
      date = new Date(timestamp);
    } else {
      // Unknown format
      console.error('Unsupported timestamp format:', timestamp);
      return 'Invalid Date';
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/ ${month}/ ${year}`;
  };
  const fetchProductData = useCallback(async () => {
    const user = auth().currentUser;
    if (user) {
      setLoading(true);
      try {
        const [quotationsResponse, ordersResponse] = await Promise.all([
          axios.post(
            'https://crossbee-server-1036279390366.asia-south1.run.app/getQuotations',
            {
              uid: user.uid,
            },
          ),
          axios.post(
            'https://crossbee-server-1036279390366.asia-south1.run.app/getOrders',
            {
              uid: user.uid,
            },
          ),
        ]);

        if (quotationsResponse.data) {
          setQuotations(quotationsResponse.data);
        } else {
          console.error('Failed to fetch quotations');
        }

        if (ordersResponse.data) {
          setOrders(ordersResponse.data);
        } else {
          console.error('Failed to fetch orders');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    } else {
      console.error('User not authenticated');
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchProductData();
      return () => {
        // Cleanup if needed
      };
    }, [fetchProductData]),
  );

  const handleStartShopping = () => {
    navigation.navigate('Home');
  };

  const handleGetQuotation = () => {
    setActiveButton('quotes');
  };

  const handleCheckout = () => {
    setActiveButton('orders');
  };

  const handleQuoteCheckout = quote => {
    // Calculate the total additional discount from all cart items
    const totalAdditionalDiscount = quote.cartItems.reduce((total, item) => {
      return total + parseFloat(item.additionalDiscount || 0);
    }, 0);

    navigation.navigate('OrderSummary', {
      cartItems: quote.cartItems,
      totalAmount: quote.totalAmount,
      totalAdditionalDiscountValue: totalAdditionalDiscount,
    });
  };

  const handleOpenInvoice = url => {
    if (url) {
      Linking.openURL(url).catch(err =>
        console.error('Failed to open URL:', err),
      );
    } else {
      console.log('No invoice URL provided');
    }
  };


  const renderOrderItem = useMemo(
    () =>
      ({ item }) =>
      (
        <View style={styles.orderItem}>
          <View style={styles.orderRow}>
            <View>
              <Text style={styles.orderIdText}>Order ID:</Text>
              <Text style={styles.productOrderIdText}>{item.id}</Text>
            </View>
            <View style={styles.rightAligned}>
              <Text style={styles.orderIdText}>Order Date:</Text>
              <Text style={styles.productOrderIdText}>
                {formatDate(item.timestamp)}
              </Text>
            </View>
          </View>
          {item.cartItems.map(cartItem => (
            <View key={cartItem.id} style={styles.orderRow}>
              <View>
                <Text style={styles.orderIdText}>Items</Text>
                <Text style={styles.itemDetailText}>
                  {cartItem.productName.length > 10
                    ? `${cartItem.productName.substring(0, 10)}...`
                    : cartItem.productName}
                </Text>
              </View>

              <View>
                <Text style={styles.orderIdText}>Qty</Text>
                <Text style={styles.itemDetailText}>{cartItem.quantity}</Text>
              </View>
              <View>
                <Text style={styles.orderIdText}>Amount</Text>
                <Text style={styles.itemDetailText}>
                  {Number(cartItem.discountedPrice).toLocaleString("en-IN", {
                    maximumFractionDigits: 0,
                    style: 'currency',
                    currency: 'INR',
                  })}
                </Text>
              </View>
              <View>
                <Text style={styles.orderIdText}>Total</Text>
                <Text style={styles.itemDetailText}>
                  {Number(cartItem.discountedPrice * cartItem.quantity).toLocaleString("en-IN", {
                    maximumFractionDigits: 0,
                    style: 'currency',
                    currency: 'INR',
                  })}
                </Text>
              </View>
            </View>
          ))}
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>Status:</Text>
            <Text style={styles.orderStatusText}>{item.status}</Text>
          </View>
          {item.invoice && (
            <TouchableOpacity
            style={styles.downloadButton}
            onPress={() => handleOpenInvoice(item.invoice)}
          >

            <Text style={styles.downloadText}>Download</Text>
          </TouchableOpacity>
          )}
        </View>
      ),
    [handleOpenInvoice],
  );
  const renderQuoteItem = useMemo(
    () =>
      ({ item }) =>
      (
        <View style={styles.orderItem}>
          <View style={styles.orderRow}>
            <View>
              <Text style={styles.orderIdText}>Quote ID:</Text>
              <Text style={styles.productOrderIdText}>{item.id}</Text>
            </View>
            <View style={styles.rightAligned}>
              <Text style={styles.orderIdText}>Quote Date:</Text>
              <Text style={styles.productOrderIdText}>
                {formatDate(item.timestamp)}
              </Text>
            </View>
          </View>
          {item.cartItems.map(cartItem => (
            <View key={cartItem.id} style={styles.orderRow}>
              <View>
                <Text style={styles.orderIdText}>Items</Text>
                <Text style={styles.itemDetailText}>
                  {cartItem.productName.length > 10
                    ? `${cartItem.productName.substring(0, 10)}...`
                    : cartItem.productName}
                </Text>
              </View>

              <View>
                <Text style={styles.orderIdText}>Qty</Text>
                <Text style={styles.itemDetailText}>{cartItem.quantity}</Text>
              </View>
              <View>
                <Text style={styles.orderIdText}>Amount</Text>
                <Text style={styles.itemDetailText}>
                  {Number(cartItem.discountedPrice).toLocaleString("en-IN", {
                    maximumFractionDigits: 0,
                    style: 'currency',
                    currency: 'INR',
                  })}
                </Text>
              </View>
              <View>
                <Text style={styles.orderIdText}>Total</Text>
                <Text style={styles.itemDetailText}>
                  {Number(cartItem.discountedPrice * cartItem.quantity).toLocaleString("en-IN", {
                    maximumFractionDigits: 0,
                    style: 'currency',
                    currency: 'INR',
                  })}
                </Text>
              </View>
            </View>
          ))}

          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>Status:</Text>
            <Text style={styles.orderStatusText}>{item.status}</Text>
          </View>
          {item.invoice && (
            <TouchableOpacity
            style={styles.downloadButton}
            onPress={() => handleOpenInvoice(item.invoice)}
          >

            <Text style={styles.downloadText}>Download</Text>
          </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.placeOrderButton}
            onPress={() => handleQuoteCheckout(item)}>
            <Icon name="external-link" size={20} color={colors.main} />
          </TouchableOpacity>
        </View>
      ),
    [handleQuoteCheckout, handleOpenInvoice],
  );
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.main} />
      </View>
    );
  }

  const data = activeButton === 'quotes' ? quotations : orders;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[
            styles.headerButton,
            activeButton === 'quotes'
              ? styles.quotesButtonActive
              : styles.quotesButton,
          ]}
          onPress={handleGetQuotation}>
          <Text
            style={[
              styles.headerButtonText,
              { color: activeButton === 'quotes' ? '#fff' : '#00000070' },
            ]}>
            Quotes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.headerButton,
            activeButton === 'orders'
              ? styles.ordersButtonActive
              : styles.ordersButton,
          ]}
          onPress={handleCheckout}>
          <Text
            style={[
              styles.headerButtonText,
              { color: activeButton === 'orders' ? '#fff' : '#00000070' },
            ]}>
            Orders
          </Text>
        </TouchableOpacity>
      </View>
      {data.length === 0 ? (
        <>
          <Image
            source={require('../assets/Quotes.png')}
            style={styles.image}
          />
          <Text style={styles.noQuoteText}>
            No {activeButton === 'quotes' ? 'Quote' : 'Order'} yet
          </Text>
          <Text style={styles.infoText}>
            Looks like you have not added any{' '}
            {activeButton === 'quotes' ? 'quote' : 'order'}
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleStartShopping}>
            <Text style={styles.buttonText}>Start Shopping</Text>
          </TouchableOpacity>
        </>
      ) : (
        <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={
          activeButton === 'quotes' ? renderQuoteItem : renderOrderItem
        }
        contentContainerStyle={styles.orderList}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={styles.listFooter} />} // Add this line
      />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  statusText: {
    color: '#333',
    fontSize: 16,

    fontFamily: 'Outfit-Regular',
  },
  listFooter: {
    height: 70, // Adjust the height as necessary to ensure visibility
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  noQuoteText: {
    fontSize: 24,

    fontFamily: 'Outfit-Bold',
    marginBottom: 10,
    color: colors.TextBlack,
  },
  infoText: {
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.main,
    width: '80%',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  downloadText: {
    color: colors.main,
    marginLeft: 5, // Space between the icon and text
    fontSize: 16, // Adjust as needed
    fontFamily: 'Outfit-Medium', // Adjust font family as needed
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,

    fontFamily: 'Outfit-Bold',
  },
  orderList: {
    marginTop:70,
    width: '300%',
  },
  orderItem: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    position: 'relative',
    width: '100%', // Make the container stretch to full width
    paddingHorizontal: '5%', // Add padding to create a gap from each side
    boxSizing: 'border-box', // Ensure padding is included in the width
  },
  orderText: {
    fontSize: 16,
    color: colors.TextBlack,
    marginBottom: 5,
    fontFamily: 'Outfit-Medium',
  },
  boldText: {
    fontFamily: 'Outfit-Bold',
  },
  header: {
    position: 'absolute', // Keep the header fixed
    top: 0,              // Position it at the top
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#fff',

    zIndex: 10,          // Ensure the header is above other elements
  },
  headerButton: {
    paddingVertical: 10,
    paddingHorizontal: 60,
    borderRadius: 5,
  },
  headerButtonText: {
    fontSize: 16,
    fontFamily: 'Outfit-Bold',
  },
  quotesButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C6C6C6',
  },
  quotesButtonActive: {
    backgroundColor: colors.main,
  },
  ordersButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C6C6C6',
  },
  ordersButtonActive: {
    backgroundColor: colors.main,
  },
  downloadButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  placeOrderButton: {
    position: 'absolute',
    bottom: 13,
    right: 90,

    borderRadius: 5,
  },
  rightAligned: {
    alignItems: 'flex-end',
  },

  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },

  orderIdText: {
    fontSize: 16,
    color: colors.TextBlack,
    fontFamily: 'Outfit-Regular',
  },

  productOrderIdText: {
    fontSize: 12,
    color: colors.TextBlack,
    fontFamily: 'Outfit-Bold',
  },

  orderDetailText: {
    fontSize: 16,
    color: colors.TextBlack,
    fontFamily: 'Outfit-Regular',
  },

  itemDetailText: {
    fontSize: 14,
    color: colors.TextBlack,
    fontFamily: 'Outfit-Medium',
  },

  statusContainer: {
    marginTop: 10,
  },

  orderStatusText: {
    fontSize: 20,
    color: colors.orange,
    fontFamily: 'Outfit-Bold',
  },
});

export default QuotesScreen;
