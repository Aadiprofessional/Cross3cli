import React, {useState, useEffect} from 'react';
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
import {useNavigation, useRoute} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Feather';
import {colors} from '../styles/color';

const EditCompanyScreen = () => {
  const [companyName, setCompanyName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [gst, setGst] = useState('');
  const [mainAddress, setMainAddress] = useState('');
  const [optionalAddress, setOptionalAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const {company} = route.params;

  // Load existing company data
  useEffect(() => {
    if (company) {
      const addressParts = company.address.split(',');
      const addressMain = addressParts[0];
      const addressOptional = addressParts[1] || '';
      const addressSubParts = (addressParts[1] || '').split('-');
      const addressPincode = addressSubParts[1]?.trim().split(' ')[1] || '';
      const addressCity = addressSubParts[0] || '';
      const addressState = addressSubParts[1]?.split(',')[1] || '';

      setCompanyName(company.name);
      setOwnerName(company.owner);
      setGst(company.gst);
      setMainAddress(addressMain);
      setOptionalAddress(addressOptional);
      setPincode(addressPincode);
      setCity(addressCity);
      setState(addressState);
      setEmail(company.email);
      setPhoneNumber(company.phoneNumber.replace(/^\+91/, '')); // Remove +91 if present
    }
  }, [company]);

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

  const handleSaveCompany = async () => {
    if (
      !companyName ||
      !ownerName ||
      !gst ||
      !mainAddress ||
      !email ||
      pincode.length !== 6 ||
      phoneNumber.length !== 10
    ) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return;
    }

    const isValidEmail = email => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    };

    if (!isValidEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const uid = auth().currentUser.uid;
      const response = await axios.post(
        'https://crossbee-server.vercel.app/saveCompany',
        {
          uid,
          companyId: company.id, // Pass the company ID to identify which company to edit
          phoneNumber: phoneNumber.replace(/^\+91/, ''), // Remove +91 if present
          companyName,
          gst,
          email,
          address: `${mainAddress}${
            optionalAddress ? ', ' + optionalAddress : ''
          }, ${city}, ${state} - ${pincode}`,
          ownerName,
        },
      );

      if (response.status === 200) {
        Toast.show({
          type: 'success',
          position: 'top',
          text1: 'Company Updated',
          text2: 'Your company details have been updated successfully!',
        });
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to update company.');
      }
    } catch (error) {
      console.error('Error updating company: ', error);
      Alert.alert('Error', 'There was a problem updating your company.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.main} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, {backgroundColor: colors.main}]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name="arrow-left"
            size={24}
            color="#FFFFFF"
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Your Company</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            Company Name <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Company Name"
            placeholderTextColor="#999"
            value={companyName}
            onChangeText={setCompanyName}
          />
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#999"
            value={phoneNumber}
            onChangeText={text => {
              if (text.length <= 10 && /^[0-9]*$/.test(text)) {
                setPhoneNumber(text.replace(/^\+91/, '')); // Remove +91 if present
              }
            }}
            keyboardType="phone-pad"
            maxLength={10}
          />
          <Text style={styles.label}>
            Owner Name <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Owner Name"
            placeholderTextColor="#999"
            value={ownerName}
            onChangeText={setOwnerName}
          />
          <Text style={styles.label}>
            GST <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="GST"
            placeholderTextColor="#999"
            value={gst}
            onChangeText={setGst}
          />
          <Text style={styles.label}>
            Main Address <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Main Address"
            placeholderTextColor="#999"
            value={mainAddress}
            onChangeText={setMainAddress}
          />
          <Text style={styles.label}>Optional Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Optional Address"
            placeholderTextColor="#999"
            value={optionalAddress}
            onChangeText={setOptionalAddress}
          />
          <Text style={styles.label}>
            Pincode <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Pincode"
            placeholderTextColor="#999"
            value={pincode}
            onChangeText={text => {
              if (/^[0-9]*$/.test(text)) {
                setPincode(text);
              }
            }}
            keyboardType="numeric"
            maxLength={6}
          />
          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            placeholder="City"
            placeholderTextColor="#999"
            value={city}
            editable={false}
          />
          <Text style={styles.label}>State</Text>
          <TextInput
            style={styles.input}
            placeholder="State"
            placeholderTextColor="#999"
            value={state}
            editable={false}
          />
          <Text style={styles.label}>
            Email <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveCompany}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  backIcon: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Outfit-Medium',
    color: '#FFFFFF',
  },
  input: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#333',
    cursorColor: colors.main, // Note: This will only work on specific platforms
  },
  saveButton: {
    backgroundColor: colors.main,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Outfit-Bold',
  },
});

export default EditCompanyScreen;
