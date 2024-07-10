import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen'; // Import SearchScreen
import ProductDetailPage from './screens/ProductDetailPage';
import { colors } from './styles/color';

type RootStackParamList = {
  Login: { login: () => void };
  Home: undefined;
  SearchScreen: undefined; // Add SearchScreen to RootStackParamList
  ProductDetailPage: { imageSource: string; description: string; price: string };
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
      <Stack.Navigator initialRouteName={isLoggedIn ? 'Home' : 'Login'}>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
          initialParams={{ login }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SearchScreen"
          component={SearchScreen} // Add SearchScreen to the stack
          options={{
            title: 'Search', // Set the title of the screen
            headerStyle: {
              backgroundColor: colors.main, // Change this to your desired color
            },
            headerTintColor: '#fff', // Text color
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="ProductDetailPage"
          component={ProductDetailPage}
          options={{
            title: 'Product Detail', // Set the title of the screen
            headerStyle: {
              backgroundColor: colors.main, // Change this to your desired color
            },
            headerTintColor: '#fff', // Text color
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
