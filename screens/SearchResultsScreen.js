import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import ProductComponent from '../components/ProductComponent';

const SearchResultsScreen = ({route}) => {
  const {searchResults} = route.params;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.productList}>
        {searchResults.length > 0 ? (
          searchResults.map(product => (
            <ProductComponent
              key={product.productId}
              id={product.productId}
              productName={product.displayName}
              imageSource={product.image}
              price={product.price}
            />
          ))
        ) : (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>No products found</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  productList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 18,
    fontFamily: 'Outfit-Bold',
    color: '#484848',
  },
});

export default SearchResultsScreen;
