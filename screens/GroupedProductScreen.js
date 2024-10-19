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

import FilterComponent from '../components/FilterDropdown';
import { debounce } from 'lodash';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { ScrollView } from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import { colors } from '../styles/color';
import ProductComponent2 from '../components/ProductComponent copy';

const GroupedProductScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [originalProducts, setOriginalProducts] = useState({});
  const [searchResults, setSearchResults] = useState({});
  const [sortedResults, setSortedResults] = useState({});
  const [openSort, setOpenSort] = useState(false);
  const [sortValue, setSortValue] = useState(null);
  const [sortItems, setSortItems] = useState([
    { label: 'Low to High', value: 'low_to_high' },
    { label: 'High to Low', value: 'high_to_low' },
  ]);
  const [filterVisible, setFilterVisible] = useState(false);
  const [filterOptions, setFilterOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [visibleCategories, setVisibleCategories] = useState(2); 
  const [loadingMore, setLoadingMore] = useState(false);

  const userUid = auth().currentUser?.uid;

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://crossbee-server-1036279390366.asia-south1.run.app/allProducts?uid=${userUid}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const productsData = await response.json();
      const groupedProducts = {};
      for (const [category, products] of Object.entries(productsData)) {
        if (Array.isArray(products)) {
          groupedProducts[category] = products;
        }
      }

      setOriginalProducts(groupedProducts);
      setSearchResults(groupedProducts);
      setLoading(false);
    } catch (error) {
      console.error('Error loading products:', error);
      setLoading(false);
    }
  }, [userUid]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const SkeletonLoader = () => {
    return (
      <SkeletonPlaceholder>
        <View style={styles.skeletonContainer}>
          <View style={styles.skeletonCard}>
            <View style={styles.skeletonImage} />
            <View style={styles.skeletonText} />
            <View style={styles.skeletonTextSmall} />
          </View>
          <View style={styles.skeletonCard}>
            <View style={styles.skeletonImage} />
            <View style={styles.skeletonText} />
            <View style={styles.skeletonTextSmall} />
          </View>
        </View>
        <View style={styles.skeletonContainer}>
          <View style={styles.skeletonCard}>
            <View style={styles.skeletonImage} />
            <View style={styles.skeletonText} />
            <View style={styles.skeletonTextSmall} />
          </View>
          <View style={styles.skeletonCard}>
            <View style={styles.skeletonImage} />
            <View style={styles.skeletonText} />
            <View style={styles.skeletonTextSmall} />
          </View>
        </View>

        {/* Third Pair */}
        <View style={styles.skeletonContainer}>
          <View style={styles.skeletonCard}>
            <View style={styles.skeletonImage} />
            <View style={styles.skeletonText} />
            <View style={styles.skeletonTextSmall} />
          </View>
          <View style={styles.skeletonCard}>
            <View style={styles.skeletonImage} />
            <View style={styles.skeletonText} />
            <View style={styles.skeletonTextSmall} />
          </View>
        </View>

        {/* Fourth Pair */}
        <View style={styles.skeletonContainer}>
          <View style={styles.skeletonCard}>
            <View style={styles.skeletonImage} />
            <View style={styles.skeletonText} />
            <View style={styles.skeletonTextSmall} />
          </View>
          <View style={styles.skeletonCard}>
            <View style={styles.skeletonImage} />
            <View style={styles.skeletonText} />
            <View style={styles.skeletonTextSmall} />
          </View>
        </View>
      </SkeletonPlaceholder>
    );
  };

  // Filter products based on search query and filter options
  const debouncedSearch = useMemo(
    () =>
      debounce(query => {
        let filteredProducts = {};
  
        // Check if originalProducts is an object with categories
        if (typeof originalProducts === 'object' && originalProducts !== null) {
          // Loop through each category
          for (const [category, products] of Object.entries(originalProducts)) {
            // Check if products is an array before applying filter
            if (Array.isArray(products)) {
              let categoryFilteredProducts = products.filter(product =>
                product.searchName.toLowerCase().includes(query.toLowerCase())
              );
  
              // Apply Category Filter
              if (filterOptions.category) {
                categoryFilteredProducts = categoryFilteredProducts.filter(
                  product => product.mainId === filterOptions.category
                );
              }
  
              // Apply Brand Filter
              if (filterOptions.brand) {
                categoryFilteredProducts = categoryFilteredProducts.filter(
                  product => product.brand === filterOptions.brand
                );
              }
  
              // Apply Discount Filter
              if (filterOptions.discount) {
                categoryFilteredProducts = categoryFilteredProducts.filter(product => {
                  switch (filterOptions.discount) {
                    case '10_above':
                      return product.additionalDiscount >= 10;
                    case '20_above':
                      return product.additionalDiscount >= 20;
                    case '30_above':
                      return product.additionalDiscount >= 30;
                    case '40_above':
                      return product.additionalDiscount >= 40;
                    case '50_above':
                      return product.additionalDiscount >= 50;
                    case '60_above':
                      return product.additionalDiscount >= 60;
                    case '70_above':
                      return product.additionalDiscount >= 70;
                    case '80_above':
                      return product.additionalDiscount >= 80;
                    case '90_above':
                      return product.additionalDiscount >= 90;
                    default:
                      return true;
                  }
                });
              }
  
              // Apply Price Filter
              if (filterOptions.minPrice || filterOptions.maxPrice) {
                categoryFilteredProducts = categoryFilteredProducts.filter(product => {
                  const price = parseFloat(product.price);
                  return (
                    price >= filterOptions.minPrice && price <= filterOptions.maxPrice
                  );
                });
              }
  
              // Exclude Out of Stock products
              if (filterOptions.excludeOutOfStock) {
                categoryFilteredProducts = categoryFilteredProducts.filter(
                  product => !product.outOfStock
                );
              }
  
              // If the filtered products exist, add them to the filteredProducts object
              if (categoryFilteredProducts.length > 0) {
                filteredProducts[category] = categoryFilteredProducts;
              }
            }
          }
        }
  
        // If query is present, update with filtered results, else revert to originalProducts
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
      let sortedProducts = [];
  
      // Ensure searchResults is an array before spreading
      if (Array.isArray(searchResults)) {
        sortedProducts = [...searchResults]; // Spread only if it's an array
  
        if (sortValue === 'low_to_high') {
          sortedProducts.sort(
            (a, b) => parseFloat(a.price) - parseFloat(b.price)
          );
        } else if (sortValue === 'high_to_low') {
          sortedProducts.sort(
            (a, b) => parseFloat(b.price) - parseFloat(a.price)
          );
        }
      }
  
      setSortedResults(sortedProducts);
    };
  
    sortProducts();
  }, [sortValue, searchResults]);
  

  // Apply filter options
  const applyFilters = filters => {
    setFilterOptions(filters);
    setFilterVisible(false);
  };

  const loadMoreCategories = () => {
    if (visibleCategories < Object.keys(sortedResults).length) {
      setLoadingMore(true);
      setTimeout(() => {
        setVisibleCategories(prevCount => prevCount + 2); 
        setLoadingMore(false);
      }, 1000); 
    }
  };

  const MemoizedProductComponent = React.memo(({ product }) => (
    <ProductComponent2 product={product} lowestPrice={product.lowestPrice} cartVisible={true} />
  ));

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
            onPress={() => setFilterVisible(true)}
          >
            <Text style={styles.buttonText}>Filter</Text>
            <Icon name="chevron-down" size={16} color="#484848" />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <SkeletonLoader />
      ) : (
        <ScrollView>
          {Object.keys(sortedResults)
            .slice(0, visibleCategories)
            .map((category, index) => (
              <View key={`${category}-${index}`}>
                <Text style={styles.categoryTitle}>{category}</Text>
                <FlatList
                  data={sortedResults[category]}
                  keyExtractor={(item) => item.productId}
                  numColumns={2}
                  renderItem={({ item }) => (
                    <View style={styles.productContainer}>
                      <MemoizedProductComponent product={item} />
                    </View>
                  )}
                />
              </View>
          ))}

          {loadingMore && (
            <View style={styles.loadingIndicator}>
              <ActivityIndicator size="large" color="#FFB800" />
            </View>
          )}

          <TouchableOpacity onPress={loadMoreCategories}>
            {visibleCategories < Object.keys(sortedResults).length && (
              <Text style={styles.loadMoreText}>Load more Products</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      )}

      <Modal
        visible={filterVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFilterVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FilterComponent
              filters={filterOptions}
              onApply={applyFilters}
              onCancel={() => setFilterVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};




const styles = StyleSheet.create({
 container2: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 10, // Equal margin on left and right of the screen
    paddingVertical: 16,   // Equal margin on top and bottom
    backgroundColor: '#FFFFFF',
  },
  categoryTitle: {
    fontSize: 18,
    fontFamily: 'Outfit-Bold',
    color: '#333333',
    marginBottom: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECECEC',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  productContainer: {
    width: '48%', // Ensures two cards per row with proper spacing
    margin: '1%', // Equal margin around each product card for consistent spacing
    backgroundColor: '#fff',

    overflow: 'hidden',

  },
  flatList: {
    flex: 1,
    marginHorizontal: 0, // Ensures no extra horizontal margin
  },
  productList: {
    flexGrow: 1,
    paddingHorizontal: 4, // Consistent padding between products
  },
  skeletonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  skeletonCard: {
    width: '48%',
    borderRadius: 8,
  },
  skeletonImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  skeletonText: {
    width: '80%',
    height: 20,
    borderRadius: 4,
    marginTop: 10,
  },
  skeletonTextSmall: {
    width: '60%',
    height: 15,
    borderRadius: 4,
    marginTop: 6,
  },

  loadMoreText: {
    color:colors.main,
    fontFamily: 'Outfit-Medium',
    fontSize: 15,
    textAlign: 'center',
    textDecorationLine: 'underline', // Add underline
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
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonWrapper: {
    marginRight: 15,
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
export default GroupedProductScreen;
