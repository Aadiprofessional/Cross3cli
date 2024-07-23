import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../styles/color';
import { categories } from '../data/categoriesData';

interface LeftNavBarProps {
  toggleNavBar: () => void;
}

const LeftNavBar: React.FC<LeftNavBarProps> = ({ toggleNavBar }) => {
  const navigation = useNavigation();

  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedSubCategory, setExpandedSubCategory] = useState<string | null>(null);

  const toggleCategory = (categoryName: string) => {
    if (expandedCategory === categoryName) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryName);
      setExpandedSubCategory(null);
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
    toggleNavBar();
  };

  const navigateToSubCategory = (subsubcategory: string) => {
    navigation.navigate('SubCategoryScreen', { subcategory: subsubcategory });
    toggleNavBar();
  };

  const renderSubSubCategoryItem = (subsubcategories: string[]) => (
    <View style={styles.subsubCategoryContainer}>
      {subsubcategories.map((subsubcategory) => (
        <TouchableOpacity key={subsubcategory} style={styles.subsubcategoryItem} onPress={() => navigateToSubCategory(subsubcategory)}>
          <Text style={styles.subsubcategoryText}>{subsubcategory}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderSubCategoryItem = (subcategories: { name: string; subsubcategories: string[] }[]) => (
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

  const renderCategoryItem = ({ name, icon, subcategories }: { name: string; icon: any; subcategories?: { name: string; subsubcategories: string[] }[] }) => {
    const isExpanded = expandedCategory === name;

    return (
      <View key={name}>
        <TouchableOpacity style={styles.navItem} onPress={() => {
          if (subcategories) {
            toggleCategory(name);
          }
        }}>
          <Image source={icon} style={styles.categoryIcon} />
          <Text style={styles.navText}>{name}</Text>
          {subcategories && (
            <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} size={24} color={colors.second} />
          )}
        </TouchableOpacity>
        {isExpanded && subcategories && renderSubCategoryItem(subcategories)}
        {name === 'Books' && (
          <TouchableOpacity style={styles.navItem} onPress={() => navigateToSubCategory('All Categories')}>
            <Text style={styles.navText}>All Categories</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.navContainer}>
      <View style={styles.categoriesHeader}>
        <Text style={styles.categoriesHeaderText}>Categories</Text>
        <TouchableOpacity onPress={toggleNavBar}>
          <Icon name="close" size={32} color={colors.inputPlaceholder} style={styles.backIcon} />
        </TouchableOpacity>
      </View>
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
  backIcon: {
    marginRight: 2,
  },
});

export default LeftNavBar;
