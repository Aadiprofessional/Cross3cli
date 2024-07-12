import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import ProductDetailPage from './screens/ProductDetailPage';
import NeedHelpScreen from './screens/NeedHelpScreen';
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen';
import TermsConditionsScreen from './screens/TermsConditionsScreen';
import RegisterCompanyScreen from './screens/RegisterCompanyScreen';
import CartScreen from './screens/CartScreen';
import ProfileScreen from './screens/ProfileScreen';
import SubCategoryScreen from './screens/SubCategoryScreen';
import OrderSummaryScreen from './screens/OrderSummaryScreen';
import QuotationScreen from './screens/QuotationScreen';
import SearchResultsScreen from './screens/SearchResultsScreen';
import { colors } from './styles/color';

const Stack = createNativeStackNavigator();

const App = () => {
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
              backgroundColor: colors.main,  // Example header style
            },
            headerTintColor: '#fff', // Example header text color
            headerTitleStyle: {
              fontWeight: 'bold', // Example header title style
            },
          }}
        />
        <Stack.Screen
          name="SearchResultsScreen"
          component={SearchResultsScreen}
          options={{
            title: 'Search Results',
            headerStyle: {
              backgroundColor: colors.main,  // Example header style
            },
            headerTintColor: '#fff', // Example header text color
            headerTitleStyle: {
              fontWeight: 'bold', // Example header title style
            },
          }}
        />
        <Stack.Screen
          name="ProductDetailPage"
          component={ProductDetailPage}
          options={{
            title: 'Product Detail',
            headerStyle: {
              backgroundColor: colors.main, // Example header style
            },
            headerTintColor: '#fff', // Example header text color
            headerTitleStyle: {
              fontWeight: 'bold', // Example header title style
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
            title: 'Subcategory',
            headerStyle: {
              backgroundColor: colors.main,  // Example header style
            },
            headerTintColor: '#fff', // Example header text color
            headerTitleStyle: {
              fontWeight: 'bold', // Example header title style
            },
          }}
        />
        <Stack.Screen
          name="OrderSummary"
          component={OrderSummaryScreen}
          options={{
            title: 'Order Summary',
            headerStyle: {
              backgroundColor: colors.main, // Example header style
            },
            headerTintColor: '#fff', // Example header text color
            headerTitleStyle: {
              fontWeight: 'bold', // Example header title style
            },
          }}
        />
        <Stack.Screen
          name="Quotation"
          component={QuotationScreen}
          options={{
            title: 'Quotation Screen',
            headerStyle: {
              backgroundColor: colors.main, // Example header style
            },
            headerTintColor: '#fff', // Example header text color
            headerTitleStyle: {
              fontWeight: 'bold', // Example header title style
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
