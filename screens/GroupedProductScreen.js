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

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { ScrollView } from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import { colors } from '../styles/color';
import ProductComponent2 from '../components/ProductComponent copy';

const GroupedProductScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [originalProducts, setOriginalProducts] = useState({});
  const [searchResults, setSearchResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [visibleCategories, setVisibleCategories] = useState(2); 
  const [loadingMore, setLoadingMore] = useState(false);

  const userUid = auth().currentUser?.uid;

  const loadProducts = async () => {
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
  };

  useEffect(() => {
    loadProducts();
  }, []);

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

  const loadMoreCategories = () => {
    if (visibleCategories < Object.keys(searchResults).length) {
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
      {/* <View style={styles.searchBox}>
        <Icon name="search" size={20} color="#484848" style={styles.icon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search your products"
          placeholderTextColor="#484848"
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />
      </View> */}

      {loading ? (
        <SkeletonLoader />
      ) : (
        <ScrollView>
          {Object.keys(searchResults)
            .slice(0, visibleCategories)
            .map((category, index) => (
              <View key={`${category}-${index}`}>
                <Text style={styles.categoryTitle}>{category}</Text>
                <FlatList
                  data={searchResults[category]}
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
            {visibleCategories < Object.keys(searchResults).length && (
              <Text style={styles.loadMoreText}>Load more Products</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      )}

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
