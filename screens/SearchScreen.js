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
  Pressable, // Import Pressable for handling touch outside
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DropDownPicker from 'react-native-dropdown-picker';
import { fetchProducts } from '../services/apiService';
import ProductComponent from '../components/ProductComponent';
import FilterComponent from '../components/FilterDropdown'; // Updated component
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
    { label: 'Newest', value: 'newest' },
  ]);
  const [filterVisible, setFilterVisible] = useState(false); // State to control filter visibility
  const [filterOptions, setFilterOptions] = useState({});
  const [loading, setLoading] = useState(true);

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

  const debouncedSearch = useMemo(
    () =>
      debounce(query => {
        let filteredProducts = originalProducts.filter(product =>
          product.searchName.toLowerCase().includes(query.toLowerCase()),
        );

        if (filterOptions.category) {
          filteredProducts = filteredProducts.filter(
            product => product.category === filterOptions.category,
          );
        }

        if (filterOptions.priceRange) {
          filteredProducts = filteredProducts.filter(product => {
            switch (filterOptions.priceRange) {
              case 'below_500':
                return product.price < 500;
              case '500_1000':
                return product.price >= 500 && product.price <= 1000;
              case 'above_1000':
                return product.price > 1000;
              default:
                return true;
            }
          });
        }

        if (filterOptions.discount) {
          filteredProducts = filteredProducts.filter(product => {
            switch (filterOptions.discount) {
              case '10_above':
                return product.discount >= 10;
              case '20_above':
                return product.discount >= 20;
              case '30_above':
                return product.discount >= 30;
              default:
                return true;
            }
          });
        }

        if (filterOptions.excludeOutOfStock) {
          filteredProducts = filteredProducts.filter(
            product => !product.outOfStock,
          );
        }

        setSearchResults(query ? filteredProducts : originalProducts);
      }, 300),
    [originalProducts, filterOptions],
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

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

  const applyFilters = filters => {
    setFilterOptions(filters);
    setFilterVisible(false); // Close the filter component
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
          autoFocus
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
              <Icon
                name="chevron-down"
                size={16}
                color="#484848"
                style={style}
              />
            )}
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
          numColumns={2} // Display two products per row
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
          onPress={() => setFilterVisible(false)} // Close modal on press outside
        >
          <View style={styles.modalContainer}>
            <FilterComponent
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
    fontFamily: 'Outfit-Medium',
    color: '#484848',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Changed to space-between for alignment
    marginBottom: 10,
  },
  buttonWrapper: {
    marginHorizontal: 5, // Adjusted margin for better spacing
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
