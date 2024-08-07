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
import InvoiceScreen2 from './screens/invoiceScreen2';
import UpdateProfileScreen from './screens/UpdateProfileScreen';
import Toast from 'react-native-toast-message';
import SplashScreen from './screens/SplashScreen';
import OTPScreen from './screens/OTPscreen';
import OTPscreen from './screens/OTPscreen';
import AllCategoriesScreen from './screens/AllCategoriesScreen';
import UserCompaniesScreen from './screens/UserCompaniesScreen';
import AddCompanyScreen from './screens/AddCompanyScreen';

// Initialize Firebase if it hasn't been initialized already
if (!firebase.apps.length) {
  firebase.initializeApp();
}

const Stack = createNativeStackNavigator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isNavBarVisible, setIsNavBarVisible] = useState(false);

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const user = auth().currentUser;
        const loggedIn = await AsyncStorage.getItem('loggedIn');
        if (user || loggedIn === 'true') {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Error checking authentication state:', error);
      } finally {
        setIsLoading(false); // Stop loading after check
      }
    };

    checkAuthState();
  }, []);

  const toggleNavBar = () => {
    setIsNavBarVisible(!isNavBarVisible);
  };

  if (isLoading) {
    // You can return a custom splash/loading screen here
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Splash"
            component={SplashScreen} // Replace with your splash screen component
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={isLoggedIn ? 'HomeTab' : 'OTPVerification'}>
          <Stack.Screen
            name="OTPVerification"
            component={OTPVerificationScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="HomeTab"
            component={HomeScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="OTPVerificationScreen"
            component={OTPVerificationScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="OTPscreen"
            component={OTPScreen}
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
            name="AddCompanyScreen"
            component={AddCompanyScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="UserCompaniesScreen"
            component={UserCompaniesScreen}
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
            name="AllCategoriesScreen"
            component={AllCategoriesScreen}
            options={{
              title: 'Category',
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
