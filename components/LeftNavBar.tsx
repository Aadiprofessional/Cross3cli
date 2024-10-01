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
        categoriesCache = null;
        console.log('Cleared cache on app close');
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

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
      categoriesCache = response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const navigateToSubCategory = (categoryName: string) => {
    console.log(categoryName);
    
    navigation.navigate('SubCategoryScreen', { categoryName });
    toggleNavBar();
  };

  const handleAllCategoriesPress = () => {
    navigation.navigate('AllCategoriesScreen');
    toggleNavBar();
  };

  const renderCategoryItem = (category: { name: string }) => (
    <TouchableOpacity
      key={category.name}
      style={styles.navItem}
      onPress={() => navigateToSubCategory(category.name)}>
      <Text style={styles.navText}>{category.name}</Text>
      <Icon name="chevron-forward" size={24} color={colors.second} />
    </TouchableOpacity>
  );

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
            style={styles.subcategoryItem}
            onPress={handleAllCategoriesPress}>
            <Text style={styles.subcategoryText}>All Categories</Text>
            <Icon name="chevron-forward" size={24} color={colors.second} />
          </TouchableOpacity>
        </>
      ) : (
        <Text>No categories available</Text>
      )}
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
    flexWrap: 'wrap',
  },
  navText: {
    fontSize: 20,
    fontFamily: 'Outfit-Regular',
    marginLeft: 10,
    marginRight: 'auto',
    color: colors.TextBlack,
    maxWidth: '70%',
  },
  subcategoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  subcategoryText: {
    fontSize: 18,
    fontFamily: 'Outfit-Regular',
    color: colors.TextBlack,
    maxWidth: '70%',
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
    marginTop: 'auto',
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
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    color: colors.second,
    marginLeft: 10,
  },
});

export default LeftNavBar;
