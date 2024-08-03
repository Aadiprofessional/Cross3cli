import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { launchImageLibrary } from 'react-native-image-picker'; // Updated import
import Icon from 'react-native-vector-icons/MaterialIcons'; // Default icon
import { colors } from '../styles/color';
import axios from 'axios';

const UpdateProfileScreen = () => {
  const [name, setName] = useState('');
  const [mainAddress, setMainAddress] = useState('');
  const [optionalAddress, setOptionalAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  // Function to validate email
  const isValidEmail = email => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Function to detect city and state from pincode
  const fetchLocationFromPincode = async (pincode) => {
    try {
      const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
      if (response.data[0].Status === 'Success') {
        const { District, State } = response.data[0].PostOffice[0];
        setCity(District);
        setState(State);
      } else {
        setCity('');
        setState('');
      }
    } catch (error) {
      console.error('Error fetching location: ', error);
    }
  };

  useEffect(() => {
    if (pincode.length === 6) {
      fetchLocationFromPincode(pincode);
    }
  }, [pincode]);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const user = auth().currentUser;
        if (user) {
          const userDoc = await firestore().collection('users').doc(user.uid).get();
          const userData = userDoc.data();
          if (userData) {
            setName(userData.name || '');
            setMainAddress(userData.mainAddress || '');
            setOptionalAddress(userData.optionalAddress || '');
            setPincode(userData.pincode || '');
            setCity(userData.city || '');
            setState(userData.state || '');
            setEmail(userData.email || '');
            setGender(userData.gender || '');
            setProfilePicture(userData.profilePicture || null);
          }
        }
      } catch (error) {
        console.error('Error fetching user data: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleImagePicker = () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.error('ImagePicker Error: ', response.errorMessage);
      } else {
        setProfilePicture(response.assets[0].uri);
      }
    });
  };

  const handleUpdateProfile = async () => {
    if (!isValidEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const user = auth().currentUser;
      if (!user) {
        console.error('User not authenticated');
        setLoading(false);
        return;
      }

      await firestore().collection('users').doc(user.uid).set({
        name,
        mainAddress,
        optionalAddress,
        pincode,
        city,
        state,
        email,
        gender,
        profilePicture,
      });

      Alert.alert('Profile Updated', 'Your profile has been updated successfully.');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating profile: ', error);
      Alert.alert('Error', 'There was a problem updating your profile.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color= '#FCCC51' />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
          {/* Use Feather icon for back button */}
          <Icon
            name="arrow-back"
            size={24}
            color="#FFFFFF"
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Update Profile</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.profileImageContainer}>
          {profilePicture ? (
            <Image source={{ uri: profilePicture }} style={styles.profileImage} />
          ) : (
            <Icon name="person" size={100} color="#ccc" />
          )}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <Text style={styles.label}>Main Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Main Address"
            value={mainAddress}
            onChangeText={setMainAddress}
          />
          <Text style={styles.label}>Optional Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Optional Address"
            value={optionalAddress}
            onChangeText={setOptionalAddress}
          />
          <Text style={styles.label}>Pincode</Text>
          <TextInput
            style={styles.input}
            placeholder="Pincode"
            value={pincode}
            onChangeText={setPincode}
            keyboardType="numeric"
          />
          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            placeholder="City"
            value={city}
            editable={false}
          />
          <Text style={styles.label}>State</Text>
          <TextInput
            style={styles.input}
            placeholder="State"
            value={state}
            editable={false}
          />
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <Text style={styles.label}>Gender</Text>
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={styles.genderOption}
              onPress={() => setGender('Male')}
            >
              <View style={[styles.radioDot, gender === 'Male' && { backgroundColor: colors.main }]} />
              <Text style={styles.genderText}>Male</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.genderOption}
              onPress={() => setGender('Female')}
            >
              <View style={[styles.radioDot, gender === 'Female' && { backgroundColor: colors.main }]} />
              <Text style={styles.genderText}>Female</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.genderOption}
              onPress={() => setGender('Other')}
            >
              <View style={[styles.radioDot, gender === 'Other' && { backgroundColor: colors.main }]} />
              <Text style={styles.genderText}>Other</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handleImagePicker} style={styles.imagePickerButton}>
            <Text style={styles.PickerText}>Upload Image</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.main }]}
            onPress={handleUpdateProfile}
          >
            <Text style={styles.buttonText}>Update Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.main,
    paddingVertical: 20,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1, // Make sure the header is above the scrollable content
  },
  backButton: {
    marginRight: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollView: {
    paddingTop: 70, // Adjust the top padding to avoid overlap with the header
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  inputContainer: {
    paddingBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
   
    marginBottom: 20,
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
   
  },
  radioDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.main,
    marginRight: 5,
  },
  genderText: {
    fontSize: 16,
    marginRight :  15,
  },
  imagePickerButton: {
    backgroundColor: colors.lightGrey,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  PickerText: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UpdateProfileScreen;
