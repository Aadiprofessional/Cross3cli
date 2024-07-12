import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import ProductComponent from '../components/ProductComponent';

const SearchResultsScreen = ({ route }) => {
  const { searchResults } = route.params;

  return (
    <View style={styles.container}>
      <FlatList
        data={searchResults}
        renderItem={({ item }) => (
          <ProductComponent
            productName={item.productName}
            imageSource={item.imageSource}
            description={item.description}
            price={item.price}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.productList}
        numColumns={2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  productList: {
    justifyContent: 'space-between',
  },
});

export default SearchResultsScreen;
