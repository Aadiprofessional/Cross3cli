import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
import { colors } from './styles/color';
import LeftNavBar from './components/LeftNavBar';
import { CartProvider } from './components/CartContext';
import firestore from '@react-native-firebase/firestore';

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
import SearchResultsScreen from './screens/SearchResultsScreen';
import InvoiceScreen from './screens/InvoiceScreen';
import OTPVerificationScreen from './screens/OTPVerificationScreen';
import UpdateProfileScreen from './screens/UpdateProfileScreen';
import Toast from 'react-native-toast-message';
import SplashScreen from './screens/SplashScreen';
import OTPScreen from './screens/OTPscreen';
import AllCategoriesScreen from './screens/AllCategoriesScreen';
import UserCompaniesScreen from './screens/UserCompaniesScreen';
import AddCompanyScreen from './screens/AddCompanyScreen';
import ThankYouScreen from './screens/ThankYou';
import SubCategoryScreen2 from './screens/SubCategoryScreen copy';
import EditCompanyScreen from './components/editCompanyScreen';
import TransactionScreen from './screens/Transation';
import CustomHeader from './components/CustomHeader';
import CustomHeader2 from './components/CustomHeader2';
import CustomHeader3 from './components/CustomHeader2 copy';
import { WishlistProvider } from './components/WishlistContext';
import WishlistScreen from './screens/WishlistScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import FAQScreen from './screens/FAQScreen';


if (!firebase.apps.length) {
  firebase.initializeApp();
}

const Stack = createNativeStackNavigator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isNavBarVisible, setIsNavBarVisible] = useState(false);

  const navigationRef = useRef(null);

  useEffect(() => {
    const checkUserStatus = async () => {
      const user = auth().currentUser;
      if (user) {
        try {
          const docSnapshot = await firestore().collection('users').doc(user.uid).get();
          if (docSnapshot.exists) {
            setIsLoggedIn(true);
          } else {
            await auth().signOut();
            setIsLoggedIn(false);
            Toast.show({
              type: 'error',
              text1: 'Authentication Error',
              text2: 'User data not found. Logging out.',
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          await auth().signOut();
          setIsLoggedIn(false);
          Toast.show({
            type: 'error',
            text1: 'Authentication Error',
            text2: 'User data not found. Logging out.',
          });
        }
      } else {
        setIsLoggedIn(false);
      }
      setIsLoading(false);
    };

    checkUserStatus();
  }, []);

  const toggleNavBar = () => {
    setIsNavBarVisible(!isNavBarVisible);
  };

  if (isLoading) {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <WishlistProvider>
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={isLoggedIn ? 'HomeTab' : 'OTPVerification'}
        >
          <Stack.Screen
            name="OTPVerification"
            component={OTPVerificationScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="HomeTab"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="OTPscreen"
            component={OTPScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SearchScreen"
            component={SearchScreen}
            options={{
              title: 'Search',
              headerStyle: { backgroundColor: colors.main },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Outfit-Medium',
                textAlign: 'left',
                flex: 1,
                textAlign: 'left',
                justifyContent: 'center',
              },
              headerTitleAlign: 'left',
            }}
          />
          <Stack.Screen
            name="AddTransactionScreen"
            component={TransactionScreen}
            options={{
              title: 'Your Transactions',
              headerStyle: { backgroundColor: colors.main },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Outfit-Medium',
                textAlign: 'left',
                flex: 1,
                textAlign: 'left',
                justifyContent: 'center',
              },
              headerTitleAlign: 'left',
            }}
          />
          <Stack.Screen
            name="SearchResultsScreen"
            component={SearchResultsScreen}
            options={{
              title: 'Search Results',
              headerStyle: { backgroundColor: colors.main },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Outfit-Medium',
                textAlign: 'left',
              },
              headerTitleAlign: 'left',
            }}
          />
          <Stack.Screen
            name="ProductDetailPage"
            component={ProductDetailPage}
            options={{ headerShown: false }}
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
            name="UpdateProfileScreen"
            component={UpdateProfileScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddCompanyScreen"
            component={AddCompanyScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="EditCompanyScreen"
            component={EditCompanyScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="UserCompaniesScreen"
            component={UserCompaniesScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TermsConditionsScreen"
            component={TermsConditionsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Cart"
            component={CartScreen}
            options={({ navigation }) => ({
              header: () => (
                <CustomHeader3
                  title="Cart"
                  onBackPress={() => navigation.goBack()} // Handle back button press
                />
              ),
            })}
          />
             <Stack.Screen
            name="Wish"
            component={WishlistScreen}
            options={({ navigation }) => ({
              header: () => (
                <CustomHeader3
                  title="Wishlist"
                  onBackPress={() => navigation.goBack()} // Handle back button press
                />
              ),
            })}
          />
            <Stack.Screen
            name="FAQScreen"
            component={FAQScreen}
            options={({ navigation }) => ({
              header: () => (
                <CustomHeader3
                  title="FAQScreen"
                  onBackPress={() => navigation.goBack()} // Handle back button press
                />
              ),
            })}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SubCategoryScreen"
            component={SubCategoryScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SubCategoryScreen2"
            component={SubCategoryScreen2}
            options={{
              title: 'Subcategory',
              headerStyle: { backgroundColor: colors.main },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Outfit-Medium',
                textAlign: 'left',
              },
              headerTitleAlign: 'left',
            }}
          />
          <Stack.Screen
            name="AllCategoriesScreen"
            component={AllCategoriesScreen}
            options={{
              title: 'Category',
              headerStyle: { backgroundColor: colors.main },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Outfit-Medium',
                textAlign: 'left',
              },
              headerTitleAlign: 'left',
            }}
          />
          <Stack.Screen
            name="OrderSummary"
            component={OrderSummaryScreen}
            options={({ navigation }) => ({
              header: () => (
                <CustomHeader3
                  title="Order Summary"
                  onBackPress={() => navigation.goBack()} // Handle back button press
                />
              ),
            })}
          />
          <Stack.Screen
            name="InvoiceScreen"
            component={InvoiceScreen}
            options={{
              title: 'Invoice Screen',
              headerStyle: { backgroundColor: colors.main },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Outfit-Medium',
                textAlign: 'left',
              },
              headerTitleAlign: 'left',
            }}
          />
          <Stack.Screen
            name="ThankYouScreen"
            component={ThankYouScreen}
            options={{
              title: 'Thank You',
              headerStyle: { backgroundColor: colors.main },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: 'Outfit-Medium',
                textAlign: 'left',
              },
              headerTitleAlign: 'left',
            }}
          />
        </Stack.Navigator>

        {isNavBarVisible && <LeftNavBar toggleNavBar={toggleNavBar} />}
        <Toast />
      </NavigationContainer>
    </CartProvider>
    </WishlistProvider>
    </GestureHandlerRootView>
  );
};

export default App;
