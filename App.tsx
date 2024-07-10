import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import ProductDetailPage from './screens/ProductDetailPage';
import { colors } from './styles/color';
import NeedHelpScreen from './screens/NeedHelpScreen';
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen';
import TermsConditionsScreen from './screens/TermsConditionsScreen';
import RegisterCompanyScreen from './screens/RegisterCompanyScreen';
import CartScreen from './screens/CartScreen';
import ProfileScreen from './screens/ProfileScreen';
import SubCategoryScreen from './screens/SubCategoryScreen';

type RootStackParamList = {
  Login: { login: () => void };
  Home: undefined;
  SearchScreen: undefined;
  ProductDetailPage: { imageSource: string; description: string; price: string };
  NeedHelp: undefined;
  PrivacyPolicyScreen: undefined;
  TermsConditionsScreen: undefined;
  RegisterCompanyScreen: undefined;
  Cart: undefined;
  Profile: undefined;
  SubCategoryScreen: { subcategory: string }; // Define subcategory parameter
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
          component={SearchScreen}
          options={{
            title: 'Search',
            headerStyle: {
              backgroundColor: colors.main,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="ProductDetailPage"
          component={ProductDetailPage}
          options={{
            title: 'Product Detail',
            headerStyle: {
              backgroundColor: colors.main,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="NeedHelp"
          component={NeedHelpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PrivacyPolicyScreen"
          component={PrivacyPolicyScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TermsConditionsScreen"
          component={TermsConditionsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RegisterCompanyScreen"
          component={RegisterCompanyScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Cart"
          component={CartScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SubCategoryScreen"
          component={SubCategoryScreen}
          options={{
            title: 'Subcategory', // Set the title of the screen
            headerStyle: {
              backgroundColor: colors.main,
            },
            headerTintColor: '#fff',
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
