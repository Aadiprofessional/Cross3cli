// screens/HomeScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, Animated, TouchableWithoutFeedback } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomHeader from '../components/CustomHeader';
import WhatsAppButton from '../components/WhatsAppButton';
import HelpBox from '../components/HelpBox';
import Categories from '../components/Categories';
import { colors } from '../styles/color';
import AutoImageSlider2 from '../components/AutoImageSlider2';
import BestDeals from '../components/BestDeals';
import LatestProducts from '../components/LatestProducts';
import UpcomingProducts from '../components/UpcomingProducts';
import CartScreen from './CartScreen';
import ProfileScreen from './ProfileScreen';
import QuotesScreen from './QuotesScreen';
import LeftNavBar from '../components/LeftNavBar';
import HomeContent from './HomeContent';

const Tab = createMaterialBottomTabNavigator();

const HomeScreen = () => {
  const [isNavBarVisible, setNavBarVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-250));

  const toggleNavBar = () => {
    if (isNavBarVisible) {
      Animated.timing(slideAnim, {
        toValue: -250,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setNavBarVisible(false));
    } else {
      setNavBarVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleOutsidePress = () => {
    if (isNavBarVisible) {
      toggleNavBar();
    }
  };

  return (
    <View style={styles.mainContainer}>
      {isNavBarVisible && (
        <TouchableWithoutFeedback onPress={handleOutsidePress}>
          <View style={styles.overlay}>
            <Animated.View
              style={[
                styles.navContainer,
                { transform: [{ translateX: slideAnim }] },
              ]}
            >
              <LeftNavBar toggleNavBar={toggleNavBar} />
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      )}
      <View style={styles.contentContainer}>
        <CustomHeader toggleNavBar={toggleNavBar} />
        <Tab.Navigator
          initialRouteName="Home"
          activeColor={colors.main}
          inactiveColor="#8A8A8A"
          barStyle={{ backgroundColor: '#FFFFFF' }}
        >
          <Tab.Screen
            name="Home"
            component={HomeContent}
            options={{
              tabBarIcon: ({ color }) => (
                <Icon name="home-outline" color={color} size={22} />
              ),
              tabBarLabel: 'Home',
            }}
          />
          <Tab.Screen
            name="Quotes"
            component={QuotesScreen}
            options={{
              tabBarIcon: ({ color }) => (
                <Icon name="document-outline" color={color} size={22} />
              ),
              tabBarLabel: 'Quotes',
            }}
          />
          <Tab.Screen
            name="Cart"
            component={CartScreen}
            options={{
              tabBarIcon: ({ color }) => (
                <Icon name="cart-outline" color={color} size={22} />
              ),
              tabBarLabel: 'Cart',
            }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              tabBarIcon: ({ color }) => (
                <Icon name="person-outline" color={color} size={22} />
              ),
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
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 9,
  },
});

export default HomeScreen;
