import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { colors } from '../styles/color';

const QuotationContent = ({ item, onIncrease, onDecrease }) => {
  return (
    <View style={styles.itemContainer}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image}} // Make sure the image source is correct
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>₹{(item.price * item.quantity).toFixed(2)}</Text>
        <View style={styles.colorContainer}>
          <View style={styles.itemColorContainer}>
            <View style={[styles.itemColor, { backgroundColor: colors.main }]}>
              <Text style={styles.itemColorText}>{item.color}</Text>
            </View>
          </View>
        </View>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => onDecrease(item.cartId)}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => onIncrease(item.cartId)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    padding: 10,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  imageContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  detailsContainer: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.TextBlack,
  },
  productPrice: {
    fontSize: 18,
    marginTop: 5,
    fontWeight: 'bold',
    color: colors.TextBlack,
  },
  colorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  itemColorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemColor: {
    width: 40,
    height:25,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  itemColorText: {
    fontSize: 16,
    color: '#fff', // Text color inside the color box
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityButton: {
    backgroundColor: colors.main,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  quantityButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 18,
    color: colors.TextBlack,
    marginHorizontal: 10,
  },
});

export default QuotationContent;
