import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { colors } from '../styles/color';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    // Fetch data from API
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          'https://crossbee-server.vercel.app/getMain'
        );
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryPress = (category) => {
    // Show a toast message
    Toast.show({
      type: 'success',
      text1: `Navigating to ${category.name}`,
    });

    // Navigate to the specified screen with category name as parameter
    navigation.navigate('SubCategoryScreen2', { name: category.name });
  };

  const handleAllCategoriesPress = () => {
    navigation.navigate('AllCategoriesScreen'); // Navigate to AllCategoriesScreen
  };

  // Limit the categories to only the first 4
  const displayedCategories = categories.slice(0, 4);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Categories</Text>
        <View style={styles.categoriesContainer}>
          {displayedCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => handleCategoryPress(category)}
              style={styles.categoryItem}>
              <View style={styles.circle}>
                <Image source={{ uri: category.image }} style={styles.image} />
              </View>
              <Text style={styles.text}>{category.name}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            key="allCategories"
            onPress={handleAllCategoriesPress}
            style={styles.categoryItem}>
            <View style={styles.circle}>
              <Image
                source={require('../assets/Categories5.png')}
                style={styles.image}
              />
            </View>
            <Text style={styles.text}>All Categories</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 0,
  },
  scrollContainer: {
    // Make room for the footer button if needed
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Outfit-Bold',
    marginBottom: 10,
    color: colors.TextBlack,
    marginLeft: 15,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Wrap items to next line
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: 5,
  },
  circle: {
    width: 60,
    height: 60,
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
    fontWeight: 'bold',
    fontFamily: 'Outfit-Bold',
    color: colors.TextBlack,
  },
});

export default Categories;
