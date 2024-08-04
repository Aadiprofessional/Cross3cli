import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, AppState, AppStateStatus } from 'react-native';
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
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Clean up subscription on unmount
    return () => {
      subscription.remove();
    };
  }, []);

  const fetchAndCacheData = async () => {
    try {
      const response = await axios.get('https://crossbee-server.vercel.app/drawer');
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

  const renderSubCategoryItem = (companies: any[], mainId: string) => (
    <View style={styles.subcategoryContainer}>
      {companies.map(({ id, name }) => (
        <TouchableOpacity
          key={id}
          style={styles.subcategoryItem}
          onPress={() => navigateToSubCategory(mainId, id)}
        >
          <Text style={styles.subcategoryText}>{name}</Text>
          <Icon name="chevron-forward" size={24} color={colors.second} />
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderCategoryItem = ({
    id,
    name,
    companies,
  }: {
    id: string;
    name: string;
    companies?: any[];
  }) => {
    const isExpanded = expandedCategory === id;

    return (
      <View key={id}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => toggleCategory(id)}
        >
          <Text style={styles.navText}>{name}</Text>
          {companies && (
            <Icon
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={24}
              color={colors.second}
            />
          )}
        </TouchableOpacity>
        {isExpanded && companies && renderSubCategoryItem(companies, id)}
      </View>
    );
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
        categories.map(category => renderCategoryItem(category))
      ) : (
        <Text>No categories available</Text>
      )}
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
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  navText: {
    fontSize: 20,
    fontWeight: '400',
    marginLeft: 10,
    marginRight: 'auto',
    color: colors.TextBlack,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    marginRight: 10,
  },
  subcategoryContainer: {
    marginTop: 5,
    paddingLeft: 20,
  },
  subcategoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  subcategoryText: {
    fontSize: 18,
    fontWeight: '400',
    color: colors.TextBlack,
  },
  categoriesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  categoriesHeaderText: {
    fontSize: 32,
    fontWeight: '500',
    color: colors.main,
  },
  backIcon: {
    marginRight: 2,
  },
});

export default LeftNavBar;
