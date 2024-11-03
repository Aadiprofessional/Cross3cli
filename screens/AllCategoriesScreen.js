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
  const [loadedImages, setLoadedImages] = useState({});

  // Fetch categories from API or cache
  const fetchCategories = useCallback(async () => {
    try {
      const cachedCategories = await AsyncStorage.getItem('categories');
      if (cachedCategories) {
        setCategories(JSON.parse(cachedCategories));
      }
      const response = await axios.get(
        'https://crossbee-server-1036279390366.asia-south1.run.app/getMain'
      );
      const fetchedCategories = response.data;
      await AsyncStorage.setItem('categories', JSON.stringify(fetchedCategories));
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Error fetching categories: ', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const navigateToSubCategory2 = useCallback(
    (name, id) => {
      const trimmedName = name.trim();
      navigation.navigate('SubCategoryScreen', { name: trimmedName, id });
    },
    [navigation]
  );

  // Preload images to avoid lagging
  useEffect(() => {
    const preloadImages = async () => {
      const promises = categories.map(async ({ id, image }) => {
        const imageUrl = image && !image.includes('undefined')
          ? image
          : 'https://firebasestorage.googleapis.com/v0/b/crossbee.appspot.com/o/no.png?alt=media&token=a464f751-0dc1-4759-945e-96ac1a5f3656';
        return Image.prefetch(imageUrl).then(() => {
          setLoadedImages((prev) => ({ ...prev, [id]: true }));
        });
      });
      await Promise.all(promises);
    };
    if (!loading) preloadImages();
  }, [categories, loading]);

  const categoryItems = useMemo(
    () =>
      categories.map(({ id, name, image }) => {
        const imageUrl = image && !image.includes('undefined')
          ? image
          : 'https://firebasestorage.googleapis.com/v0/b/crossbee.appspot.com/o/no.png?alt=media&token=a464f751-0dc1-4759-945e-96ac1a5f3656';
        return (
          <TouchableOpacity
            key={id}
            style={styles.categoryItem}
            onPress={() => navigateToSubCategory2(name, id)}
          >
            <View style={styles.categoryImageContainer}>
              {loadedImages[id] ? (
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.categoryImage}
                />
              ) : (
                <SkeletonPlaceholder>
                  <View style={styles.skeletonImage} />
                </SkeletonPlaceholder>
              )}
            </View>
            <Text style={styles.categoryName}>{name}</Text>
          </TouchableOpacity>
        );
      }),
    [categories, navigateToSubCategory2, loadedImages]
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
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
          showsVerticalScrollIndicator={false}
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
