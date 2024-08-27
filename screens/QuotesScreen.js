import React, {useCallback, useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {colors} from '../styles/color';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/Feather';
import axios from 'axios';

const QuotesScreen = () => {
  const navigation = useNavigation();
  const [quotations, setQuotations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeButton, setActiveButton] = useState('quotes');

  const fetchProductData = useCallback(async () => {
    const user = auth().currentUser;
    if (user) {
      setLoading(true);
      try {
        const [quotationsResponse, ordersResponse] = await Promise.all([
          axios.post('https://crossbee-server.vercel.app/getQuotations', {
            uid: user.uid,
          }),
          axios.post('https://crossbee-server.vercel.app/getOrders', {
            uid: user.uid,
          }),
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
    navigation.navigate('HomeTab');
  };

  const handleGetQuotation = () => {
    setActiveButton('quotes');
  };

  const handleCheckout = () => {
    setActiveButton('orders');
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const navigateToInvoice = useCallback(data => {
    navigation.navigate('InvoiceScreen2', {
      quotationId: activeButton === 'quotes' ? data.id : null,
      orderId: activeButton === 'orders' ? data.id : null,
    });
  });

  const handleQuoteCheckout = quote => {
    navigation.navigate('OrderSummary', {
      cartItems: quote.cartItems,
      totalAmount: quote.totalAmount,
    });
  };

  const renderOrderItem = useMemo(
    () =>
      // eslint-disable-next-line react/no-unstable-nested-components
      ({item}) =>
        (
          <View style={styles.orderItem}>
            <Text style={styles.statusText}>{item.status}</Text>
            <Text style={styles.orderText}>
              Order ID: <Text style={styles.boldText}>{item.id}</Text>
            </Text>
            <Text style={styles.orderText}>
              Total Amount: ₹
              <Text style={styles.boldText}>{item.totalAmount}</Text>
            </Text>
            <Text style={styles.orderText}>Items:</Text>
            {item.cartItems.map(cartItem => (
              <Text key={cartItem.id} style={styles.orderText}>
                <Text style={styles.boldText}>{cartItem.name}</Text> -{' '}
                {cartItem.quantity} x ₹
                <Text style={styles.boldText}>{cartItem.price}</Text>
              </Text>
            ))}
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={() => navigateToInvoice(item)}>
              <Icon name="download" size={20} color={colors.main} />
            </TouchableOpacity>
          </View>
        ),
    [navigateToInvoice],
  );

  const renderQuoteItem = useMemo(
    () =>
      // eslint-disable-next-line react/no-unstable-nested-components
      ({item}) =>
        (
          <View style={styles.orderItem}>
            <Text style={styles.statusText}>{item.status}</Text>

            <Text style={styles.orderText}>
              Quote ID: <Text style={styles.boldText}>{item.id}</Text>
            </Text>
            <Text style={styles.orderText}>
              Total Amount: ₹
              <Text style={styles.boldText}>{item.totalAmount}</Text>
            </Text>
            <Text style={styles.orderText}>Items:</Text>
            {item.cartItems.map(cartItem => (
              <Text key={cartItem.id} style={styles.orderText}>
                <Text style={styles.boldText}>{cartItem.name}</Text> -{' '}
                {cartItem.quantity} x ₹
                <Text style={styles.boldText}>{cartItem.price}</Text>
              </Text>
            ))}
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={() => navigateToInvoice(item)}>
              <Icon name="download" size={20} color={colors.main} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.placeOrderButton}
              onPress={() => handleQuoteCheckout(item)}>
              <Icon name="external-link" size={20} color={colors.main} />
            </TouchableOpacity>
          </View>
        ),
    [navigateToInvoice],
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
              {color: activeButton === 'quotes' ? '#fff' : '#00000070'},
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
              {color: activeButton === 'orders' ? '#fff' : '#00000070'},
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
    color: colors.orange,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Outfit-Bold',
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  noQuoteText: {
    fontSize: 24,
    fontWeight: '600',
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
  buttonText: {
    color: '#fff',
    fontSize: 16,

    fontFamily: 'Outfit-Bold',
  },
  orderList: {
    width: '100%',
  },
  orderItem: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    position: 'relative',
  },
  orderText: {
    fontSize: 16,
    color: colors.TextBlack,
    marginBottom: 5,
    fontFamily: 'Outfit-Medium',
  },
  boldText: {
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerButton: {
    paddingVertical: 10,
    paddingHorizontal: 60,
    borderRadius: 5,
  },
  headerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
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
    bottom: 10,
    right: 40,

    borderRadius: 5,
  },
});

export default QuotesScreen;
