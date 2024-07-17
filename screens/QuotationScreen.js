import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../styles/color';
import CartItem from '../components/CartItem';

const QuotationScreen = () => {
  const [quotations, setQuotations] = useState([]);
  const navigation = useNavigation();

  const handleGetQuotation = () => {
    const currentCartItems = [
      { id: 1, name: 'Product A', price: 19.99, quantity: 1 },
      { id: 2, name: 'Product B', price: 24.99, quantity: 1 },
      { id: 3, name: 'Product C', price: 14.99, quantity: 1 },
    ];
    
    // Add a new quotation with current cart items
    setQuotations([...quotations, { items: currentCartItems }]);

    // Optionally, clear cart items if needed
    // setCartItems([]);
  };

  const handleCheckout = () => {
    console.log('Checkout button pressed');
  };

  const handleRemoveItem = (quotationIndex, itemId) => {
    const updatedQuotations = [...quotations];
    updatedQuotations[quotationIndex].items = updatedQuotations[quotationIndex].items.filter(item => item.id !== itemId);
    setQuotations(updatedQuotations);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.headerButton, styles.quotesButton]}
          onPress={handleGetQuotation}>
          <Text style={[styles.headerButtonText, { color: '#fff' }]}>Quotes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.headerButton,
            styles.ordersButton,
            { color: '#00000064' },
          ]}
          onPress={handleCheckout}>
          <Text style={[styles.headerButtonText, { color: '#00000070' }]}>
            Orders
          </Text>
        </TouchableOpacity>
      </View>

      {quotations.map((quotation, index) => (
        <View key={index} style={[styles.quotesBox, styles.shadow]}>
          <ScrollView contentContainerStyle={styles.boxContent}>
            <View style={styles.row}>
              <Text style={styles.label}>Quotation number:</Text>
              <Text style={styles.label}>Created on:</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.value}>#789012</Text>
              <Text style={styles.value}>22 June 2024</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Status:</Text>
            </View>
            <Text style={[styles.value, { color: '#F59F13' }]}>Pending</Text>

            {quotation.items.map(item => (
              <CartItem
                key={item.id}
                id={item.id}
                name={item.name}
                price={item.price}
                quantity={item.quantity}
                onUpdateQuantity={(itemId, newQuantity) => {
                  const updatedQuotations = [...quotations];
                  const quotationIndex = updatedQuotations.findIndex(q => q === quotation);
                  updatedQuotations[quotationIndex].items = updatedQuotations[quotationIndex].items.map(qItem =>
                    qItem.id === itemId ? { ...qItem, quantity: newQuantity } : qItem
                  );
                  setQuotations(updatedQuotations);
                }}
                onRemoveItem={() => handleRemoveItem(index, item.id)}
              />
            ))}

            <TouchableOpacity
              style={[styles.checkoutButton, { backgroundColor: colors.main }]}
              onPress={handleCheckout}>
              <Text style={[styles.buttonText, { color: '#fff' }]}>Checkout</Text>
            </TouchableOpacity>
          </ScrollView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
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
    backgroundColor: colors.main,
  },
  ordersButton: {
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 1,
  },
  headerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quotesBox: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  boxContent: {
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: '#787878',
    fontWeight: 'normal',
  },
  value: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
  },
  checkoutButton: {
    width: '80%',
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
});

export default QuotationScreen;
