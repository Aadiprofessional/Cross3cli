import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../styles/color';
import Icon from 'react-native-vector-icons/Feather'; // Import Feather icons

const NeedHelpScreen = () => {
  const navigation = useNavigation();

  const handleWhatsApp = () => {
    const phoneNumber = '9924686611';
    Linking.openURL(`https://wa.me/${phoneNumber}`);
  };

  const handleCall = () => {
    const phoneNumber = '9924686611';
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleMail = () => {
    const email = 'ecomrtepl@gmail.com';
    Linking.openURL(`mailto:${email}`);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, {backgroundColor: colors.main}]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          {/* Use Feather icon for back button */}
          <Icon
            name="arrow-left"
            size={24}
            color="#FFFFFF"
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact us</Text>
      </View>

      <TouchableOpacity style={styles.rectangle} onPress={handleWhatsApp}>
        <Image source={require('../assets/whatsapp.png')} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={[styles.mediumText, {color: colors.main}]}>
            WhatsApp
          </Text>
          <Text style={styles.regularText}>Click the Chat with our staffs</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.rectangle} onPress={handleCall}>
        <Image source={require('../assets/call.png')} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={[styles.mediumText, {color: colors.main}]}>Call</Text>
          <Text style={styles.regularText}>Click the Chat with our staffs</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.rectangle} onPress={handleMail}>
        <Image source={require('../assets/mail.png')} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={[styles.mediumText, {color: colors.main}]}>Mail</Text>
          <Text style={styles.regularText}>Click the Chat with our staffs</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    fontWeight: 'bold',
    fontFamily: 'Outfit-Bold',
    color: '#FFFFFF',
  },
  rectangle: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 15,
    marginLeft: 10,
    marginRight: 10,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
    color: colors.TextBlack,
  },
  mediumText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Outfit-Bold',
    color: colors.TextBlack,
  },
  regularText: {
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    marginTop: 5,
    color: colors.TextBlack,
  },
});

export default NeedHelpScreen;
