import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import ProductComponent from '../components/ProductComponent'; // Import your ProductComponent here
import SearchResultsScreen from './SearchResultsScreen'; // Import SearchResultsScreen

const SearchScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [openSort, setOpenSort] = useState(false);
  const [sortValue, setSortValue] = useState(null);
  const [sortItems, setSortItems] = useState([
    { label: 'Low to High', value: 'low_to_high' },
    { label: 'High to Low', value: 'high_to_low' },
    { label: 'Newest', value: 'newest' },
  ]);

  const [openFilter, setOpenFilter] = useState(false);
  const [filterValue, setFilterValue] = useState(null);
  const [filterItems, setFilterItems] = useState([
    { label: 'Category 1', value: 'category1' },
    { label: 'Category 2', value: 'category2' },
    { label: 'Category 3', value: 'category3' },
  ]);

  // Dummy product data for demonstration
  const products = [
    { id: 1, productName: 'Product 1', imageSource: require('../assets/product2.png'), description: 'Product 1 Description', price: '$100' },
    { id: 2, productName: 'Product 2', imageSource: require('../assets/product2.png'), description: 'Product 2 Description', price: '$150' },
    { id: 3, productName: 'Product 3', imageSource: require('../assets/product2.png'), description: 'Product 3 Description', price: '$200' },
    // Add more products as needed
  ];

  const handleSearch = () => {
    // Filter products based on searchQuery
    const filteredProducts = products.filter(product =>
      product.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Navigate to SearchResultsScreen with filtered products
    navigation.navigate('SearchResultsScreen', { searchResults: filteredProducts });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Icon name="search" size={20} color="#484848" style={styles.icon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search your products"
          placeholderTextColor="#484848"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch} // Trigger search on submit
          returnKeyType="search" // Show search button on keyboard
          autoFocus // Automatically focus on input
        />
      </View>
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonWrapper}>
          <DropDownPicker
            open={openSort}
            value={sortValue}
            items={sortItems}
            setOpen={setOpenSort}
            setValue={setSortValue}
            setItems={setSortItems}
            placeholder="Sort By"
            style={styles.smallButton}
            dropDownContainerStyle={styles.smallDropDownContainer}
            textStyle={styles.buttonText}
            ArrowDownIconComponent={({ style }) => (
              <Icon name="chevron-down" size={16} color="#484848" style={style} />
            )}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <DropDownPicker
            open={openFilter}
            value={filterValue}
            items={filterItems}
            setOpen={setOpenFilter}
            setValue={setFilterValue}
            setItems={setFilterItems}
            placeholder="Filter"
            style={styles.smallButton}
            dropDownContainerStyle={styles.smallDropDownContainer}
            textStyle={styles.buttonText}
            ArrowDownIconComponent={({ style }) => (
              <Icon name="chevron-down" size={16} color="#484848" style={style} />
            )}
          />
        </View>
      </View>

      {/* Product list */}
      <View style={styles.productList}>
        {products.map(product => (
          <ProductComponent
            key={product.id}
            productName={product.productName}
            imageSource={product.imageSource}
            description={product.description}
            price={product.price}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECECEC',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#484848',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  buttonWrapper: {
    marginRight: 10,
  },
  smallButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: 120,
  },
  smallDropDownContainer: {
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
  },
  buttonText: {
    fontSize: 14,
    color: '#484848',
    marginRight: 5,
  },
  productList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

export default SearchScreen;
