import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, Image, TouchableOpacity, Animated, TouchableWithoutFeedback, Linking } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomHeader from '../components/CustomHeader';
import AutoImageSlider from '../components/AutoImageSlider';
import HelpBox from '../components/HelpBox';
import Categories from '../components/Categories';
import { colors } from '../styles/color';
import AutoImageSlider2 from '../components/AutoImageSlider2';
import BestDeals from '../components/BestDeals';
import LatestProducts from '../components/LatestProducts';
import UpcomingProducts from '../components/UpcomingProducts';
import CartScreen from './CartScreen';
import ProfileScreen from './ProfileScreen';
import QuotesScreen from './QuotesScreen';
import LeftNavBar from '../components/LeftNavBar';

const Tab = createMaterialBottomTabNavigator();

const HomeContent = () => {
  const handleWhatsAppPress = () => {
    const url = 'whatsapp://send?phone=9289881135';
    Linking.openURL(url).catch(() => {
      alert('Make sure WhatsApp is installed on your device');
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <AutoImageSlider />
        <View style={styles.backgroundContainer}>
          <View style={styles.topHalf} />
          <View style={styles.bottomHalf} />
          <HelpBox style={styles.helpBox} />
          <Categories style={styles.categories} />
          <Text style={styles.title}>Only For App Deals</Text>
          <AutoImageSlider2 />
          <BestDeals />
          <UpcomingProducts />
          <LatestProducts />
        </View>
        <View style={styles.endTextContainer}>
          <Text style={styles.endText}>India's best</Text>
          <Text style={styles.endText}>
            delivery app<Text style={styles.emoji}>❤️</Text>
          </Text>
          <View style={styles.line} />
          <Text style={styles.crossBee}>CrossBee</Text>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.whatsappButton} onPress={handleWhatsAppPress}>
        <View style={styles.whatsappIcon}>
          <Image source={require('../assets/whatsapp.png')} style={styles.whatsappIconImage} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const HomeScreen = () => {
  const [isNavBarVisible, setNavBarVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-250));

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
            <Animated.View style={[styles.navContainer, { transform: [{ translateX: slideAnim }] }]}>
              <LeftNavBar toggleNavBar={toggleNavBar} />
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      )}
      <View style={styles.contentContainer}>
        <CustomHeader toggleNavBar={toggleNavBar} />
        <Tab.Navigator
          initialRouteName="HomeContent"
          activeColor={colors.main}
          inactiveColor="#8A8A8A"
          barStyle={{ backgroundColor: '#FFFFFF' }}
        >
          <Tab.Screen
            name="HomeContent"
            component={HomeContent}
            options={{
              tabBarIcon: ({ color }) => <Icon name="home-outline" color={color} size={22} />,
              tabBarLabel: 'Home',
            }}
          />
          <Tab.Screen
            name="Quotes"
            component={QuotesScreen}
            options={{
              tabBarIcon: ({ color }) => <Icon name="document-outline" color={color} size={22} />,
              tabBarLabel: 'Quotes',
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
        </Tab.Navigator>
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
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backgroundContainer: {
    position: 'relative',
  },
  topHalf: {
    backgroundColor: colors.main,
    height: '5%',
  },
  bottomHalf: {
    backgroundColor: '#FFFFFF',
    height: '5%',
  },
  helpBox: {
    marginBottom: 0,
  },
  categories: {
    marginTop: 0,
    marginBottom: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 1,
    marginLeft: 15,
    color: colors.TextBlack,
  },
  autoImageSlider2: {
    marginTop: 0,
  },
  endTextContainer: {
    alignItems: 'left',
    marginTop: 1,
    marginLeft: 10,
  },
  endText: {
    fontSize: 40,
    fontWeight: 'bold',
    opacity: 0.1,
    color: colors.TextBlack,
  },
  emoji: {
    fontSize: 40,
    opacity: 1,
  },
  line: {
    width: '90%',
    height: 1,
    backgroundColor: '#000',
    marginVertical: 10,
    opacity: 0.1,
  },
  crossBee: {
    fontSize: 24,
    fontWeight: '600',
    opacity: 0.1,
    marginBottom: 200,
    color: colors.TextBlack,
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
  whatsappButton: {
    position: 'absolute',
    bottom: 20,
    right: 15,
    zIndex: 10,
  },
  whatsappIcon: {
    width:60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#25D366',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  whatsappIconImage: {
    width: 40,
    height: 40,
  },
});

export default HomeScreen;
