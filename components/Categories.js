import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../styles/color';

const categories = [
  { id: 1, name: 'Electronics', image: require('../assets/Categories.png'), screen: 'SubCategoryScreen' },
  { id: 2, name: 'Stationary', image: require('../assets/Categories3.png'), screen: 'SubCategoryScreen' },
  { id: 3, name: 'Tools', image: require('../assets/Categories2.png'), screen: 'SubCategoryScreen' },
  { id: 4, name: 'Furniture', image: require('../assets/Categories4.png'), screen: 'SubCategoryScreen' },
  { id: 5, name: 'All Categories', image: require('../assets/Categories5.png'), screen: 'SubCategoryScreen' },
];

const Categories = () => {
  const navigation = useNavigation();

  const handleCategoryPress = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categories</Text>
      <View style={styles.categoriesContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => handleCategoryPress(category.screen)}
            style={styles.categoryItem}
          >
            <View style={styles.circle}>
              <Image source={category.image} style={styles.image} />
            </View>
            <Text style={styles.text}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: colors.TextBlack,
    marginLeft: 15,
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  circle: {
    width: 65,
    height: 65,
    borderRadius: 35,
    backgroundColor: '#FFE8C4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 40,
    height: 40,
  },
  text: {
    marginTop: 5,
    fontSize: 10,
    fontWeight: '600',
    color: colors.TextBlack,
  },
});

export default Categories;
