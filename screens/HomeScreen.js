import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // Import bottom tab navigator
import Icon from 'react-native-vector-icons/Ionicons';
import CustomHeader from '../components/CustomHeader';
import WhatsAppButton from '../components/WhatsAppButton';
import LeftNavBar from '../components/LeftNavBar';
import HomeContent from './HomeContent';
import CartScreen from './CartScreen';
import ProfileScreen from './ProfileScreen';
import QuotesScreen from './QuotesScreen';
import { useCart } from '../components/CartContext';
import { Text } from 'react-native-paper';
import CustomTabBar from '../components/CustomTabBar'; // Import custom tab bar

const Tab = createBottomTabNavigator(); // Use bottom tab navigator

const HomeScreen = () => {
  const [isNavBarVisible, setNavBarVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-250));
  const { cartItemCount } = useCart(); // Access cart item count from context

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
          screenOptions={{
            headerShown: false, // Hide the default header added by the bottom tab navigator
            tabBarActiveTintColor: '#FFB800', // Change to your desired active color
            tabBarInactiveTintColor: '#8A8A8A',
            tabBarStyle: {
              backgroundColor: '#FFFFFF',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              elevation: 0, // Remove elevation if it's adding extra space
              borderTopWidth: 0, // Remove border if it's adding space
            },
            tabBarLabelStyle: { display: 'none' }, // Hide labels
          }}
          tabBar={props => <CustomTabBar {...props} />} // Use custom tab bar
        >
          <Tab.Screen
            name="Home"
            component={HomeContent}
            options={{
              tabBarIcon: ({ color }) => (
                <Icon name="home-outline" color={color} size={26} />
              ),
            }}
          />
          <Tab.Screen
            name="Quotes"
            component={QuotesScreen}
            options={{
              tabBarIcon: ({ color }) => (
                <Icon name="document-outline" color={color} size={26} />
              ),
            }}
          />
          <Tab.Screen
            name="Cart"
            component={CartScreen}
            options={{
              tabBarIcon: ({ color }) => (
                <View>
                  <Icon name="cart-outline" color={color} size={26} />
                  {cartItemCount > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{cartItemCount}</Text>
                    </View>
                  )}
                </View>
              ),
            }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              tabBarIcon: ({ color }) => (
                <Icon name="person-outline" color={color} size={26} />
              ),
            }}
          />
        </Tab.Navigator>
        <WhatsAppButton />
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
  badge: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Outfit-Regular',
  },
});

export default HomeScreen;
