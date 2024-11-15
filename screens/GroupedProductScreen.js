import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import ProductComponent2 from '../components/ProductComponent copy';
import { colors } from '../styles/color';

const CACHE_KEY = 'PRODUCT_CACHE';

const GroupedProductScreen = () => {
  const [searchResults, setSearchResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [visibleCategories, setVisibleCategories] = useState(2);

  const userUid = auth().currentUser?.uid;

  const cacheProducts = async (products) => {
    try {
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(products));
    } catch (error) {
      console.error('Error caching products:', error);
    }
  };

  const loadCachedProducts = async () => {
    try {
      const cachedProducts = await AsyncStorage.getItem(CACHE_KEY);
      if (cachedProducts) {
        const parsedProducts = JSON.parse(cachedProducts);
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
      const productsData = await response.json();
      const groupedProducts = {};

      for (const [category, products] of Object.entries(productsData)) {
        if (Array.isArray(products)) {
          groupedProducts[category] = products;
        }
      }

      setSearchResults(groupedProducts);
      cacheProducts(groupedProducts);
      setLoading(false);
    } catch (error) {
      console.error('Error loading products:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCachedProducts();
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


  const loadMoreCategories = useMemo(() => {
    return () => {
      if (visibleCategories < Object.keys(searchResults).length) {
        setVisibleCategories((prevCount) => prevCount + 2);
      }
    };
  }, [visibleCategories, searchResults]);

  const MemoizedProductComponent = React.memo(({ product }) => (
    <ProductComponent2 product={product} cartVisible={true} />
  ));

  return (
    <View style={styles.container}>
      {loading ? (
        <SkeletonLoader />
      ) : (
        <FlatList
          data={Object.keys(searchResults).slice(0, visibleCategories)}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => `${item}-${index}`}
          renderItem={({ item: category }) => (
            <View>
              <Text style={styles.categoryTitle}>{category}</Text>
              <View style={styles.productList}>
                {searchResults[category].map((item) => (
                  <View style={styles.productContainer} key={item.productId}>
                    <MemoizedProductComponent product={item} />
                  </View>
                ))}
              </View>
            </View>
          )}
          ListFooterComponent={() => (
            visibleCategories < Object.keys(searchResults).length && (
              <TouchableOpacity onPress={loadMoreCategories}>
                <Text style={styles.loadMoreText}>Load more Products</Text>
              </TouchableOpacity>
            )
          )}
          windowSize={5}
          initialNumToRender={3}
          maxToRenderPerBatch={5}
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
    color: colors.main,
    marginBottom: 10,
    textDecorationLine: 'underline',
  },
  productList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
