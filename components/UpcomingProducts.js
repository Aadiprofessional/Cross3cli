import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../styles/color';
import ProductComponent from './ProductComponent';
import auth from '@react-native-firebase/auth';

const UpcomingProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const userId = auth().currentUser?.uid;
      if (!userId) {
        console.error('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`https://crossbee-server-1036279390366.asia-south1.run.app/upcomingProducts?uid=${userId}`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color= "#FFB800" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upcoming Products</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.productList}>
          {products.map((product, index) => (
            <ProductComponent key={index} product={product} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,

    fontFamily: 'Outfit-Medium',
  
    color: colors.TextBlack,
  },
  scrollContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default UpcomingProducts;
