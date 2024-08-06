import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import RNPickerSelect from 'react-native-picker-select';

const UserCompaniesScreen = () => {
  const [uid, setUid] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyInfo, setCompanyInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUserUid = () => {
      const currentUser = auth().currentUser;
      if (currentUser) {
        setUid(currentUser.uid);
      } else {
        setError('User not authenticated');
        setLoading(false);
      }
    };
console.log(uid);

    getUserUid();
  }, []);

  useEffect(() => {
    if (uid) {
      const fetchCompanies = async () => {
        try {
          // Replace with your actual path to JSON files in Firebase Storage
          const reference = storage().ref(`/users/wPP8X250n6RYaBC60mhqG7OA4Wq1/Companies.json`);
          const url = await reference.getDownloadURL();
          const response = await fetch(url);
          const companyData = await response.json();

          if (companyData) {
            const formattedData = Object.keys(companyData).map(key => ({
              label: companyData[key].name,
              value: companyData[key]
            }));
            setCompanies(formattedData);
          } else {
            setCompanies([]);
          }
          setLoading(false);
        } catch (err) {
          setError('Failed to load companies');
          setLoading(false);
        }
      };

      fetchCompanies();
    }
  }, [uid]);

  const handleCompanySelect = (value) => {
    setSelectedCompany(value);
    setCompanyInfo(value);
  };

  const handleAddCompany = () => {
    console.log('Add company button pressed');
  };

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

  if (error) return <Text>{error}</Text>;

  return (
    <View style={styles.container}>
      <RNPickerSelect
        onValueChange={handleCompanySelect}
        items={companies}
        placeholder={{ label: 'Select a company...', value: null }}
        style={pickerSelectStyles}
      />
      {companyInfo && (
        <View style={styles.infoContainer}>
          <Text>Address: {companyInfo.phone?.address || 'N/A'}</Text>
          <Text>GST: {companyInfo.phone?.gst || 'N/A'}</Text>
          <Text>Owner: {companyInfo.phone?.owner || 'N/A'}</Text>
          <Text>Email: {companyInfo.phone?.email || 'N/A'}</Text>
        </View>
      )}
      <Button title="Add Company" onPress={handleAddCompany} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff'
  },
  infoContainer: {
    marginVertical: 16
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4
  },
  inputAndroid: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4
  }
});

export default UserCompaniesScreen;
