import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CategoryItem from './CategoryItem';
import { colors } from '../styles/color';

const categories = [
  { id: 1, name: 'Category', image: require('../assets/Categories.png') },
  { id: 2, name: 'Category', image: require('../assets/Categories.png') },
  { id: 3, name: 'Category', image: require('../assets/Categories.png') },
  { id: 4, name: 'Category', image: require('../assets/Categories.png') },
];

const Categories = ({ toggleNavBar }) => {
  const navigation = useNavigation();

  const handleCategoryPress = (categoryName) => {
    navigation.navigate('SubCategoryScreen', { subcategory: categoryName });
    toggleNavBar(); // Close the left navigation bar after navigation
  };

  const navigateToSubCategory = () => {
    navigation.navigate('SubCategoryScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categories</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            onPress={() => handleCategoryPress(category.name)}
          >
            <CategoryItem name={category.name} image={category.image} />
          </TouchableOpacity>
        ))}
        <TouchableOpacity onPress={() => navigateToSubCategory('All Categories')}>
          <CategoryItem
            key={categories.length + 1}
            name="All Category"
            image={require('../assets/AllCategories.png')}
          />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
    backgroundColor: '#fff',
    marginBottom: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: colors.TextBlack,
    marginLeft: 15,
  },
  scrollView: {
    flexDirection: 'row',
  },
});

export default Categories;
