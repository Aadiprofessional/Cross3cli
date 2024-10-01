import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import auth from '@react-native-firebase/auth';
import { Picker } from '@react-native-picker/picker'; // Ensure correct import
import { colors } from '../styles/color';

const CompanyDropdown2 = ({ onSelectCompany }) => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyName, setSelectedCompanyName] = useState(null); // Use name instead of ID
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      const currentUser = auth().currentUser;
  
      if (!currentUser) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }
  
      try {
        const response = await axios.get('https://crossbee-server-1036279390366.asia-south1.run.app/brands');
  
        if (response.status === 200) {
          const companiesData = response.data;
          
          if (Array.isArray(companiesData)) {
            setCompanies(companiesData);
  
            // Set the default brand only once
            if (companiesData.length > 0 && !selectedCompanyName) {
              // Check for the "Power" brand first
              const defaultCompany = companiesData.find(company => company.name === "Power");
              if (defaultCompany) {
                setSelectedCompanyName(defaultCompany.name);
                if (onSelectCompany) {
                  onSelectCompany(defaultCompany.name);
                }
              } else {
                // If "Power" is not found, select the first brand as default
                setSelectedCompanyName(companiesData[0].name);
                if (onSelectCompany) {
                  onSelectCompany(companiesData[0].name);
                }
              }
            }
          } else {
            throw new Error('Unexpected data format received');
          }
        } else {
          throw new Error(`Failed to load companies: ${response.status}`);
        }
      } catch (err) {
        setError('Failed to load companies');
        Alert.alert('Error', err.message); // Show error alert
      } finally {
        setLoading(false);
      }
    };
  
    fetchCompanies();
  }, [onSelectCompany, selectedCompanyName]); // selectedCompanyName remains to ensure default is set once
   // Add selectedCompanyName to ensure default is set once

  const handleSelect = (companyName) => {
    setSelectedCompanyName(companyName); // Update with user selection
    if (onSelectCompany) {
      onSelectCompany(companyName);
    }
  };

  if (loading) return <ActivityIndicator size="large" color={colors.main} />;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select a Brand:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedCompanyName}
          onValueChange={(itemValue) => handleSelect(itemValue)}
          style={styles.picker}
        >
          {companies.length === 0 && (
            <Picker.Item label="No Brand available" value={null} />
          )}
          {companies.map((company) => (
            <Picker.Item
              key={company.name} // Using name as the key since no id field exists
              label={company.name}
              value={company.name} // Select by name
            />
          ))}
        </Picker>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: colors.white,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Outfit-Bold',
    color: colors.TextBlack,
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.TextBlack,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: colors.white,
    height: 40,
    justifyContent: 'center',
  },
  picker: {
    fontFamily: 'Outfit-Medium',
    height: '100%',
    width: '100%',
    color: colors.TextBlack,
    textAlign: 'left',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'Outfit-Medium',
  },
});

export default CompanyDropdown2;
