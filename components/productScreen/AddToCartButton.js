import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {colors} from '../../styles/color';

const AddToCartButton = ({onPress}) => {
  return (
    <TouchableOpacity style={styles.addToCartButton} onPress={onPress}>
      <Text style={styles.addToCartButtonText}>Add to Cart</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  addToCartButton: {
    backgroundColor: colors.main, // Example color
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 20,
    alignItems: 'center',
    marginBottom: 30,
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Outfit-Bold',
  },
});

export default AddToCartButton;
