import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DropDownPicker from 'react-native-dropdown-picker';
import { fetchProducts } from '../services/apiService';
import ProductComponent from '../components/ProductComponent';
import FilterComponent from '../components/FilterDropdown';
import { debounce } from 'lodash';

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [originalProducts, setOriginalProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [sortedResults, setSortedResults] = useState([]);
  const [openSort, setOpenSort] = useState(false);
  const [sortValue, setSortValue] = useState(null);
  const [sortItems, setSortItems] = useState([
    { label: 'Low to High', value: 'low_to_high' },
    { label: 'High to Low', value: 'high_to_low' },
  ]);
  const [filterVisible, setFilterVisible] = useState(false);
  const [filterOptions, setFilterOptions] = useState({});
  const [loading, setLoading] = useState(true);

  // Load products on mount
  const loadProducts = useCallback(async () => {
    try {
      const products = await fetchProducts();
      setOriginalProducts(products);
      setSearchResults(products);
      setLoading(false);
    } catch (error) {
      console.error('Error loading products:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);
  
  // Filter products based on search query and filter options
  const debouncedSearch = useMemo(
    () =>
      debounce(query => {
        let filteredProducts = originalProducts.filter(product =>
          product.searchName.toLowerCase().includes(query.toLowerCase()),
        );

        // Apply Category Filter
        
        if (filterOptions.category) {
          console.log(filterOptions.category, filteredProducts[0].mainId);
          
          filteredProducts = filteredProducts.filter(
            product => product.mainId === filterOptions.category,
          );
        }
        
        // Apply Discount Filter
        if (filterOptions.discount) {
          filteredProducts = filteredProducts.filter(product => {
            console.log(product);
            switch (filterOptions.discount) {
              case '10_above':
                return product.additionalDiscount >= 10;
              case '20_above':
                return product.additionalDiscount >= 20;
              case '30_above':
                return product.additionalDiscount >= 30;
              default:
                return true;
            }
          });
        }
        if (filterOptions.minPrice || filterOptions.maxPrice) {
          filteredProducts = filteredProducts.filter(product => {
            const price = parseFloat(product.price);
            return (
              price >= filterOptions.minPrice && price <= filterOptions.maxPrice
            );
          });
        }

        // Exclude Out of Stock products
        if (filterOptions.excludeOutOfStock) {
          filteredProducts = filteredProducts.filter(
            product => !product.outOfStock,
          );
        }

        setSearchResults(query ? filteredProducts : originalProducts);
        setSortedResults(filteredProducts ?? originalProducts);
        setSortValue(null);
      }, 300),

    [originalProducts, filterOptions],
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  // Sort products based on price
  useEffect(() => {
    const sortProducts = () => {
      let sortedProducts = [...searchResults];

      if (sortValue === 'low_to_high') {
        sortedProducts.sort(
          (a, b) => parseFloat(a.price) - parseFloat(b.price),
        );
      } else if (sortValue === 'high_to_low') {
        sortedProducts.sort(
          (a, b) => parseFloat(b.price) - parseFloat(a.price),
        );
      }

      setSortedResults(sortedProducts);
    };

    sortProducts();
  }, [sortValue, searchResults]);


  // Apply filter options
  const applyFilters = filters => {
    setFilterOptions(filters);
    setFilterVisible(false); // Close the filter modal after applying filters
  };

  const renderItem = ({ item }) => <ProductComponent product={item} />;

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
          returnKeyType="search"
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
          />
        </View>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={styles.smallButton}
            onPress={() => setFilterVisible(true)}>
            <Text style={styles.buttonText}>Filter</Text>
            <Icon name="chevron-down" size={16} color="#484848" />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FFB800" style={styles.loader} />
      ) : sortedResults.length === 0 ? (
        <Text style={styles.noResultsText}>No results found</Text>
      ) : (
        <FlatList
          data={sortedResults}
          renderItem={renderItem}
          keyExtractor={item => item.productId}
          contentContainerStyle={styles.productList}
          style={styles.flatList}
          numColumns={2} // Display two products per row
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Filter Modal */}
      <Modal
        visible={filterVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFilterVisible(false)}>
        <Pressable
          style={styles.modalBackground}
          onPress={() => setFilterVisible(false)}>
          <View style={styles.modalContainer}>
            <FilterComponent
              filterOptions={filterOptions}  // Pass current filter options to the component
              applyFilters={applyFilters}
              onClose={() => setFilterVisible(false)}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5, // Adds equal padding from left and right
    backgroundColor: '#FFFFFF',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECECEC',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    marginTop: 20,
  },
  icon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    color: '#484848',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Align items to the center vertically
    marginBottom: 10,
  },
  buttonWrapper: {
    marginRight: 15, // Adjust margin for equal spacing between buttons
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
    fontFamily: 'Outfit-Medium',
    color: '#484848',
    marginRight: 5,
  },
  productList: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 8, // Adjust horizontal padding for equal margins
  },
  noResultsText: {
    fontSize: 18,
    fontFamily: 'Outfit-Medium',
    color: '#484848',
    textAlign: 'center',
    marginTop: 20,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
  },
});

export default SearchScreen;
