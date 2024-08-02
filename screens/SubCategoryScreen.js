import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { colors } from '../styles/color';

const SubCategoryScreen = ({ route }) => {
  const { mainId, categoryId } = route.params || {};
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsSnapshot = await firestore()
          .collection('Main')
          .doc(mainId)
          .collection('Category')
          .doc(categoryId)
          .collection('Products')
          .get();

        const productsData = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
    };

    fetchProducts();
  }, [mainId, categoryId]);

  const navigateToProductDetail = (productId: string) => {
    navigation.navigate('ProductDetailPage', { mainId, categoryId, productId });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {products.map((product) => (
          <TouchableOpacity
            key={product.id}
            style={styles.productItem}
            onPress={() => navigateToProductDetail(product.id)}
          >
            <View style={styles.productImageContainer}>
              <Image source={{ uri: product.mainImage }} style={styles.productImage} />
            </View>
            <Text style={styles.productName}>{product.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    
  },
  scrollViewContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
     // Align items to the left
     alignItems: 'center',
  },
  productItem: {
    width: '30%',
    marginBottom: 20,
    marginLeft: '3.33%', // Add some right margin for spacing
  },
  productImageContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    overflow: 'hidden',
    aspectRatio: 1,
    marginTop: 10,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  productName: {
    fontSize: 16,
    textAlign: 'center',
    color: colors.TextBlack,
  },
});

export default SubCategoryScreen;
