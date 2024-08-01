import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import QuotationItem from '../components/QuotationItem';
import {colors} from '../styles/color';
import axios from 'axios';

const QuotationScreen = ({navigation}) => {
  const [quotations, setQuotations] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductData = async () => {
      const user = auth().currentUser;
      if (user) {
        try {
          // Replace the URL with your API endpoint for adding items to the cart
          const response = await axios.post(
            `https://crossbee-server.vercel.app/getUserQuotations`,
            {
              uid: user.uid,
            },
          );
          console.log(response.data);

          if (response.data) {
            console.log('Item added to cart successfully');
            setQuotations(response.data);
          } else {
            console.error('Failed to add item to cart');
          }
        } catch (error) {
          console.error('Error adding item to cart:', error);
        }
      } else {
        setError('User not authenticated');
      }
    };
    fetchProductData()
  }, []);

  

  const handleCheckout = async quotation => {
    try {
      const userId = auth().currentUser.uid;

      const response = await axios.post(`https://crossbee-server.vercel.app/quotationCheckout`, {
        quotation,
        uid : userId 
      });

      if (response.data.data) {
        console.log('Item added to cart successfully');
        navigation.navigate('InvoiceScreen', {invoiceData: response.data.data});
      
      } else {
        console.error('Failed to checkout');
      }


    } catch (error) {
      console.error('Error saving order data: ', error);
      Alert.alert(
        'Error',
        'There was an issue processing your order. Please try again.',
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {quotations.map(quotation => (
        <View key={quotation.id} style={styles.quotationContainer}>
          <Text style={styles.quotationTitle}>Quotation {quotation.id}</Text>
          {quotation.items?.map(item => (
            <QuotationItem
              key={item.cartId}
              item={item}
              onUpdateQuantity={(cartId, action) => {
                // Handle quantity update here if needed
              }}
            />
          ))}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={() => handleCheckout(quotation)}>
              <Text style={styles.checkoutButtonText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
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
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
  quotationContainer: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  quotationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.TextBlack,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  checkoutButton: {
    backgroundColor: colors.main,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '80%',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QuotationScreen;
