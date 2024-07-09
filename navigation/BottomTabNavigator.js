import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeContent from '../screens/HomeContent'; // Adjust the import based on your project structure
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';
import QuotesScreen from '../screens/QuotesScreen'; // Assuming you have a QuotesScreen

const Tab = createMaterialBottomTabNavigator();

const BottomNavBar = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="#6200EE"
      inactiveColor="#8A8A8A"
      barStyle={{ backgroundColor: '#FFFFFF' }}
    >
      <Tab.Screen
        name="Home"
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
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => <Icon name="person-outline" color={color} size={22} />,
          tabBarLabel: 'Profile',
        }}
      />
      <Tab.Screen
        name="Quotes"
        component={QuotesScreen}
        options={{
          tabBarIcon: ({ color }) => <Icon name="chatbubble-ellipses-outline" color={color} size={22} />,
          tabBarLabel: 'Quotes',
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavBar;
