import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { colors } from '../styles/color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { data } from '../data/data'; // Adjust the path accordingly

const ProfileScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const rewardPoints = 100; // Replace this with the actual reward points you have

  useEffect(() => {
    const fetchPhoneNumber = async () => {
      const savedPhoneNumber = await AsyncStorage.getItem('phoneNumber');
      setPhoneNumber(savedPhoneNumber || 'N/A');
    };

    fetchPhoneNumber();
  }, []);

  const rewardPointsValue = data.rewardPointsPrice;

  const options = [
    {
      icon: require('../assets/icon1.png'),
      text: 'Register your Company',
      screen: 'RegisterCompanyScreen',
    },
    {
      icon: require('../assets/icon2.png'),
      text: 'Terms and Condition',
      screen: 'TermsConditionsScreen',
    },
    {
      icon: require('../assets/icon3.png'),
      text: 'Privacy and policy',
      screen: 'PrivacyPolicyScreen',
    },
    {
      icon: require('../assets/icon4.png'),
      text: 'Contact us',
      screen: 'NeedHelp',
    },
    {
      icon: require('../assets/icon5.png'),
      text: 'Log out',
      screen: '', // No direct screen for logout
    },
  ];

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('loggedIn');
      await AsyncStorage.removeItem('phoneNumber'); // Clear phone number
      // Clear the navigation stack and navigate to OTPVerificationScreen
      navigation.reset({
        index: 0,
        routes: [{ name: 'OTPVerification' }],
      });
      Alert.alert('Logged Out', 'You have been successfully logged out.');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={require('../assets/profile.png')}
          style={styles.profileImage}
        />
        <View style={styles.profileTextContainer}>
          <Text style={styles.nameText}>Your Name</Text>
          <Text style={styles.newText}>Mobile:</Text>
          <Text style={styles.mobileText}>
            {phoneNumber ? `+91 ${phoneNumber}` : 'N/A'}
          </Text>
          <Text style={styles.rewardPointsText}>
            Reward Points: {rewardPoints} ({rewardPointsValue.toFixed(2)} INR)
          </Text>
        </View>
        <Image
          source={require('../assets/profile2.png')}
          style={styles.profileImage2}
        />
      </View>

      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={styles.optionContainer}
          onPress={() => {
            if (option.text === 'Log out') {
              handleLogout();
            } else {
              navigation.navigate(option.screen);
            }
          }}
        >
          <Image source={option.icon} style={styles.optionIcon} />
          <Text style={styles.optionText}>{option.text}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    marginBottom: 20,
    marginLeft: 5,
    marginRight: 5,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  profileTextContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.TextBlack,
  },
  newText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 5,
    color: colors.TextBlack,
  },
  mobileText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 5,
    color: colors.TextBlack,
  },
  rewardPointsText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
    color: colors.TextBlack,
  },
  profileImage2: {
    width: 80,
    height: 80,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    marginBottom: 10,
    marginLeft: 5,
    marginRight: 5,
  },
  optionIcon: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.TextBlack,
  },
});

export default ProfileScreen;
