import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../styles/color';

const CompanyDetail = ({ company, onRemove, navigation }) => {
  const handleRemove = async () => {
    try {
      const uid = auth().currentUser.uid;

      // Request to remove the company
      const response = await axios.post(
        'https://crossbee-server.vercel.app/removeCompany',
        {
          uid,
          companyId: company.id,
        }
      );

      // Handle successful response
      if (response.status === 200 && response.data.text === 'Successful') {
        onRemove(company.id);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Company removed successfully!',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to remove company.',
        });
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'There was a problem removing the company.',
      });
    }
  };

  const handleEdit = () => {
    navigation.navigate('EditCompanyScreen', { company });
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: company.type === 'Primary' ? colors.primary : colors.primary,
        },
      ]}
    >
      {company.type === 'Added' && (
        <>
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Icon name="pencil-outline" size={24} color="#000000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.removeButton} onPress={handleRemove}>
            <Icon name="delete-empty-outline" size={24} color="#000000" />
          </TouchableOpacity>
        </>
      )}
      {company.type === 'Primary' && (
        <>
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Icon name="pencil-outline" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.primaryText}>Primary</Text>
        </>
      )}
      <Text style={styles.title}>{company.name}</Text>
      <View>
        <Text style={styles.title}>Address:</Text>
        <Text style={styles.content}>{company.address || 'N/A'}</Text>
      </View>
      <View>
        <Text style={styles.title}>GST:</Text>
        <Text style={styles.content}>{company.gst || 'N/A'}</Text>
      </View>
      <View>
        <Text style={styles.title}>Owner:</Text>
        <Text style={styles.content}>{company.owner || 'N/A'}</Text>
      </View>
      <View>
        <Text style={styles.title}>Email:</Text>
        <Text style={styles.content}>{company.email || 'N/A'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    marginBottom: 8,
    position: 'relative',
    borderRadius: 10,
  },
  editButton: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 40,
  },
  primaryText: {
    fontSize: 16,
   
    fontFamily: 'Outfit-Regular',
    color: colors.orange,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
   
    fontFamily: 'Outfit-Bold',
    color: colors.TextBlack,
  },
  content: {
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    color: colors.TextBlack,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CompanyDetail;
