import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  AppState,
  AppStateStatus,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { colors } from '../styles/color';

interface LeftNavBarProps {
  toggleNavBar: () => void;
}

// In-memory cache to store categories data for the session
let categoriesCache: any[] | null = null;

const LeftNavBar: React.FC<LeftNavBarProps> = ({ toggleNavBar }) => {
  const navigation = useNavigation();
  const [categories, setCategories] = useState<any[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (categoriesCache) {
          setCategories(categoriesCache);
          console.log('Loaded data from cache');
        } else {
          await fetchAndCacheData();
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        // Clear the cached data when the app is closed or sent to the background
        categoriesCache = null;
        console.log('Cleared cache on app close');
      }
    };

    // Subscribe to app state changes
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    // Clean up subscription on unmount
    return () => {
      subscription.remove();
    };
  }, []);

  const fetchAndCacheData = async () => {
    try {
      const response = await axios.get(
        'https://crossbee-server-1036279390366.asia-south1.run.app/drawer',
      );
      console.log('Fetched data:', response.data);
      setCategories(response.data);
      categoriesCache = response.data; // Store in cache
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const toggleCategory = (categoryName: string) => {
    setExpandedCategory(prev => (prev === categoryName ? null : categoryName));
  };

  const navigateToSubCategory = (mainId: string, categoryId: string) => {
    navigation.navigate('SubCategoryScreen', { mainId, categoryId });
    toggleNavBar();
  };

  const handleAllCategoriesPress = () => {
    navigation.navigate('AllCategoriesScreen'); // Replace with your actual screen name
    toggleNavBar();
  };

  const renderSubCategoryItem = (companies: any[], mainId: string) => (
    <View style={styles.subcategoryContainer}>
      {companies.map(({ id, name }) => (
        <TouchableOpacity
          key={id}
          style={styles.subcategoryItem}
          onPress={() => navigateToSubCategory(mainId, id)}>
          <Text style={styles.subcategoryText}>{name}</Text>
          <Icon name="chevron-forward" size={24} color={colors.second} />
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderCategoryItem = (category: { id: string; name: string; companies?: any[] }) => {
    const isExpanded = expandedCategory === category.id;

    return (
      <View key={category.id}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => toggleCategory(category.id)}>
          <Text style={styles.navText}>{category.name}</Text>
          {category.companies && (
            <Icon
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={24}
              color={colors.second}
            />
          )}
        </TouchableOpacity>
        {isExpanded && category.companies && renderSubCategoryItem(category.companies, category.id)}
      </View>
    );
  };

  const handleCallPress = () => {
    const phoneNumber = '9924686611';
    Linking.openURL(`tel:${phoneNumber}`);
  };

  return (
    <View style={styles.navContainer}>
      <View style={styles.categoriesHeader}>
        <Text style={styles.categoriesHeaderText}>Categories</Text>
        <TouchableOpacity onPress={toggleNavBar}>
          <Icon
            name="close"
            size={32}
            color={colors.inputPlaceholder}
            style={styles.backIcon}
          />
        </TouchableOpacity>
      </View>
      {Array.isArray(categories) && categories.length > 0 ? (
        <>
          {categories.map(category => renderCategoryItem(category))}
          <TouchableOpacity
            style={styles.subcategoryItem} // Use subcategoryItem style for consistency
            onPress={handleAllCategoriesPress}>
            <Text style={styles.subcategoryText}>All Categories</Text>
            <Icon name="chevron-forward" size={24} color={colors.second} />
          </TouchableOpacity>
        </>
      ) : (
        <Text>No categories available</Text>
      )}
      {/* Footer with phone icon */}
      <View style={styles.footerContainer}>
        <TouchableOpacity style={styles.footerButton} onPress={handleCallPress}>
          <Icon name="call" size={32} color={colors.main} />
          <Text style={styles.footerText}>Customer Support</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexWrap: 'wrap', // Allow wrapping for long texts
  },
  navText: {
    fontSize: 20,
    fontFamily: 'Outfit-Regular',
    marginLeft: 10,
    marginRight: 'auto',
    color: colors.TextBlack,
    maxWidth: '70%', // Adjust width to allow wrapping
  },
  subcategoryContainer: {
    marginTop: 5,
    paddingLeft: 20,
  },
  subcategoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    flexWrap: 'wrap', // Allow wrapping for long texts
  },
  subcategoryText: {
    fontSize: 18,
    fontFamily: 'Outfit-Regular',
    color: colors.TextBlack,
    maxWidth: '70%', // Adjust width to allow wrapping
  },
  categoriesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  categoriesHeaderText: {
    fontSize: 32,
    fontFamily: 'Outfit-Medium',
    color: colors.main,
  },
  backIcon: {
    marginRight: 2,
  },
  footerContainer: {
    marginTop: 'auto', // Pushes the footer to the bottom
    alignItems: 'center',
    paddingVertical: 10,
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  footerText: {
    fontSize: 16, // Adjust font size as needed
    fontFamily: 'Outfit-Regular',
    color: colors.second,
    marginLeft: 10, // Adjust spacing between text and icon
  },
});

export default LeftNavBar;
