import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
import {colors} from './styles/color';
import LeftNavBar from './components/LeftNavBar';
import {CartProvider} from './components/CartContext';

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
import InvoiceScreen from './screens/InvoiceScreen';
import OTPVerificationScreen from './screens/OTPVerificationScreen';
import {color} from './styles/color';
import InvoiceScreen2 from './screens/invoiceScreen2';
import UpdateProfileScreen from './screens/UpdateProfileScreen';
import Toast from 'react-native-toast-message';

// Initialize Firebase if it hasn't been initialized already
if (!firebase.apps.length) {
  firebase.initializeApp();
}

const Stack = createNativeStackNavigator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isNavBarVisible, setIsNavBarVisible] = useState(false);

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const user = await auth().currentUser;
        if (user) {
          setIsLoggedIn(true);
        } else {
          const loggedIn = await AsyncStorage.getItem('loggedIn');
          setIsLoggedIn(!!loggedIn);
        }
      } catch (error) {
        console.error('Error checking authentication state:', error);
      }
    };

    checkAuthState();
  }, []);

  const toggleNavBar = () => {
    setIsNavBarVisible(!isNavBarVisible);
  };

  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={isLoggedIn ? 'Home' : 'OTPVerification'}>
          <Stack.Screen
            name="OTPVerification"
            component={OTPVerificationScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{headerShown: false}}
          />
           
          <Stack.Screen
            name="SearchScreen"
            component={SearchScreen}
            options={{
              title: 'Search',
              headerStyle: {backgroundColor: colors.main},
              headerTintColor: '#fff',
              headerTitleStyle: {fontWeight: 'bold'},
            }}
          />

          <Stack.Screen
            name="SearchResultsScreen"
            component={SearchResultsScreen}
            options={{
              title: 'Search Results',
              headerStyle: {backgroundColor: colors.main},
              headerTintColor: '#fff',
              headerTitleStyle: {fontWeight: 'bold'},
            }}
          />
          <Stack.Screen
            name="ProductDetailPage"
            component={ProductDetailPage}
            options={{
              title: 'Product Detail',
              headerStyle: {backgroundColor: colors.main},
              headerTintColor: '#fff',
              headerTitleStyle: {fontWeight: 'bold'},
            }}
          />
          <Stack.Screen
            name="NeedHelp"
            component={NeedHelpScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="PrivacyPolicyScreen"
            component={PrivacyPolicyScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="UpdateProfileScreen"
            component={UpdateProfileScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="TermsConditionsScreen"
            component={TermsConditionsScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Cart"
            component={CartScreen}
            options={{title: 'Cart'}}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SubCategoryScreen"
            component={SubCategoryScreen}
            options={{
              title: 'Subcategory',
              headerStyle: {backgroundColor: colors.main},
              headerTintColor: '#fff',
              headerTitleStyle: {fontWeight: 'bold'},
            }}
          />
          <Stack.Screen
            name="Quotation"
            component={QuotationScreen}
            options={{
              title: 'Quotation Screen',
              headerStyle: {backgroundColor: colors.main},
              headerTintColor: '#fff',
              headerTitleStyle: {fontWeight: 'bold'},
            }}
          />
          <Stack.Screen
            name="OrderSummary"
            component={OrderSummaryScreen}
            options={{
              title: 'Order Summary',
              headerStyle: {backgroundColor: colors.main},
              headerTintColor: '#fff',
              headerTitleStyle: {fontWeight: 'bold'},
            }}
          />
          <Stack.Screen
            name="InvoiceScreen"
            component={InvoiceScreen}
            options={{
              title: 'Invoice Screen',
              headerStyle: {backgroundColor: colors.main},
              headerTintColor: '#fff',
              headerTitleStyle: {fontWeight: 'bold'},
            }}
          />
          <Stack.Screen
            name="InvoiceScreen2"
            component={InvoiceScreen2}
            options={{
              title: 'Invoice Screen',
              headerStyle: {backgroundColor: colors.main},
              headerTintColor: '#fff',
              headerTitleStyle: {fontWeight: 'bold'},
            }}
          />
        </Stack.Navigator>

        {isNavBarVisible && <LeftNavBar toggleNavBar={toggleNavBar} />}
        <Toast />
      </NavigationContainer>
    </CartProvider>
  );
};

export default App;
