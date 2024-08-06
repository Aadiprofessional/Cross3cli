import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import {launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {colors} from '../styles/color';
import axios from 'axios';

const UpdateProfileScreen = () => {
  const [CompanyName, setCompanyName] = useState('');
  const [OwnerName, setOwnerName] = useState('');
  const [GST, setGST] = useState('');
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
  const route = useRoute();

  // Extract phoneNumber from route params
  const phoneNumber = route.params?.phoneNumber;

  const isValidEmail = email => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const fetchLocationFromPincode = async pincode => {
    try {
      const response = await axios.get(
        `https://api.postalpincode.in/pincode/${pincode}`,
      );
      if (response.data[0].Status === 'Success') {
        const {District, State} = response.data[0].PostOffice[0];
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

  const handleImagePicker = () => {
    launchImageLibrary({mediaType: 'photo'}, async response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.error('ImagePicker Error: ', response.errorMessage);
      } else {
        const {uri} = response.assets[0];
        const filename = uri.substring(uri.lastIndexOf('/') + 1);
        const uploadUri =
          Platform.OS === 'ios' ? uri.replace('file://', '') : uri;

        setLoading(true);

        try {
          await storage()
            .ref('users/' + auth().currentUser.uid + '/' + filename)
            .putFile(uploadUri);

          const url = await storage()
            .ref('users/' + auth().currentUser.uid + '/' + filename)
            .getDownloadURL();

          setProfilePicture(url);
        } catch (error) {
          console.error('Error uploading image: ', error);
        } finally {
          setLoading(false);
        }
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
      // Request to get the orderId
      const otpResponse = await axios.get(
        `https://crossbee-server.vercel.app/sendRegisterOtp?phoneNumber=91${phoneNumber}`,
      );

      const orderId = otpResponse.data.orderId;

      // Request to get custom token
      const response = await axios.post(
        'https://crossbee-server.vercel.app/getRegisterCustomToken',
        {
          phoneNumber: `91${phoneNumber}`,
          companyName: CompanyName,
          gst: GST,
          email: email,
          address: mainAddress,
          ownerName: OwnerName,
          orderId: orderId, // Add orderId to the request
        },
      );

      if (response.data && response.data.token) {
        navigation.navigate('OTPscreen', {
          token: response.data.token,
          orderId: orderId, // Pass orderId to OTPscreen
          phoneNumber,
        });
      } else {
        Alert.alert('Error', 'Failed to get custom token.');
      }
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
        <ActivityIndicator size="large" color="#FCCC51" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
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
            <Image source={{uri: profilePicture}} style={styles.profileImage} />
          ) : (
            <Icon name="person" size={100} color="#ccc" />
          )}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Company Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Company Name"
            placeholderTextColor={colors.placeholder}
            value={CompanyName}
            onChangeText={setCompanyName}
          />
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder={phoneNumber}
            placeholderTextColor={colors.placeholder}
            editable={false} // Set to false to avoid user editing
          />
          <Text style={styles.label}>Owner Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Owner Name"
            placeholderTextColor={colors.placeholder}
            value={OwnerName}
            onChangeText={setOwnerName}
          />
          <Text style={styles.label}>GST</Text>
          <TextInput
            style={styles.input}
            placeholder="GST"
            placeholderTextColor={colors.placeholder}
            value={GST}
            onChangeText={setGST}
          />
          <Text style={styles.label}>Main Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Main Address"
            placeholderTextColor={colors.placeholder}
            value={mainAddress}
            onChangeText={setMainAddress}
          />
          <Text style={styles.label}>Optional Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Optional Address"
            placeholderTextColor={colors.placeholder}
            value={optionalAddress}
            onChangeText={setOptionalAddress}
          />
          <Text style={styles.label}>Pincode</Text>
          <TextInput
            style={styles.input}
            placeholder="Pincode"
            placeholderTextColor={colors.placeholder}
            value={pincode}
            onChangeText={setPincode}
            keyboardType="numeric"
          />
          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            placeholder="City"
            placeholderTextColor={colors.placeholder}
            value={city}
            editable={false}
          />
          <Text style={styles.label}>State</Text>
          <TextInput
            style={styles.input}
            placeholder="State"
            placeholderTextColor={colors.placeholder}
            value={state}
            editable={false}
          />
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colors.placeholder}
            value={email}
            onChangeText={setEmail}
          />
          <Text style={styles.label}>Gender</Text>
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={styles.genderOption}
              onPress={() => setGender('Male')}>
              <View
                style={[
                  styles.radioDot,
                  gender === 'Male' && {backgroundColor: colors.main},
                ]}
              />
              <Text style={styles.genderText}>Male</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.genderOption}
              onPress={() => setGender('Female')}>
              <View
                style={[
                  styles.radioDot,
                  gender === 'Female' && {backgroundColor: colors.main},
                ]}
              />
              <Text style={styles.genderText}>Female</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.genderOption}
              onPress={() => setGender('Other')}>
              <View
                style={[
                  styles.radioDot,
                  gender === 'Other' && {backgroundColor: colors.main},
                ]}
              />
              <Text style={styles.genderText}>Other</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={handleImagePicker}
            style={styles.imagePickerButton}>
            <Text style={styles.PickerText}>Upload Image</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, {backgroundColor: colors.main}]}
            onPress={handleUpdateProfile}>
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
    color: colors.textPrimary,
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    color: colors.textPrimary,
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
    marginRight: 15,
    color: colors.textPrimary,
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
