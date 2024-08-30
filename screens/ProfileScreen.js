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
import {launchImageLibrary} from 'react-native-image-picker';
import {colors} from '../styles/color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';

const ProfileScreen = ({navigation}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userName, setUserName] = useState('Your Name');
  const [rewardPoints, setRewardPoints] = useState('0');
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchPhoneNumber = async () => {
      const savedPhoneNumber = await AsyncStorage.getItem('phoneNumber');
      setPhoneNumber(savedPhoneNumber || 'N/A');
    };

    const unsubscribeUserData = async () => {
      try {
        const user = auth().currentUser;
        if (user) {
          const unsubscribe = firestore()
            .collection('users')
            .doc(user.uid)
            .onSnapshot(docSnapshot => {
              const userData = docSnapshot.data();
              if (userData) {
                setUserName(userData.name || 'Your Name');
                setRewardPoints(userData.rewardPoints || '0');
                setProfileImage(userData.profilePicture || null);
              }
            });

          return unsubscribe;
        }
      } catch (error) {
        console.error('Error fetching user data: ', error);
        setUserName('Your Name');
        setRewardPoints('0');
      }
    };

    fetchPhoneNumber();
    const unsubscribe = unsubscribeUserData();

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const handleImagePicker = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const uri = response.assets[0].uri;
        uploadProfileImage(uri);
      }
    });
  };

  const uploadProfileImage = async uri => {
    try {
      const user = auth().currentUser;
      if (user && uri) {
        const storageRef = firestore().collection('users').doc(user.uid);

        await storageRef.set(
          {
            profilePicture: uri,
          },
          {merge: true},
        );

        setProfileImage(uri);
        Alert.alert('Success', 'Profile image updated successfully.');
      }
    } catch (error) {
      console.error('Failed to upload image: ', error);
      Alert.alert('Error', 'Failed to upload image. Please try again.');
    }
  };

  const options = [
    {
      iconName: 'star-outline',
      text: `Reward Points: ${rewardPoints}`,
      screen: null,
    },
    {
      iconName: 'office-building-outline',
      text: 'Manage Companies',
      screen: 'UserCompaniesScreen',
    },
    {
      iconName: 'file-document-outline',
      text: 'Terms and Conditions',
      screen: 'TermsConditionsScreen',
    },
    {
      iconName: 'shield-lock-outline',
      text: 'Privacy and Policy',
      screen: 'PrivacyPolicyScreen',
    },
    {
      iconName: 'email-outline',
      text: 'Contact us',
      screen: 'NeedHelp',
    },
    {
      iconName: 'logout',
      text: 'Log out',
      screen: '',
    },
  ];

  const handleLogout = async () => {
    try {
      // Clear AsyncStorage to remove any stored login information
      await AsyncStorage.removeItem('loggedIn');
      await AsyncStorage.removeItem('phoneNumber');

      // Sign out from Firebase
      await auth().signOut();

      console.log('Signed out successfully.');

      // Reset navigation to OTPVerification screen
      navigation.reset({
        index: 0,
        routes: [{name: 'OTPVerification'}],
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={handleImagePicker}>
          <Image
            source={
              profileImage
                ? {uri: profileImage}
                : require('../assets/profile.png')
            }
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <View style={styles.profileTextContainer}>
          <Text style={styles.nameText}>{userName}</Text>
          <Text style={styles.newText}>
            Mobile:{' '}
            <Text style={styles.mobileText}>
              {phoneNumber ? `+91 ${phoneNumber}` : 'N/A'}
            </Text>
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
              handleLogout(); // Ensure this is called directly
            } else if (option.screen) {
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
  profileImage2: {
    width: 80,
    height: 80,
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
});

export default ProfileScreen;
