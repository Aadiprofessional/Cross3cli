import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../styles/color';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const QuotesScreen = () => {
  const navigation = useNavigation();
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOrderItems, setShowOrderItems] = useState(false); // State to track button click
  const [activeButton, setActiveButton] = useState('quotes'); // State to track active button

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const userId = auth().currentUser.uid;
        const ordersSnapshot = await firestore()
          .collection('orders')
          .where('userId', '==', userId)
          .get();

        const orders = ordersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOrderHistory(orders);
      } catch (error) {
        console.error('Error fetching order history: ', error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch order history every time the screen is visited
    const unsubscribe = navigation.addListener('focus', fetchOrderHistory);

    return unsubscribe;
  }, [navigation]);

  const handleStartShopping = () => {
    navigation.navigate('Home');
  };

  const handleGetQuotation = () => {
    setActiveButton('quotes'); // Set active button to quotes
    setShowOrderItems(false); // Hide order items
  };

  const handleCheckout = () => {
    setActiveButton('orders'); // Set active button to orders
    setShowOrderItems(true); // Show order items
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderText}>Order ID: <Text style={styles.boldText}>{item.id}</Text></Text>
      <Text style={styles.orderText}>Total Amount: ₹<Text style={styles.boldText}>{item.totalAmount}</Text></Text>
      <Text style={styles.orderText}>Items:</Text>
      {item.cartItems.map(cartItem => (
        <Text key={cartItem.id} style={styles.orderText}>
          <Text style={styles.boldText}>{cartItem.name}</Text> - {cartItem.quantity} x ₹<Text style={styles.boldText}>{cartItem.price}</Text>
        </Text>
      ))}
    </View>
  );

  const renderQuoteItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderText}>Quote ID: <Text style={styles.boldText}>{item.id}</Text></Text>
      <Text style={styles.orderText}>Details: <Text style={styles.boldText}>{item.details}</Text></Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.main} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.headerButton, activeButton === 'quotes' ? styles.quotesButtonActive : styles.quotesButton]}
          onPress={handleGetQuotation}>
          <Text style={[styles.headerButtonText, { color: activeButton === 'quotes' ? '#fff' : '#00000070' }]}>Quotes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.headerButton, activeButton === 'orders' ? styles.ordersButtonActive : styles.ordersButton]}
          onPress={handleCheckout}>
          <Text style={[styles.headerButtonText, { color: activeButton === 'orders' ? '#fff' : '#00000070' }]}>Orders</Text>
        </TouchableOpacity>
      </View>
      {(activeButton === 'quotes' && orderHistory.length === 0) || (activeButton === 'orders' && orderHistory.length === 0) ? (
        <>
          <Image source={require('../assets/Quotes.png')} style={styles.image} />
          <Text style={styles.noQuoteText}>No {activeButton === 'quotes' ? 'Quote' : 'Order'} yet</Text>
          <Text style={styles.infoText}>Looks like you have not added any {activeButton === 'quotes' ? 'quote' : 'order'}</Text>
          <TouchableOpacity style={styles.button} onPress={handleStartShopping}>
            <Text style={styles.buttonText}>Start Shopping</Text>
          </TouchableOpacity>
        </>
      ) : showOrderItems ? (
        <FlatList
          data={orderHistory}
          keyExtractor={item => item.id}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.orderList}
        />
      ) : (
        <FlatList
          data={orderHistory}
          keyExtractor={item => item.id}
          renderItem={renderQuoteItem}
          contentContainerStyle={styles.orderList}
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
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  noQuoteText: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
    color: colors.TextBlack,
  },
  infoText: {
    fontSize: 16,
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
    fontWeight: 'bold',
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  orderText: {
    fontSize: 16,
    color: colors.TextBlack,
    marginBottom: 5,
  },
  boldText: {
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  headerButton: {
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '45%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  quotesButton: {
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 1,
  },
  ordersButton: {
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 1,
  },
  quotesButtonActive: {
    backgroundColor: colors.main,
  },
  ordersButtonActive: {
    backgroundColor: colors.main,
  },
  headerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QuotesScreen;
