import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../styles/color';

const QuantityControl = ({ quantity, minValue, onIncrease, onDecrease ,maxValue}) => {
  return (
    <View style={styles.quantityContainer}>
      <Text style={styles.head}>Quantity:</Text>
      <TouchableOpacity
        onPress={onDecrease}
        style={[
          styles.quantityButton,
          quantity <= minValue && styles.disabledButton, // Disable button if quantity is <= minValue
        ]}
        disabled={quantity <= minValue} // Disable button if quantity is <= minValue
      >
        <Text style={styles.quantityButtonText}>-</Text>
      </TouchableOpacity>
      <Text style={styles.quantityText}>{quantity}</Text>
      <TouchableOpacity
        onPress={onIncrease}
        style={[
          styles.quantityButton,
          quantity >= maxValue && styles.disabledButton, // Disable button if quantity is <= minValue
        ]}
        disabled={quantity >= maxValue}
      >
        <Text style={styles.quantityButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  head: {
    fontSize: 18,
    fontFamily: 'Outfit-Medium',
    color: colors.TextBlack,
  },
  quantityText: {
    fontSize: 18,
    fontFamily: 'Outfit-Medium',
    color: colors.TextBlack,
    marginLeft: 6,
  },
  quantityButton: {
    backgroundColor: colors.main,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  quantityButtonText: {
    fontSize: 18,
    fontFamily: 'Outfit-Medium',
    color: '#fff',
  },
  disabledButton: {
    backgroundColor: colors.mainlight,
  },
});

export default QuantityControl;
