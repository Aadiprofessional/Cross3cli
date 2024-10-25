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
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import DropDownPicker from 'react-native-dropdown-picker';
import { fetchProducts } from '../services/apiService';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { ScrollView } from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import { colors } from '../styles/color';
import ProductComponent2 from '../components/ProductComponent copy';

const CACHE_KEY = 'PRODUCT_CACHE'; // Cache key for storing products

const GroupedProductScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [originalProducts, setOriginalProducts] = useState({});
  const [searchResults, setSearchResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [visibleCategories, setVisibleCategories] = useState(2);
  const [loadingMore, setLoadingMore] = useState(false);

  const userUid = auth().currentUser?.uid;

  // Save data to cache
  const cacheProducts = async (products) => {
    try {
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(products));
    } catch (error) {
      console.error('Error caching products:', error);
    }
  };

  // Load cached data
  const loadCachedProducts = async () => {
    try {
      const cachedProducts = await AsyncStorage.getItem(CACHE_KEY);
      if (cachedProducts) {
        const parsedProducts = JSON.parse(cachedProducts);
        setOriginalProducts(parsedProducts);
        setSearchResults(parsedProducts);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error loading cached products:', error);
    }
  };

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
      cacheProducts(groupedProducts); // Cache the fetched data
      setLoading(false);
    } catch (error) {
      console.error('Error loading products:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCachedProducts(); // Load cached products on mount
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
      {loading ? (
        <SkeletonLoader />
      ) : (
        <FlatList
          data={Object.keys(searchResults).slice(0, visibleCategories)}
          keyExtractor={(item, index) => `${item}-${index}`}
          renderItem={({ item: category }) => (
            <View>
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
          )}
          ListFooterComponent={() => (
            <TouchableOpacity onPress={loadMoreCategories}>
              {visibleCategories < Object.keys(searchResults).length && (
                <Text style={styles.loadMoreText}>Load more Products</Text>
              )}
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  categoryTitle: {
    fontSize: 18,
    fontFamily: 'Outfit-Bold',
    color: '#333333',
    marginBottom: 10,
  },
  productContainer: {
    width: '48%',
    margin: '1%',
    backgroundColor: '#fff',
    overflow: 'hidden',
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
    color: colors.main,
    fontFamily: 'Outfit-Medium',
    fontSize: 15,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default GroupedProductScreen;
