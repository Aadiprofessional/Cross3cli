import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {colors} from '../styles/color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore'; // Import Firestore
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';

const ProfileScreen = ({navigation}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userName, setUserName] = useState('Your Name'); // Default value
  const [profileImage, setProfileImage] = useState(null); // State for profile image
  const rewardPoints = 100; // Replace this with the actual reward points you have

  useEffect(() => {
    const fetchPhoneNumber = async () => {
      const savedPhoneNumber = await AsyncStorage.getItem('phoneNumber');
      setPhoneNumber(savedPhoneNumber || 'N/A');
    };

    const unsubscribeUserData = async () => {
      try {
        const user = auth().currentUser;
        if (user) {
          // Use Firestore's onSnapshot to listen for real-time updates
          const unsubscribe = firestore()
            .collection('users')
            .doc(user.uid)
            .onSnapshot(docSnapshot => {
              const userData = docSnapshot.data();
              if (userData) {
                setUserName(userData.name || 'Your Name');
                setProfileImage(userData.profilePicture || null);
              }
            });

          // Return the unsubscribe function
          return unsubscribe;
        }
      } catch (error) {
        console.error('Error fetching user data: ', error);
        setUserName('Your Name'); // Fallback value
      }
    };

    fetchPhoneNumber();
    const unsubscribe = unsubscribeUserData();

    // Cleanup function for the useEffect
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe(); // Correctly call unsubscribe
      }
    };
  }, []);

  const rewardPointsValue = 100; // Assuming this is fetched or defined somewhere

  const options = [
    {
      iconName: 'office-building-outline', // Outlined icon for "Register your Company"
      text: 'Add your Company',
      screen: 'UserCompaniesScreen',
    },
    {
      iconName: 'file-document-outline', // Outlined icon for "Terms and Conditions"
      text: 'Terms and Conditions',
      screen: 'TermsConditionsScreen',
    },
    {
      iconName: 'shield-lock-outline', // Outlined icon for "Privacy Policy"
      text: 'Privacy and Policy',
      screen: 'PrivacyPolicyScreen',
    },
    {
      iconName: 'email-outline', // Outlined icon for "Contact us"
      text: 'Contact us',
      screen: 'NeedHelp',
    },
    {
      iconName: 'logout', // Outlined icon for "Log out"
      text: 'Log out',
      screen: '', // No direct screen for logout
    },
  ];

  const handleLogout = async () => {
    try {
      const user = auth().currentUser;
      if (user) {
        await auth().signOut(); // Sign out from Firebase Authentication
        await AsyncStorage.removeItem('loggedIn');
        await AsyncStorage.removeItem('phoneNumber'); // Clear phone number
        // Clear the navigation stack and navigate to OTPVerificationScreen
        navigation.reset({
          index: 0,
          routes: [{name: 'OTPVerification'}],
        });
        Alert.alert('Logged Out', 'You have been successfully logged out.');
      } else {
        console.error('No user is currently signed in.');
        Alert.alert('Error', 'No user is currently signed in.');
      }
    } catch (error) {
      console.error('Logout failed', error);
      Alert.alert('Error', 'Logout failed. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={
            profileImage
              ? {uri: profileImage}
              : require('../assets/profile.png')
          } // Conditional rendering
          style={styles.profileImage}
        />
        <View style={styles.profileTextContainer}>
          <Text style={styles.nameText}>{userName || 'N/A'}</Text>
          <Text style={styles.newText}>
            Mobile:{' '}
            <Text style={styles.mobileText}>
              {phoneNumber ? `+91 ${phoneNumber}` : 'N/A'}
            </Text>
          </Text>

          <Text style={styles.rewardPointsText}>
            Reward Points: {rewardPoints}
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
          }}>
          <Icon
            name={option.iconName}
            size={40}
            color="#333333"
            style={styles.optionIcon}
          />
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
    shadowOffset: {width: 0, height: 2},
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
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    marginBottom: 10,
    marginLeft: 5,
    marginRight: 5,
  },
  optionIcon: {
    marginRight: 15,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.TextBlack,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen;
