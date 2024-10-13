import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import { colors } from '../styles/color';  // Assuming colors.primary is defined here

const WalletScreen = () => {
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    try {
      const user = auth().currentUser;
      if (user) {
        const response = await axios.get(
          `https://crossbee-server-1036279390366.asia-south1.run.app/getWallet?uid=${user.uid}`
        );
        setTransactions(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      Alert.alert('Error', 'Failed to fetch transactions. Please try again.');
    }
  };

  useEffect(() => {
    fetchTransactions(); 
  }, []);

  const formatDate = timestamp => {
    const date = new Date(timestamp._seconds * 1000);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.transactionHistoryContainer}>
        <Text style={styles.historyTitle}>Wallet Transactions</Text>
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
                Date: {formatDate(transaction.timestamp)}
              </Text>
              <Text style={styles.transactionStatus}>
                Status: {transaction.status}
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
  transactionHistoryContainer: {
    marginTop: 20,
  },
  historyTitle: {
    fontSize: 18,
    fontFamily: 'Outfit-Bold',
    marginBottom: 10,
  },
  transactionCard: {
    backgroundColor: colors.primary,  // Using colors.primary for background
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
  },
  transactionText: {
    fontSize: 16,
    color: '#333',  // Dark text for readability
    fontFamily: 'Outfit-Medium',
  },
  transactionStatus: {
    fontSize: 18,
    color: colors.orange,  // Highlighting the status in a different color
    fontFamily: 'Outfit-Bold',
  },
  noTransactionsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    fontFamily: 'Outfit-Medium',
    marginTop: 20,
  },
});

export default WalletScreen;
