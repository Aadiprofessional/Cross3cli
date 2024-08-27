import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {colors} from '../styles/color';

const AllCategoriesScreen = () => {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(
        'https://crossbee-server.vercel.app/categories',
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

  const navigateToSubCategory = useCallback(
    (mainId: String, categoryId: String) => {
      navigation.navigate('SubCategoryScreen', {mainId, categoryId});
    },
    [navigation],
  );

  // Optimize category list rendering
  const categoryItems = useMemo(
    () =>
      categories.map(({id, name, mainImage}) => (
        <TouchableOpacity
          key={id}
          style={styles.categoryItem}
          onPress={() => navigateToSubCategory(id, id)}>
          <View style={styles.categoryImageContainer}>
            <Image source={{uri: mainImage}} style={styles.categoryImage} />
          </View>
          <Text style={styles.categoryName}>{name}</Text>
        </TouchableOpacity>
      )),
    [categories, navigateToSubCategory],
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
    alignItems: 'center',
  },
  categoryItem: {
    width: '30%',
    marginBottom: 20,
    marginLeft: '3.33%', // Add some right margin for spacing
  },
  categoryImageContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    overflow: 'hidden',
    aspectRatio: 1,
    marginTop: 10,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  categoryName: {
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    textAlign: 'center',
    color: colors.TextBlack,
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
