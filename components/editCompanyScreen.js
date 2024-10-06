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
  const [alternateNumber, setAlternateNumber] = useState('');
  const [mainAddress, setMainAddress] = useState('');

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
      // Assume pincode is the last part of the address after a comma
      const addressParts = company.address.split(',');
      
      // Extract the pincode (assuming the last part is the pincode)
      const pincodeFromAddress = addressParts[addressParts.length - 1].trim();
      
      // Reconstruct the main address without the pincode
      const addressWithoutPincode = addressParts.slice(0, -1).join(',').trim();
      
      setCompanyName(company.name);
      setOwnerName(company.owner);
      setGst(company.gst);
      setMainAddress(addressWithoutPincode); // Set address without pincode
      setPincode(company.pincode || pincodeFromAddress); // Set pincode if not already separate
      
      setAlternateNumber(company.alternateNumber.replace(/^\+91/, ''));
      setEmail(company.email);
      setPhoneNumber(company.phoneNumber.replace(/^\+91/, ''));
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
      company.type !== 'Primary' &&
      (!companyName ||
        !ownerName ||
        !gst ||
        !alternateNumber ||
        !mainAddress ||
        !email ||
        pincode.length !== 6 ||
        phoneNumber.length !== 10)
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
        'https://crossbee-server-1036279390366.asia-south1.run.app/saveCompany',
        {
          uid,
          companyId: company.id, // Pass the company ID to identify which company to edit
          phoneNumber: phoneNumber.replace(/^\+91/, ''), // Remove +91 if present
          alternateNumber: alternateNumber.replace(/^\+91/, ''),
          companyName: company.type !== 'Primary' ? companyName : company.name,
          gst: company.type !== 'Primary' ? gst : company.gst,
          email: company.type !== 'Primary' ? email : company.email,
          address:
            company.type !== 'Primary'
              ? `${mainAddress}
                , ${city}, ${state} - ${pincode}`
              : company.address,
          ownerName: company.type !== 'Primary' ? ownerName : company.owner,
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
            color="#fff" // Dark black color for icon
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
            editable={company.type !== 'Primary'}
          />
           <Text style={styles.label}>Alternate Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Alternate Number"
            placeholderTextColor="#999"
            value={alternateNumber}
            onChangeText={text => {
              if (text.length <= 10 && /^[0-9]*$/.test(text)) {
                setAlternateNumber(text.replace(/^\+91/, '')); // Remove +91 if present
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
            maxLength={15}
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
            onChangeText={setCity}
            editable={false}
          />
          <Text style={styles.label}>State</Text>
          <TextInput
            style={styles.input}
            placeholder="State"
            placeholderTextColor="#999"
            value={state}
            onChangeText={setState}
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
          />
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveCompany}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  backIcon: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Outfit-Medium',
    color: '#fff',
  },
  scrollView: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
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
  requiredStar: {
    color: 'red',
  },
  saveButton: {
    backgroundColor: colors.main,
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
    margin: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default EditCompanyScreen;
