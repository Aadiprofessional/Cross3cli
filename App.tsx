import React, { useState } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import CartScreen from './screens/CartScreen';

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  BottomTabNavigator: undefined;
  Cart: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = () => {
    // Simulate login logic here
    setIsLoggedIn(true);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isLoggedIn ? 'BottomTabNavigator' : 'Login'}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
          initialParams={{ login }} // Pass login function to LoginScreen if needed
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BottomTabNavigator"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Cart"
          component={CartScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
