import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors} from '../styles/color';
import WhatsAppButton from '../components/WhatsAppButton';

const PrivacyPolicyScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
      </View>

      <View style={styles.content}>
        <Text>Privacy Policy content goes here.</Text>
        <WhatsAppButton />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: colors.main,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});

export default PrivacyPolicyScreen;
