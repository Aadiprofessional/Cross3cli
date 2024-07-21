import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import QuotationItem from '../components/QuotationItem';

const QuotationScreen = ({ navigation }) => {
  const [quotations, setQuotations] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = auth().currentUser;
    if (user) {
      const cartRef = firestore()
        .collection('users')
        .doc(user.uid)
        .collection('Quotation');

      const unsubscribe = cartRef.onSnapshot(
        snapshot => {
          if (snapshot) {
            const data = snapshot.docs.map(doc => ({
              ...doc.data(),
              id: doc.id
            }));
            setQuotations(data);
          } else {
            setQuotations([]);
          }
        },
        err => {
          console.error('Error fetching quotations:', err);
          setError('Failed to load data. Please try again later.');
        }
      );

      return () => unsubscribe();
    } else {
      setError('User not authenticated');
    }
  }, []);

  const handleCheckout = async (quotation) => {
    try {
      const userId = auth().currentUser.uid; // Retrieve actual user ID
  
      // Define the orderData object with default values
      const orderData = {
        totalAmount: quotation.totalAmount || 0, // Default to 0 if undefined
        shippingCharges: quotation.shippingCharges || 0,
        additionalDiscount: quotation.additionalDiscount || 0,
        rewardPointsPrice: quotation.useRewardPoints ? (quotation.rewardPointsPrice || 0) : 0,
        appliedCoupon: quotation.appliedCoupon ? (quotation.appliedCoupon.value || 0) : 0,
        cartItems: quotation.items || [], // Default to an empty array if undefined
        userId,
        timestamp: firestore.FieldValue.serverTimestamp(), // To track when the order was placed
      };
  
      console.log('Order Data:', orderData); // Log data for debugging
  
      // Add order data to Firestore
      const docRef = await firestore().collection('Quotation').add(orderData);
      
      console.log('Order successfully saved to Firestore with ID:', docRef.id); // Log document ID
  
      // Navigate to the invoice screen with order data
      navigation.navigate('InvoiceScreen', { invoiceData: orderData });
    } catch (error) {
      console.error('Error saving order data: ', error);
      Alert.alert('Error', 'There was an issue processing your order. Please try again.');
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
            />
          ))}
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() => handleCheckout(quotation)}
          >
            <Text style={styles.checkoutButtonText}>Checkout</Text>
          </TouchableOpacity>
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
  },
  quotationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  checkoutButton: {
    backgroundColor: colors.main,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    width: '80%',
    alignSelf: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QuotationScreen;
