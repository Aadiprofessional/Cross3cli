import * as React from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {FontAwesome} from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createMaterialBottomTabNavigator();

const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="#6200EE"
      inactiveColor="#8A8A8A"
      barStyle={{ backgroundColor: '#FFFFFF' }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <FontAwesome name="home" color={color} size={22} />,
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: ({ color }) => <FontAwesome name="shopping-cart" color={color} size={22} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => <FontAwesome name="user" color={color} size={22} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
