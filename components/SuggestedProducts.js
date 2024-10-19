import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, ToastAndroid } from 'react-native';
import { colors } from '../styles/color';
import ProductComponent from './ProductComponent';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'; // Assuming this library is installed
import auth from '@react-native-firebase/auth';

const { width } = Dimensions.get('window'); // Get screen width

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
    </SkeletonPlaceholder>
  );
};

// Memoized ProductComponent to optimize re-renders
const MemoizedProductComponent = React.memo(({ product }) => (
  <ProductComponent product={product} />
));

const SuggestedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Track error state

  useEffect(() => {
    const fetchProducts = async () => {
      const userId = auth().currentUser?.uid;
      if (!userId) {
        console.error('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`https://crossbee-server-1036279390366.asia-south1.run.app/suggestedProducts?uid=${userId}`);
        const data = await response.json();
        
        // Check if data is an array before setting it
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          throw new Error('Invalid data format received');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again later.');
        // Show a toast notification to the user
        ToastAndroid.show('Error loading products', ToastAndroid.SHORT);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Suggested Products</Text>
      {error ? (
        <Text style={styles.errorText}>{error}</Text> // Display error message
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {loading ? (
            <SkeletonLoader />
          ) : (
            <View style={styles.productRow}>
              {products.length > 0 ? (
                products.map((product, index) => (
                  <View key={index} style={styles.productContainer}>
                    <MemoizedProductComponent product={product} />
                  </View>
                ))
              ) : (
                <Text style={styles.noProductsText}>No products found</Text> // Show message if no products
              )}
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
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Outfit-Medium',
    color: colors.TextBlack,
  },
  scrollContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Ensures alignment
  },
  productRow: {
    flexDirection: 'row',
  },
  productContainer: {
    width: width * 0.48, // 48% of the screen width
    marginLeft: 5,
    justifyContent: 'space-between',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginTop: 10,
  },
  noProductsText: {
    fontSize: 16,
    color: colors.TextBlack,
    textAlign: 'center',
    marginTop: 20,
  },
  // Skeleton styles
  skeletonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skeletonCard: {
    width: width * 0.48, // Ensure it matches productContainer width
    height: 250,
    marginRight: 10,
    marginBottom: 20,
  },
  skeletonImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  skeletonText: {
    width: '80%',
    height: 20,
    borderRadius: 4,
    marginTop: 10,
  },
  skeletonTextSmall: {
    width: '50%',
    height: 15,
    borderRadius: 4,
    marginTop: 5,
  },
});

export default SuggestedProducts;
