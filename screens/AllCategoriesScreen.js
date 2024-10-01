import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { colors } from '../styles/color';

const AllCategoriesScreen = () => {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(
        'https://crossbee-server-1036279390366.asia-south1.run.app/getMain',
      );
      console.log('Fetched categories:', response.data); // Log the fetched data
      setCategories(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories: ', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const navigateToSubCategory2 = useCallback(
    name => {
      navigation.navigate('SubCategoryScreen', { name }); // Navigate to SubCategoryScreen2 with `name`
    },
    [navigation],
  );

  // Optimize category list rendering
  const categoryItems = useMemo(
    () =>
      categories.map(({ id, name, image }) => (
        <TouchableOpacity
          key={id}
          style={styles.categoryItem}
          onPress={() => navigateToSubCategory2(name)} // Navigate to SubCategoryScreen2
        >
          <View style={styles.categoryImageContainer}>
            <Image source={{ uri: image }} style={styles.categoryImage} />
          </View>
          <Text style={styles.categoryName}>{name}</Text>
        </TouchableOpacity>
      )),
    [categories, navigateToSubCategory2],
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {categoryItems.length > 0 ? (
            categoryItems
          ) : (
            <View style={styles.noCategoriesContainer}>
              <Text style={styles.noCategoriesText}>No categories found</Text>
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
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
  },
  scrollViewContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingVertical: 10,
  },
  categoryItem: {
    width: '30%',
    marginBottom: 20,
    marginHorizontal: '1.66%', // Margin to ensure spacing between items
    alignItems: 'center', // Center align items in each category
  },
  categoryImageContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    overflow: 'hidden',
    aspectRatio: 1, // Maintain a square aspect ratio
    width: '100%',
    height: 100, // Fixed height for consistency
    marginBottom: 5,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  categoryName: {
    fontSize: 14,
    fontFamily: 'Outfit-Medium',
    textAlign: 'center',
    color: colors.TextBlack,
    flexWrap: 'wrap',
    textAlign: 'center', // Center-align text
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    fontFamily: 'Outfit-Medium',
    color: colors.TextBlack,
  },
  noCategoriesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noCategoriesText: {
    fontSize: 18,
    fontFamily: 'Outfit-Medium',
    color: colors.TextBlack,
  },
});

export default AllCategoriesScreen;
