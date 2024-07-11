import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../styles/color';

const ProfileScreen = ({navigation}) => {
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
      screen: 'LoginScreen',
    },
  ];

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
          <Text style={styles.mobileText}>+91 0504353435</Text>
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
          onPress={() => navigation.navigate(option.screen)}>
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
    backgroundColor: '#fff', // Adjust as per your app's theme
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff', // Background color of the rounded rectangle
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    marginBottom: 20,
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
    fontWeight: '600', // semi-bold
    color: colors.TextBlack,
  },
  newText: {
    fontSize: 14,
    fontWeight: '600', // semi-bold
    marginTop: 5,
    color: colors.TextBlack,
  },
  mobileText: {
    fontSize: 14,
    fontWeight: '600', // semi-bold
    marginTop: 5,
    color: colors.TextBlack,
  },
  profileImage2: {
    width: 80,
    height: 80,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff', // Background color of the option boxes
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    marginBottom: 10,
  },
  optionIcon: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600', // semi-bold
    color: colors.TextBlack,
  },
});

export default ProfileScreen;
