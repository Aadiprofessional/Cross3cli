import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Animated } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomHeader from '../components/CustomHeader';
import AutoImageSlider from '../components/AutoImageSlider';
import HelpBox from '../components/HelpBox';
import Categories from '../components/Categories';
import { colors } from '../styles/color';
import AutoImageSlider2 from '../components/AutoImageSlider2';
import BestDeals from '../components/BestDeals';
import LatestProducts from '../components/LatestProducts';
import UpcomingProducts from '../components/UpcomingProducts';
import CartScreen from './CartScreen';
import ProfileScreen from './ProfileScreen';
import QuotesScreen from './QuotesScreen'; // Import QuotesScreen
import LeftNavBar from '../components/LeftNavBar';

const Tab = createMaterialBottomTabNavigator();

const HomeContent = () => {
  return (
    <ScrollView style={styles.container}>
      
      <AutoImageSlider />
      <View style={styles.backgroundContainer}>
        <View style={styles.topHalf} />
        <View style={styles.bottomHalf} />
        <HelpBox style={styles.helpBox} />
        <Categories style={styles.categories} />
        <Text style={styles.title}>Only For App Deals</Text>
        <AutoImageSlider2 />
        <BestDeals />
        <UpcomingProducts />
        <LatestProducts />
      </View>
      <View style={styles.endTextContainer}>
        <Text style={styles.endText}>India's best</Text>
        <Text style={styles.endText}>
          delivery app<Text style={styles.emoji}>❤️</Text>
        </Text>
        <View style={styles.line} />
        <Text style={styles.crossBee}>CrossBee</Text>
      </View>
    </ScrollView>
  );
};

const HomeScreen = () => {
  const [isNavBarVisible, setNavBarVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-250)); // Initial position of sidebar

  const toggleNavBar = () => {
    if (isNavBarVisible) {
      // Hide navbar
      Animated.timing(slideAnim, {
        toValue: -250,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setNavBarVisible(false));
    } else {
      // Show navbar
      setNavBarVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <View style={styles.mainContainer}>
      {isNavBarVisible && (
        <Animated.View style={[styles.navContainer, { transform: [{ translateX: slideAnim }] }]}>
          <LeftNavBar toggleNavBar={toggleNavBar} />
        </Animated.View>
      )}
      <View style={styles.contentContainer}>
        <CustomHeader toggleNavBar={toggleNavBar} />
        <Tab.Navigator
          initialRouteName="HomeContent"
          activeColor={colors.main} // Use main color for active color
          inactiveColor="#8A8A8A"
          barStyle={{ backgroundColor: '#FFFFFF' }}
        >
          <Tab.Screen
            name="HomeContent"
            component={HomeContent}
            options={{
              tabBarIcon: ({ color }) => <Icon name="home-outline" color={color} size={22} />,
              tabBarLabel: 'Home',
            }}
          />
          <Tab.Screen
            name="Cart"
            component={CartScreen}
            options={{
              tabBarIcon: ({ color }) => <Icon name="cart-outline" color={color} size={22} />,
              tabBarLabel: 'Cart',
            }}
          />
          <Tab.Screen
            name="Quotes"
            component={QuotesScreen} // Add QuotesScreen
            options={{
              tabBarIcon: ({ color }) => <Icon name="quote-outline" color={color} size={22} />, // Use appropriate icon name
              tabBarLabel: 'Quotes',
            }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              tabBarIcon: ({ color }) => <Icon name="person-outline" color={color} size={22} />,
              tabBarLabel: 'Profile',
            }}
          />
        </Tab.Navigator>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Set entire screen background to white
  },
  backgroundContainer: {
    position: 'relative',
  },
  topHalf: {
    backgroundColor: colors.main,
    height: '5%',
  },
  bottomHalf: {
    backgroundColor: '#FFFFFF',
    height: '5%',
  },
  helpBox: {
    marginBottom: 0, // Ensure no margin bottom
  },
  categories: {
    marginTop: 0, // Ensure no margin top
    marginBottom: 0,
  },
  title: {
    // Ensure it matches Categories text style
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 1,
    marginLeft: 15, // Align text with Categories component
  },
  autoImageSlider2: {
    marginTop: 0,
  },
  endTextContainer: {
    alignItems: 'left',
    marginTop: 1,
    marginLeft: 10,
  },
  endText: {
    fontSize: 40,
    fontWeight: 'bold',
    opacity: 0.1,
  },
  emoji: {
    fontSize: 40,
    opacity: 1,
  },
  line: {
    width: '90%',
    height: 1,
    backgroundColor: '#000',
    marginVertical: 10,
    opacity: 0.1,
  },
  crossBee: {
    fontSize: 24,
    fontWeight: '600',
    opacity: 0.1,
    marginBottom: 200,
  },
  navContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 250,
    height: '100%',
    backgroundColor: '#FFF',
    zIndex: 10,
    elevation: 10,
  },
});

export default HomeScreen;

