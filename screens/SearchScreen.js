import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {View, TextInput, StyleSheet, ScrollView, Text} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DropDownPicker from 'react-native-dropdown-picker';
import {fetchProducts} from '../services/apiService';
import ProductComponent from '../components/ProductComponent';
import {ActivityIndicator} from 'react-native-paper';
import {debounce} from 'lodash';

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [originalProducts, setOriginalProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [sortedResults, setSortedResults] = useState([]);
  const [openSort, setOpenSort] = useState(false);
  const [sortValue, setSortValue] = useState(null);
  const [sortItems, setSortItems] = useState([
    {label: 'Low to High', value: 'low_to_high'},
    {label: 'High to Low', value: 'high_to_low'},
    {label: 'Newest', value: 'newest'},
  ]);
  const [openFilter, setOpenFilter] = useState(false);
  const [filterValue, setFilterValue] = useState(null);
  const [filterItems, setFilterItems] = useState([
    {label: 'Category 1', value: 'category1'},
    {label: 'Category 2', value: 'category2'},
    {label: 'Category 3', value: 'category3'},
  ]);
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

  // Debounced search handler
  const debouncedSearch = useMemo(
    () =>
      debounce(query => {
        let filteredProducts = originalProducts.filter(product =>
          product.searchName.toLowerCase().includes(query.toLowerCase()),
        );

        if (filterValue) {
          filteredProducts = filteredProducts.filter(
            product => product.category === filterValue,
          );
        }

        // Flatten products with multiple items
        const productMap = new Map();
        filteredProducts.forEach(product => {
          if (!productMap.has(product.productId)) {
            productMap.set(product.productId, []);
          }
          productMap.get(product.productId).push(product);
        });

        const flattenedProducts = Array.from(productMap.values()).flat();
        setSearchResults(query ? flattenedProducts : originalProducts);
      }, 300),
    [originalProducts, filterValue],
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
      } else if (sortValue === 'newest') {
        // Add logic if you have a date field
      }

      setSortedResults(sortedProducts);
    };

    sortProducts();
  }, [sortValue, searchResults]);

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
            ArrowDownIconComponent={({style}) => (
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
            ArrowDownIconComponent={({style}) => (
              <Icon
                name="chevron-down"
                size={16}
                color="#484848"
                style={style}
              />
            )}
          />
        </View>
      </View>

      {/* Loading Indicator */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#FCCC51" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.productList}>
          {sortedResults.length > 0 ? (
            sortedResults.map(product => (
              <ProductComponent
                key={product.productId}
                id={product.productId}
                productName={product.displayName}
                imageSource={product.image} // Use the image URL from API
                price={product.price}
                categoryId={product.categoryId}
                mainId={product.mainId}
              />
            ))
          ) : (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No products found</Text>
            </View>
          )}
        </ScrollView>
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 18,
    color: '#484848',
  },
});

export default SearchScreen;
