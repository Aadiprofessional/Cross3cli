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
import { fetchProducts as fetchProductsFromApi } from '../services/apiService'; // Assuming this is the correct import
import ProductComponent from '../components/ProductComponent';
import FilterComponent from '../components/FilterDropdown';
import { debounce } from 'lodash';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth'; // Ensure Firebase auth is imported
import axios from 'axios'; // Ensure axios is imported
import CustomHeader2 from '../components/CustomHeader2';


const SubCategoryScreen = ({ route }) => {
  const { mainId, categoryId } = route.params || {};
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
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
  const [isWished, setIsWished] = useState(false);


  // Fetch products with proper error handling and authentication check
  const fetchProducts = useCallback(async () => {
    const userId = auth().currentUser?.uid;
    if (!userId) {
      console.error('User is not authenticated');
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post(
        `https://crossbee-server-1036279390366.asia-south1.run.app/products?uid=${userId}`,
        {
          main: mainId,
          category: categoryId,
        }
      );
      console.log('Fetched products:', response.data);
      setProducts(response.data);
      setOriginalProducts(response.data); // Set original products to be used for filtering
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products: ', error);
      setLoading(false);
    }
  }, [mainId, categoryId]);

  useEffect(() => {
    if (mainId && categoryId) {
      fetchProducts();
    }
  }, [mainId, categoryId, fetchProducts]);


  const handlePress = (product) => {
    if (!product) return;
    console.log(
      `Navigating to ProductDetailPage with productId: ${product.productId}`,
    );
    navigation.navigate('ProductDetailPage', {
      mainId: product.mainId,
      categoryId: product.categoryId,
      productId: product.productId,
    });
  };



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
        if (filterOptions.minPrice || filterOptions.maxPrice) {
          filteredProducts = filteredProducts.filter(product => {
            const price = parseFloat(product.price);

            // Ensure both minPrice and maxPrice are valid numbers for comparison
            const min = filterOptions.minPrice ? parseFloat(filterOptions.minPrice) : 0;
            const max = filterOptions.maxPrice ? parseFloat(filterOptions.maxPrice) : Infinity;

            // Filter products within the price range
            return price >= min && price <= max;
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
    <View style={styles.container2}>
      <CustomHeader2 title={categoryId} />
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
    </View>
  );
};

const styles = StyleSheet.create({
 
  container2: {
    flex: 1,
    // Adds equal padding from left and right
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16, // Equal margin on left and right of the screen
    paddingVertical: 16,   // Equal margin on top and bottom
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
  productList: {
    flexGrow: 1,
    paddingHorizontal: 4, // Consistent horizontal padding for the FlatList
  },
  flatList: {
    flex: 1,
    marginHorizontal: 0, // Ensures that the FlatList has no extra horizontal margin
  },
  productCard: {
    flex: 1,
    margin: 8, // Ensures equal margin around each product card
    borderWidth: 1,
    borderColor: '#eaeaea',
    borderRadius: 10,
    overflow: 'hidden',
  },
  productContainer: {
    width: '48%', // Allows two cards per row with even spacing
    margin: 8, // Adds equal spacing between product cards
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
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

export default SubCategoryScreen;
