import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import Icon from 'react-native-vector-icons/Ionicons'; // Import Ionicons for icons
import { colors } from '../styles/color'; // Import color styles
import SubCategoryScreen from '../screens/SubCategoryScreen';

interface LeftNavBarProps {
  toggleNavBar: () => void; // Function to toggle the left navbar
}

const LeftNavBar: React.FC<LeftNavBarProps> = ({ toggleNavBar }) => {
  const navigation = useNavigation();

  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const categories = [
    { 
      name: 'Electronics', 
      icon: require('../assets/product.png'), // Use require for local images
      subcategories: ['Laptops', 'Mobile Phones', 'Tablets', 'Headphones', 'Smartwatches'] 
    },
    { 
      name: 'Clothing', 
      icon: require('../assets/product.png'), // Example, replace with actual image
      subcategories: ['Men', 'Women', 'Kids'] 
    },
    { 
      name: 'Kids', 
      icon: require('../assets/product.png'), // Example, replace with actual image
      subcategories: ['Boys', 'Girls'] 
    },
    { 
      name: 'Toys', 
      icon: require('../assets/product.png'), // Example, replace with actual image
      subcategories: ['Action Figures', 'Dolls', 'Board Games'] 
    },
    { 
      name: 'Books', 
      icon: require('../assets/product.png'), // Example, replace with actual image
      subcategories: ['Fiction', 'Non-Fiction', 'Children'] 
    },
  ];

  const toggleCategory = (categoryName: string) => {
    if (expandedCategory === categoryName) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryName);
    }
  };

  const navigateToScreen = (screenName: string) => {
    navigation.navigate(screenName);
    toggleNavBar(); // Close the navbar after navigation
  };

  const navigateToSubCategory = (subcategory: string) => {
    navigation.navigate('SubCategoryScreen', { subcategory });
    toggleNavBar(); // Close the navbar after navigation
  };

  const renderCategoryItem = ({ name, icon, screen, subcategories }: { name: string; icon: any; screen?: string; subcategories?: string[] }) => {
    const isExpanded = expandedCategory === name;

    return (
      <View key={name}>
        <TouchableOpacity style={styles.navItem} onPress={() => {
          if (subcategories) {
            toggleCategory(name);
          } else if (screen) {
            navigateToScreen(screen);
          }
        }}>
          <Image source={icon} style={styles.categoryIcon} />
          <Text style={styles.navText}>{name}</Text>
          {subcategories && (
            <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} size={24} color={colors.second} />
          )}
        </TouchableOpacity>

        {isExpanded && subcategories && (
          <View style={styles.subcategoryContainer}>
            {subcategories.map((subcategory) => (
              <TouchableOpacity key={subcategory} style={styles.subcategoryItem} onPress={() => navigateToSubCategory(subcategory)}>
                <Text style={styles.subcategoryText}>{subcategory}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.navContainer}>
      {/* Categories text with arrow */}
      <View style={styles.categoriesHeader}>
        <Text style={styles.categoriesHeaderText}>Categories</Text>
        <TouchableOpacity onPress={toggleNavBar}>
          <Icon name="chevron-left" size={24} color={colors.main} />
        </TouchableOpacity>
      </View>

      {/* Render categories */}
      {categories.map((category) => renderCategoryItem(category))}
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
    marginRight: 'auto', // Pushes the text to the left side
  },
  categoryIcon: {
    width: 32, // Increased size
    height: 32, // Increased size
    marginRight: 10, // Space between icon and text
  },
  subcategoryContainer: {
    marginTop: 5,
    paddingLeft: 20,
  },
  subcategoryItem: {
    paddingVertical: 10,
  },
  subcategoryText: {
    fontSize: 18,
    fontWeight: '400',
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
});

export default LeftNavBar;
