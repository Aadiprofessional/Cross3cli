import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {colors} from '../styles/color';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    // Fetch data from API
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          'https://crossbee-server-1036279390366.asia-south1.run.app/getMain',
        );
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryPress = category => {
    // Show a toast message
    Toast.show({
      type: 'success',
      text1: `Navigating to ${category.name}`,
    });

    // Navigate to the specified screen with category name as parameter
    navigation.navigate('SubCategoryScreen2', {name: category.name});
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
          {displayedCategories.map(category => (
            <TouchableOpacity
              key={category.id}
              onPress={() => handleCategoryPress(category)}
              style={styles.categoryItem}>
              <View style={styles.categoryContent}>
                <View style={styles.circle}>
                  <Image source={{uri: category.image}} style={styles.image} />
                </View>
                <Text style={styles.text}>{category.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            key="allCategories"
            onPress={handleAllCategoriesPress}
            style={styles.categoryItem}>
            <View style={styles.categoryContent}>
              <View style={styles.circle}>
                <Image
                  source={require('../assets/Categories5.png')}
                  style={styles.image}
                />
              </View>
              <Text style={styles.text}>All Categories</Text>
            </View>
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
    // Additional room for scrolling if necessary
  },
  title: {
    fontSize: 20,
    fontFamily: 'Outfit-Medium',
    marginBottom: 10,
    color: colors.TextBlack,
    marginLeft: 15,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Allows wrapping of category items
    justifyContent: 'space-around', // Ensure even spacing around items
  },
  categoryItem: {
    marginHorizontal: 5,
    alignItems: 'center',
  },
  categoryContent: {
    alignItems: 'center', // Align both image and text to center
    width: 70, // Set a fixed width for each category item
  },
  circle: {
    width: 55,
    height: 55,
    borderRadius: 35,
    backgroundColor: '#FFE8C4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 35,
    height: 35,
  },
  text: {
    marginTop: 5,
    fontSize: 10,
    fontFamily: 'Outfit-Bold',
    color: colors.TextBlack,
    textAlign: 'center', // Ensure text is center-aligned
    flexWrap: 'wrap', // Allow text to wrap onto the next line if necessary
    maxWidth: 70, // Keep the text contained within the width of the item
  },
});

export default Categories;
