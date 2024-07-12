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
  const [expandedSubCategory, setExpandedSubCategory] = useState<string | null>(null);

  const categories = [
    { 
      name: 'Electronics', 
      icon: require('../assets/Categories.png'), // Use require for local images
      subcategories: [
        { 
          name: 'Laptops', 
          subsubcategories: ['Gaming Laptops', 'Ultrabooks', '2-in-1 Laptops'] 
        },
        { 
          name: 'Mobile Phones', 
          subsubcategories: ['Smartphones', 'Feature Phones'] 
        },
        { 
          name: 'Tablets', 
          subsubcategories: ['Android Tablets', 'iPads'] 
        },
        { 
          name: 'Headphones', 
          subsubcategories: ['Over-Ear', 'In-Ear', 'Wireless'] 
        },
        { 
          name: 'Smartwatches', 
          subsubcategories: ['Apple Watch', 'Android Wear'] 
        },
      ] 
    },
    { 
      name: 'Clothing', 
      icon: require('../assets/Categories.png'), // Example, replace with actual image
      subcategories: [
        { 
          name: 'Men', 
          subsubcategories: ['T-Shirts', 'Jeans', 'Shoes'] 
        },
        { 
          name: 'Women', 
          subsubcategories: ['Dresses', 'Tops', 'Shoes'] 
        },
        { 
          name: 'Kids', 
          subsubcategories: ['Boys', 'Girls'] 
        },
      ] 
    },
    { 
      name: 'Kids', 
      icon: require('../assets/Categories.png'), // Example, replace with actual image
      subcategories: [
        { 
          name: 'Boys', 
          subsubcategories: ['Toys', 'Clothing'] 
        },
        { 
          name: 'Girls', 
          subsubcategories: ['Toys', 'Clothing'] 
        },
      ] 
    },
    { 
      name: 'Toys', 
      icon: require('../assets/Categories.png'), // Example, replace with actual image
      subcategories: [
        { 
          name: 'Action Figures', 
          subsubcategories: ['Superheroes', 'Anime'] 
        },
        { 
          name: 'Dolls', 
          subsubcategories: ['Barbie', 'American Girl'] 
        },
        { 
          name: 'Board Games', 
          subsubcategories: ['Strategy', 'Family Games'] 
        },
      ] 
    },
    { 
      name: 'Books', 
      icon: require('../assets/Categories.png'), // Example, replace with actual image
      subcategories: [
        { 
          name: 'Fiction', 
          subsubcategories: ['Novels', 'Short Stories'] 
        },
        { 
          name: 'Non-Fiction', 
          subsubcategories: ['Biographies', 'Self-Help'] 
        },
        { 
          name: 'Children', 
          subsubcategories: ['Picture Books', 'Young Adult'] 
        },
      ] 
    },
  ];

  const toggleCategory = (categoryName: string) => {
    if (expandedCategory === categoryName) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryName);
      setExpandedSubCategory(null); // Close subcategory if category is toggled
    }
  };

  const toggleSubCategory = (subCategoryName: string) => {
    if (expandedSubCategory === subCategoryName) {
      setExpandedSubCategory(null);
    } else {
      setExpandedSubCategory(subCategoryName);
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

  const renderSubSubCategoryItem = (subsubcategories: string[]) => {
    return (
      <View style={styles.subsubCategoryContainer}>
        {subsubcategories.map((subsubcategory) => (
          <TouchableOpacity key={subsubcategory} style={styles.subsubcategoryItem} onPress={() => navigateToSubCategory(subsubcategory)}>
            <Text style={styles.subsubcategoryText}>{subsubcategory}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderSubCategoryItem = (subcategories: { name: string; subsubcategories: string[] }[]) => {
    return (
      <View style={styles.subcategoryContainer}>
        {subcategories.map(({ name, subsubcategories }) => {
          const isExpanded = expandedSubCategory === name;
          return (
            <View key={name}>
              <TouchableOpacity style={styles.subcategoryItem} onPress={() => toggleSubCategory(name)}>
                <Text style={styles.subcategoryText}>{name}</Text>
                <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} size={24} color={colors.second} />
              </TouchableOpacity>
              {isExpanded && renderSubSubCategoryItem(subsubcategories)}
            </View>
          );
        })}
      </View>
    );
  };

  const renderCategoryItem = ({ name, icon, screen, subcategories }: { name: string; icon: any; screen?: string; subcategories?: { name: string; subsubcategories: string[] }[] }) => {
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

        {isExpanded && subcategories && renderSubCategoryItem(subcategories)}
      </View>
    );
  };

  return (
    <View style={styles.navContainer}>
      {/* Categories text with arrow */}
      <View style={styles.categoriesHeader}>
        <Text style={styles.categoriesHeaderText}>Categories</Text>
        <TouchableOpacity onPress={toggleNavBar}>
          <Text style={styles.backText}>{'<'}</Text>
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
    color: colors.TextBlack,
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
  subsubCategoryContainer: {
    marginTop: 5,
    paddingLeft: 20,
  },
  subsubcategoryItem: {
    paddingVertical: 10,
  },
  subsubcategoryText: {
    fontSize: 16,
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
  backText: {
    fontSize: 34,
    fontWeight: '500',
    color: colors.main,
    marginRight: 10,
  },
});

export default LeftNavBar;
