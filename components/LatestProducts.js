import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {colors} from '../styles/color';

const deals = [
  {id: 1, title: 'Product 1', image: require('../assets/product.png')},
  {id: 2, title: 'product 2', image: require('../assets/product.png')},
];

const LatestProducts = () => {
  const handleDealPress = dealId => {
    // Handle click action for each deal here
    console.log(`Clicked on deal ${dealId}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Latest Products</Text>
      <View style={styles.dealsContainer}>
        {deals.map(deal => (
          <TouchableOpacity
            key={deal.id}
            style={[styles.dealContainer, {backgroundColor: colors.primary}]}
            onPress={() => handleDealPress(deal.id)}>
            <Text style={styles.dealText}>{deal.title}</Text>
            <Image source={deal.image} style={styles.dealImage} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    paddingVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    marginLeft: 10,
  },
  dealsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  dealContainer: {
    width: '48%',
    height: 200,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dealText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'left',
    marginBottom: 10,
  },
  dealImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
});

export default LatestProducts;
