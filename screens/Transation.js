import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import { colors } from '../styles/color';

const TransactionScreen = () => {
  const [transactionId, setTransactionId] = useState('');
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    try {
      const user = auth().currentUser;
      if (user) {
        const response = await axios.get(
          `https://crossbee-server-1036279390366.asia-south1.run.app/getTransactions?uid=${user.uid}`
        );
  
        // Sort transactions by timestamp in descending order
        const sortedTransactions = (response.data || []).sort(
          (a, b) => b.timestamp._seconds - a.timestamp._seconds
        );
  
        setTransactions(sortedTransactions);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      Alert.alert('Error', 'Failed to fetch transactions. Please try again.');
    }
  };
  

  useEffect(() => {
    fetchTransactions(); // Fetch transactions on component load
  }, []);

  const handleSubmit = async () => {
    try {
      const user = auth().currentUser;
      if (!user) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }

      if (transactionId.length !== 12) {
        Alert.alert('Failed', 'Transaction ID must be exactly 12 digits');
        return;
      }

      if (!/^\d{1,8}$/.test(amount)) {
        Alert.alert('Error', 'Amount must be a numeric value with up to 8 digits');
        return;
      }

      if (!transactionId || !amount) {
        Alert.alert('Error', 'Please fill out all fields');
        return;
      }

      const body = {
        uid: user.uid,
        transactionId,
        amount,
      };

      await axios.post(
        'https://crossbee-server-1036279390366.asia-south1.run.app/createTransaction',
        body
      );

      Alert.alert('Success', 'Transaction created successfully');
      setTransactionId('');
      setAmount('');
      fetchTransactions(); // Refresh transactions after submission
    } catch (error) {
      console.error('Error creating transaction:', error);
      Alert.alert('Error', 'Failed to create transaction. Please try again.');
    }
  };

  const formatDate = timestamp => {
    const date = new Date(timestamp._seconds * 1000);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Transaction ID"
          placeholderTextColor="#484848"
          value={transactionId}
          onChangeText={text => setTransactionId(text.replace(/[^0-9]/g, '').slice(0, 12))}
          style={styles.input}
          maxLength={12}
          keyboardType="numeric"
        />
        <TextInput
          placeholder="Amount"
          value={amount}
          placeholderTextColor="#484848"
          onChangeText={text => setAmount(text.replace(/[^0-9]/g, '').slice(0, 8))}
          keyboardType="numeric"
          maxLength={8}
          style={styles.input}
        />
        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.transactionHistoryContainer}>
        <Text style={styles.historyTitle}>Transaction History</Text>
        {transactions.length > 0 ? (
          transactions.map((transaction, index) => (
            <View key={index} style={styles.transactionCard}>
              <Text style={styles.transactionText}>
                Transaction ID: {transaction.id}
              </Text>
              <Text style={styles.transactionText}>
                Amount: {Number(transaction.amount).toLocaleString("en-IN", {
                  maximumFractionDigits: 0,
                  style: 'currency',
                  currency: 'INR',
                })}
              </Text>
              <Text style={styles.transactionText}>
                Name: {transaction.name}
              </Text>
              <Text style={styles.transactionText}>
                Phone: {transaction.phone}
              </Text>
              <Text style={styles.transactionText}>
                Date: {formatDate(transaction.timestamp)}
              </Text>
              <Text style={styles.transactionText2}>
                {transaction.status}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noTransactionsText}>No transactions found.</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    fontFamily: 'Outfit-Medium',
    color: '#484848',
  },
  submitButton: {
    backgroundColor: colors.main,
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
  },
  transactionHistoryContainer: {
    marginTop: 20,
  },
  historyTitle: {
    fontSize: 18,
    color: '#000000',
    fontFamily: 'Outfit-Bold',
    marginBottom: 10,
  },
  transactionCard: {
    backgroundColor: colors.primary,
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
  },
  transactionText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Outfit-Medium',
  },
  transactionText2: {
    fontSize: 24,
    color: colors.orange,
    fontFamily: 'Outfit-Medium',
  },
  noTransactionsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    fontFamily: 'Outfit-Medium',
    marginTop: 20,
  },
});

export default TransactionScreen;
