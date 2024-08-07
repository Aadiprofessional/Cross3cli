import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import CompanyDetail from '../components/CompanyDetail'; // Adjust path as needed
import {useFocusEffect} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {colors} from '../styles/color';
import Icon from 'react-native-vector-icons/Feather';
import CompanyDropdown from '../components/CompanyDropdown';

const UserCompaniesScreen = ({navigation}) => {
  const [uid, setUid] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCompanies = async () => {
    setLoading(true);
    const currentUser = auth().currentUser;

    if (!currentUser) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    const uid = currentUser.uid;
    setUid(uid);

    try {
      const response = await axios.post(
        'https://crossbee-server.vercel.app/getCompanies',
        {uid},
      );

      if (response.status === 200) {
        setCompanies(response.data);
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

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Refresh the list whenever the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchCompanies();
    }, []),
  );

  const handleRemove = async companyId => {
    try {
      // Remove company locally
      setCompanies(prevCompanies =>
        prevCompanies.filter(company => company.id !== companyId),
      );
      // Optionally, you could also call an API to remove the company server-side if needed
    } catch (err) {
      setError('Failed to remove company');
      Alert.alert('Error', err.message); // Show error alert
    }
  };

  const handleAddCompany = () => {
    navigation.navigate('AddCompanyScreen'); // Replace with your screen name
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container2}>
      <View style={[styles.header, {backgroundColor: colors.main}]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name="arrow-left"
            size={24}
            color="#FFFFFF"
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Companies</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          {companies.length > 0 ? (
            companies.map(company => (
              <CompanyDetail
                key={company.id}
                company={company}
                onRemove={handleRemove}
              />
            ))
          ) : (
            <Text style={styles.noCompaniesText}>No companies found</Text>
          )}
          <TouchableOpacity style={styles.addButton} onPress={handleAddCompany}>
            <Text style={styles.addButtonText}>Add Company</Text>
          </TouchableOpacity>

          <Toast />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container2: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  backIcon: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  addButton: {
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: colors.main,
    borderRadius: 5,
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noCompaniesText: {
    textAlign: 'center',
    color: colors.primary,
    fontSize: 16,
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserCompaniesScreen;
