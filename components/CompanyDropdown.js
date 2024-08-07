import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';
import auth from '@react-native-firebase/auth';
import { Picker } from '@react-native-picker/picker'; // Updated import
import { colors } from '../styles/color';

const CompanyDropdown = ({ onSelectCompany }) => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
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

      const uid = currentUser.uid;

      try {
        const response = await axios.post(
          'https://crossbee-server.vercel.app/getCompanies',
          { uid },
        );

        if (response.status === 200) {
          const companiesData = response.data;
          setCompanies(companiesData);

          // Set the first company as the default selection
          if (companiesData.length > 0) {
            setSelectedCompanyId(companiesData[0].id);
            if (onSelectCompany) {
              onSelectCompany(companiesData[0].id);
            }
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
  }, []);

  const handleSelect = (companyId) => {
    setSelectedCompanyId(companyId);
    if (onSelectCompany) {
      onSelectCompany(companyId);
    }
  };

  if (loading) return <ActivityIndicator size="large" color={colors.main} />;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select a Company:</Text>
      <Picker
        selectedValue={selectedCompanyId}
        onValueChange={handleSelect}
        style={styles.picker}
      >
        {companies.length === 0 && (
          <Picker.Item label="No companies available" value={null} />
        )}
        {companies.map((company) => (
          <Picker.Item
            key={company.id}
            label={company.name}
            value={company.id}
          />
        ))}
      </Picker>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: colors.white,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.TextBlack,
    marginBottom: 8,
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: colors.white,
    color: colors.TextBlack,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default CompanyDropdown;
