import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { colors } from '../styles/color';

const AllCategoriesScreen = () => {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories from API or cache
  const fetchCategories = useCallback(async () => {
    try {
      const cachedCategories = await AsyncStorage.getItem('categories');
      if (cachedCategories) {
        setCategories(JSON.parse(cachedCategories));
        setLoading(false);
      }

      const response = await axios.get(
        'https://crossbee-server-1036279390366.asia-south1.run.app/getHomeMain'
      );
      const fetchedCategories = response.data;
      await AsyncStorage.setItem('categories', JSON.stringify(fetchedCategories));

      setCategories(fetchedCategories);
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
    (name) => {
      const trimmedName = name.trim(); // Remove leading and trailing spaces
      navigation.navigate('SubCategoryScreen', { name: trimmedName });
    },
    [navigation]
  );
  
  // Optimize category list rendering
  const categoryItems = useMemo(
    () =>
      categories.map(({ id, name, image }) => (
        <TouchableOpacity
          key={id}
          style={styles.categoryItem}
          onPress={() => navigateToSubCategory2(name)}
        >
          <View style={styles.categoryImageContainer}>
            <Image source={{ uri: image }} style={styles.categoryImage} />
          </View>
          <Text style={styles.categoryName}>{name}</Text>
        </TouchableOpacity>
      )),
    [categories, navigateToSubCategory2]
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false} // Remove scroll line
        >
          {Array(6)
            .fill('')
            .map((_, index) => (
              <View key={index} style={styles.skeletonContainer}>
                <SkeletonPlaceholder>
                  <View style={styles.skeletonImage} />
                  <View style={styles.skeletonText} />
                </SkeletonPlaceholder>
              </View>
            ))}
        </ScrollView>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false} // Remove scroll line
        >
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
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  categoryItem: {
    width: '30%',
    marginBottom: 20,
    alignItems: 'center',
  },
  categoryImageContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    overflow: 'hidden',
    aspectRatio: 1,
    width: '100%',
    height: 100,
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
  },
  skeletonContainer: {
    width: '30%',
    marginBottom: 20,
    alignItems: 'center',
  },
  skeletonImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
  },
  skeletonText: {
    width: '60%',
    height: 20,
    marginTop: 10,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
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
