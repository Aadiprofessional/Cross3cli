import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Button,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import { colors } from '../styles/color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import axios from 'axios'; // Import axios for making API requests
import { Modal } from 'react-native';

const ProfileScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userName, setUserName] = useState('Your Name');
  const [rewardPoints, setRewardPoints] = useState('0');
  const [profileImage, setProfileImage] = useState(null);
  const [billing, setBilling] = useState({});

  const [withdrawClicks, setWithdrawClicks] = useState(0); // State to track withdraw button clicks
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const [withdrawAmount, setWithdrawAmount] = useState('');

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
                setBilling(userData.billing || {});
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

  const uploadProfileImage = async (uri) => {
    try {
      const user = auth().currentUser;
      if (user && uri) {
        // Create a reference for Firebase Storage
        const storageRef = storage().ref(`users/${user.uid}/profilePicture.jpg`);

        // Upload the file to the storage reference
        const task = storageRef.putFile(uri);

        // Monitor the task for completion
        await task;

        // Get the downloadable URL
        const downloadURL = await storageRef.getDownloadURL();

        // Store the download URL in Firestore
        const firestoreRef = firestore().collection('users').doc(user.uid);
        await firestoreRef.set(
          {
            profilePicture: downloadURL,
          },
          { merge: true }
        );

        // Update UI with the new profile image URL
        setProfileImage(downloadURL);
        Alert.alert('Success', 'Profile image updated successfully.');
      }
    } catch (error) {
      console.error('Failed to upload image: ', error);
      Alert.alert('Error', 'Failed to upload image. Please try again.');
    }
  };


  const handleWithdrawClick = () => {
    setModalVisible(true); // Show the modal
  };

  const handleWithdrawSubmit = async () => {
    if (Number(withdrawAmount) <= Number(rewardPoints)) {
      try {
        const uid = auth().currentUser.uid; // Assuming you're using Firebase Auth to get the current user's UID

        await axios.post('https://crossbee-server-1036279390366.asia-south1.run.app/withdraw', {
          uid: uid,
          amount: withdrawAmount // Send the amount in the body of the request
        });

        setWithdrawClicks(prev => prev + 1); // Increment the click count
        setModalVisible(false); // Close the modal
        setWithdrawAmount(''); // Clear the input field
        Alert.alert('Success', 'Withdraw request sent successfully.');
      } catch (error) {
        console.error('Failed to send withdraw request: ', error);
        Alert.alert('Error', 'Failed to send withdraw request. Please try again.');
      }
    } else {
      Alert.alert('Error', 'Withdraw amount exceeds reward points.');
    }
  };

  const handleWithdrawCancel = () => {
    setModalVisible(false); // Close the modal
  };


  const options = [
    {
      iconName: 'wallet-outline',
      text: `Wallet: ${rewardPoints}`,
      screen: 'AddTransactionScreen',
      button: (
        <TouchableOpacity
          style={styles.withdrawButton}
          onPress={handleWithdrawClick}>
          <Text style={styles.withdrawButtonText}>Withdraw</Text>
        </TouchableOpacity>
      ),
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
      iconName: 'account-question-outline',
      text: 'FAQ',
      screen: 'FAQScreen',
    },
    {
      iconName: 'tag-heart-outline',
      text: 'Wishlist',
      screen: 'Wish',
    },
    {
      iconName: 'email-outline',
      text: 'Customer Support',
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
      await AsyncStorage.removeItem('loggedIn');
      await AsyncStorage.removeItem('phoneNumber');
      await auth().signOut();

      console.log('Signed out successfully.');

      navigation.reset({
        index: 0,
        routes: [{ name: 'OTPVerification' }],
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  const handleWithdrawAll = async () => {
    try {
      const uid = auth().currentUser.uid; // Get current user's UID
      const fullAmount = rewardPoints; // Withdraw the full amount of reward points

      await axios.post('https://crossbee-server-1036279390366.asia-south1.run.app/withdraw', {
        uid: uid,
        amount: fullAmount, // Send the full amount
      });

      setWithdrawClicks(prev => prev + 1); // Increment the click count
      setModalVisible(false); // Close the modal
      setWithdrawAmount(''); // Clear the input field
      Alert.alert('Success', 'Withdraw request for full amount sent successfully.');
    } catch (error) {
      console.error('Failed to send withdraw request: ', error);
      Alert.alert('Error', 'Failed to send withdraw request. Please try again.');
    }
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={handleImagePicker}>
          <Image
            source={
              profileImage
                ? { uri: profileImage }
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

      {/* Card with Virtual ID, IFSC, Branch Name */}
      <TouchableOpacity
        style={styles.cardContainer}
        onPress={() => {
          if (billing.virtualId && billing.virtualId !== 'pending') {
            navigation.navigate('AddTransactionScreen');
          } else {
            Alert.alert('Info', 'Virtual ID is pending.');
          }
        }}>
        <Text style={styles.cardText}>Virtual Id: {billing.virtualId || 'pending'}</Text>
        <Text style={styles.cardText}>IFSC: {billing.ifsc || 'pending'}</Text>
        <Text style={styles.cardText}>Branch Name: {billing.branch || 'pending'}</Text>
      </TouchableOpacity>

      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.optionContainer,
            option.text === 'Log out' ? { marginBottom: 50 } : null, // Add gap below the Log out button
          ]}
          onPress={() => {
            if (option.text === 'Log out') {
              handleLogout();
            } else if (option.screen) {
              // Remove the condition for Customer Support
              navigation.navigate(option.screen);
            }
          }}>
          <Icon
            name={option.iconName}
            size={40}
            color="#333333"
            style={styles.optionIcon}
          />
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionText}>{option.text}</Text>
            {option.button && option.button}
          </View>
        </TouchableOpacity>
      ))}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Withdraw Amount</Text>
            <TextInput
              style={[styles.modalInput, { color: 'black', fontFamily: 'Outfit-Medium' }]}
              keyboardType="numeric"
              value={withdrawAmount}
              onChangeText={setWithdrawAmount}
              placeholder="Enter amount"
              placeholderTextColor="black" // Set placeholder text color
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.button} onPress={handleWithdrawCancel}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleWithdrawAll}>
                <Text style={styles.buttonText}>Withdraw All</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleWithdrawSubmit}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  button: {
    backgroundColor: colors.second, // Button color
    padding: 10,
    borderRadius: 5, // Rounded corners
    elevation: 2, // Shadow effect for Android
    shadowColor: '#000', // Shadow color for iOS
    shadowOffset: { width: 0, height: 1 }, // Shadow offset
    shadowOpacity: 0.2, // Shadow opacity
    shadowRadius: 1.5, // Shadow blur radius
  },
  buttonText: {
    color: '#FFFFFF', // Text color
    textAlign: 'center', // Center text
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
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontFamily: 'Outfit-Medium',
    color: colors.TextBlack,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontFamily: 'Outfit-Medium',
    color: '#ffff',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameText: {
    fontSize: 24,
    fontFamily: 'Outfit-Medium',
    color: colors.TextBlack,
  },
  newText: {
    fontSize: 14,
    fontFamily: 'Outfit-Medium',
    marginTop: 5,
    color: colors.TextBlack,
  },
  mobileText: {
    fontSize: 14,
    fontFamily: 'Outfit-Medium',
    marginTop: 5,
    color: colors.TextBlack,
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
    justifyContent: 'space-between', // Ensure space between text and button
  },
  optionIcon: {
    marginRight: 15,
  },
  optionTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    color: colors.TextBlack,
  },
  withdrawButton: {
    backgroundColor: colors.second,
    borderRadius: 5,
    paddingVertical: 5, // Smaller padding
    paddingHorizontal: 10, // Smaller padding
  },
  withdrawButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 12, // Smaller font size
    fontFamily: 'Outfit-Medium',
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  cardText: {
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    color: '#333',
    marginBottom: 5,
  },
});

export default ProfileScreen;