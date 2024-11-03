import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import axios from 'axios';
import auth from '@react-native-firebase/auth';
import { colors } from '../styles/color';

const CompanyDropdown3 = ({ onSelectCompany, pincode }) => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);

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
        const response = await axios.post(
          'https://crossbee-server-1036279390366.asia-south1.run.app/logistics',
          { pincode }
        );

        if (response.status === 200) {
          const companiesData = response.data;
          setCompanies(companiesData);
          if (companiesData.length > 0) {
            setSelectedCompany(companiesData[0]); // Auto-select the first company
          }
        } else {
          throw new Error(`Failed to load companies: ${response.status}`);
        }
      } catch (err) {
        setError('Failed to load companies');
        Alert.alert('Error', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [pincode]);

  const handleSelect = (company) => {
    setSelectedCompany(company);
    setDropdownVisible(false); // Close dropdown after selection
    if (onSelectCompany) {
      onSelectCompany(company); // Pass the selected company data to the parent
    }
  };

  const handleDropdownPress = () => {
    if (companies.length > 0) {
      setDropdownVisible(true);
    }
  };

  const handleOutsidePress = () => {
    setDropdownVisible(false);
  };

  if (loading) return <ActivityIndicator size="large" color={colors.main} />;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select a Logistics:</Text>
      <TouchableOpacity
        style={styles.pickerContainer}
        onPress={handleDropdownPress}
      >
        <Text style={styles.pickerText}>
          {selectedCompany ? selectedCompany.name : 'Select Logistics'}
        </Text>
      </TouchableOpacity>

      {companies.length === 0 && !loading && (
        <Text style={styles.noDataText}>No logistics available</Text>
      )}

      {dropdownVisible && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={dropdownVisible}
          onRequestClose={() => setDropdownVisible(false)}
        >
          <TouchableWithoutFeedback onPress={handleOutsidePress}>
            <View style={styles.modalBackground}>
              <View style={styles.dropdown}>
                <FlatList
                  data={companies}
                  keyExtractor={(item) => item.name}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => handleSelect(item)}
                    >
                      <Text style={styles.itemTitle}>{item.name}</Text>
                      <Text style={styles.itemTitle2}>Status: {item.status}</Text>
                      <Text style={styles.itemTitle2}>Note: {item.note}</Text>
                      {item.locations.map((location, index) => (
                        <View key={index} style={styles.locationItem}>
                          <Text style={styles.itemTitle2}>Booking Station: {location.booking_station}</Text>
                          <Text style={styles.itemTitle2}>Warehouse: {location.godown}</Text>
                          <Text style={styles.itemTitle2}>Pincode: {location.pincode}</Text>
                          <Text style={styles.itemTitle2}>City: {location.city}</Text>
                        </View>
                      ))}
                    </TouchableOpacity>
                  )}
                  showsVerticalScrollIndicator={true}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}

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
    backgroundColor: colors.white,
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  pickerText: {
    fontFamily: 'Outfit-Medium',
    color: colors.TextBlack,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdown: {
    backgroundColor: '#ffffff',
    width: '95%',
    maxHeight: '70%',
    elevation: 5,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.white,
  },
  itemTitle: {
    fontFamily: 'Outfit-Bold',
    fontSize: 16,
    color: 'black',
  },
  itemTitle2: {
    fontFamily: 'Outfit-Medium',
    fontSize: 16,
    color: 'black',
  },
  locationItem: {
    marginTop: 5,
    paddingVertical: 2,
  },
  noDataText: {
    color: 'gray',
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'Outfit-Medium',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'Outfit-Medium',
  },
});

export default CompanyDropdown3;
