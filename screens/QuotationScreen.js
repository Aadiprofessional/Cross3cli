import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import QuotationItem from '../components/QuotationItem';
import { colors } from '../styles/color';

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

      const unsubscribe = cartRef.orderBy('timestamp', 'desc').onSnapshot(
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
      const userId = auth().currentUser.uid;

      const orderData = {
        totalAmount: quotation.totalAmount || 0,
        shippingCharges: quotation.shippingCharges || 0,
        additionalDiscount: quotation.additionalDiscount || 0,
        rewardPointsPrice: quotation.useRewardPoints ? (quotation.rewardPointsPrice || 0) : 0,
        appliedCoupon: quotation.appliedCoupon ? (quotation.appliedCoupon.value || 0) : 0,
        cartItems: quotation.items || [],
        userId,
        timestamp: firestore.FieldValue.serverTimestamp(),
      };

      console.log('Order Data:', orderData);

      const docRef = await firestore().collection('Quotation').add(orderData);

      console.log('Order successfully saved to Firestore with ID:', docRef.id);

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
              onUpdateQuantity={(cartId, action) => {
                // Handle quantity update here if needed
              }}
            />
          ))}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={() => handleCheckout(quotation)}
            >
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
    shadowOffset: { width: 0, height: 2 },
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
