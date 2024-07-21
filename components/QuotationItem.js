import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import QuotationContent from '../screens/QuotationContent';
import firestore from '@react-native-firebase/firestore';

const QuotationItem = ({ item, onUpdateQuantity }) => {
  const handleIncrease = () => {
    onUpdateQuantity(item.cartId, 'increase');
  };

  const handleDecrease = () => {
    onUpdateQuantity(item.cartId, 'decrease');
  };

  return (
    <QuotationContent
      item={item}
      onIncrease={handleIncrease}
      onDecrease={handleDecrease}
    />
  );
};

export default QuotationItem;
