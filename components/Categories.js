import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import CategoryItem from './CategoryItem';

const categories = [
  {id: 1, name: 'Category', image: require('../assets/Categories.png')},
  {id: 2, name: 'Category', image: require('../assets/Categories.png')},
  {id: 3, name: 'Category', image: require('../assets/Categories.png')},
  {id: 4, name: 'Category', image: require('../assets/Categories.png')},
  {id: 5, name: 'Category', image: require('../assets/Categories.png')},
];

const Categories = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categories</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}>
        {categories.map(category => (
          <CategoryItem
            key={category.id}
            name={category.name}
            image={category.image}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  scrollView: {
    flexDirection: 'row',
  },
});

export default Categories;
