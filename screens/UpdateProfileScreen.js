import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { colors } from '../styles/color';

const UpdateProfileScreen = () => {
  const [CompanyName, setCompanyName] = useState('');
  const [OwnerName, setOwnerName] = useState('');
  const [GST, setGST] = useState('');
  const [mainAddress, setMainAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [email, setEmail] = useState('');
  const [alternateNumber, setAlternateNumber] = useState(''); // New alternate number state
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();

  // Extract phoneNumber from route params
  const phoneNumber = route.params?.phoneNumber;

  // Check if all required fields are filled
  const isFormValid = () => {
    return (
      CompanyName &&
      OwnerName &&
      GST &&
      mainAddress &&
      email &&
      pincode.length === 6
    );
  };

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

  const handleUpdateProfile = async () => {
    if (!isFormValid()) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      // Request to get the orderId
      const otpResponse = await axios.get(
        `https://crossbee-server-1036279390366.asia-south1.run.app/sendRegisterOtp?phoneNumber=91${phoneNumber}`,
      );

      const orderId = otpResponse.data.orderId;

      // Navigate to OTP screen with necessary data
      navigation.navigate('OTPscreen', {
        phoneNumber: `91${phoneNumber}`,
        alternateNumber: alternateNumber, // Passing the alternate number
        orderId: orderId,
        companyName: CompanyName,
        gst: GST,
        email: email,
        address: `${mainAddress},${city}, ${state} ${pincode}`,
        ownerName: OwnerName,
      });
    } catch (error) {
      console.error('Error updating profile: ', error);
      Alert.alert('Error', 'There was a problem updating your profile.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFB800" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Update Profile</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            Company Name <Text style={styles.requiredStar}>*</Text>
          </Text>
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
          <Text style={styles.label}>Alternate Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Alternate Number"
            placeholderTextColor={colors.placeholder}
            value={alternateNumber}
            onChangeText={setAlternateNumber} // Allow user to input alternate number
            keyboardType="numeric"
            maxLength={10}
          />
          <Text style={styles.label}>
            Owner Name <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Owner Name"
            placeholderTextColor={colors.placeholder}
            value={OwnerName}
            onChangeText={setOwnerName}
          />
          <Text style={styles.label}>
            GST <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="GST"
            placeholderTextColor={colors.placeholder}
            value={GST}
            onChangeText={setGST}
            maxLength={15}
          />
          <Text style={styles.label}>
            Main Address <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Main Address"
            placeholderTextColor={colors.placeholder}
            value={mainAddress}
            onChangeText={setMainAddress}
          />
          <Text style={styles.label}>
            Pincode <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Pincode"
            placeholderTextColor={colors.placeholder}
            value={pincode}
            onChangeText={setPincode}
            keyboardType="numeric"
            maxLength={6}
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
          <Text style={styles.label}>
            Email <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colors.placeholder}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>
        <TouchableOpacity
          style={styles.updateButton}
          onPress={handleUpdateProfile}>
          <Text style={styles.updateButtonText}>Update Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: colors.main,
    paddingTop: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Outfit-Regular',
  },
  scrollView: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 4,
    fontFamily: 'Outfit-Medium',
    color: '#333',
  },
  requiredStar: {
    color: 'red',
  },
  input: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    color: '#333',
  },
  updateButton: {
    backgroundColor: colors.main,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
  },
});

export default UpdateProfileScreen;
