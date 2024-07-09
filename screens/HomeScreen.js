import React from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
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
import QuotesScreen from './QuotesScreen'; // import QuotesScreen

const Tab = createMaterialBottomTabNavigator();

const HomeContent = () => {
  return (
    <ScrollView style={styles.container}>
      <CustomHeader title="Home" />
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
  return (
    <Tab.Navigator
      initialRouteName="HomeContent"
      activeColor={colors.main} // Use main color for active color
      inactiveColor="#8A8A8A"
      barStyle={{ backgroundColor: '#FFFFFF' }}
      shifting={true} // add shifting for rounded rectangle
      sceneAnimationEnabled={true} // Enable scene animation for better transitions
    >
      <Tab.Screen
        name="HomeContent"
        component={HomeContent}
        options={{
          tabBarIcon: ({ color }) => <Icon name="home" color={color} size={22} />,
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
        component={QuotesScreen} // add QuotesScreen
        options={{
          tabBarIcon: ({ color }) => <Icon name="chatbubbles-outline" color={color} size={22} />,
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
  );
};

const styles = StyleSheet.create({
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
});

export default HomeScreen;
