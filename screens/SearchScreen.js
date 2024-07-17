import React, { useState } from 'react';
import { View, TextInput, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';
import ProductComponent from '../components/ProductComponent';
import { products } from '../data/productData'; // Ensure correct import path and structure

const SearchScreen = () => {
  const navigation = useNavigation();

  // State variables
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

  // Handle search functionality
  const handleSearch = () => {
    const filteredProducts = products.filter(product =>
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    navigation.navigate('SearchResultsScreen', { searchResults: filteredProducts });
  };

  return (
    <View style={styles.container}>
      {/* Search box */}
      <View style={styles.searchBox}>
        <Icon name="search" size={20} color="#484848" style={styles.icon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search your products"
          placeholderTextColor="#484848"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoFocus
        />
      </View>

      {/* Sorting and Filtering buttons */}
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
      <ScrollView contentContainerStyle={styles.productList}>
        {products && products.map(product => (
          <ProductComponent
            key={product.id}
            id={product.id}
            description={product.description}
            price={product.price}
            imageSource={product.images[0]} // Assuming images are properly structured
          />
        ))}
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
