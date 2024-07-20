import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import ProductComponent from '../components/ProductComponent';

const SearchResultsScreen = ({ route }) => {
  const { searchResults } = route.params;

  return (
    <View style={styles.container}>
      {searchResults.length === 0 ? (
        <View style={styles.noResultsContainer}>
          <Image source={require('../assets/Quotes.png')} style={styles.image} />
          <Text style={styles.noResultsText}>Product not found</Text>
          <Text style={styles.infoText}>Sorry, we couldn't find any products matching your search.</Text>
        </View>
      ) : (
        <FlatList
          data={searchResults}
          renderItem={({ item }) => (
            <ProductComponent
              key={item.id}
              id={item.id}
              productName={item.productName}
              imageSource={item.mainImage}
              description={item.description}
              price={item.price}
            />
          )}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.productList}
          numColumns={2}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  noResultsText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  productList: {
    justifyContent: 'space-between',
  },
});

export default SearchResultsScreen;
