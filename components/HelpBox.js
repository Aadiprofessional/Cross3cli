import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { colors } from '../styles/color';

const HelpBox = () => {
  const handleCallPress = () => {
    const phoneNumber = '+919924686611';
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleWhatsAppPress = () => {
    const url = 'whatsapp://send?phone=+919924686611';
    Linking.openURL(url).catch(() => {
      // eslint-disable-next-line no-alert
      alert('Make sure WhatsApp is installed on your device');
    });
  };

  return (
    <View style={styles.backgroundContainer}>
      <View style={styles.topBackground} />
      <View style={styles.bottomBackground} />
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.mainText}>Need help with your purchase?</Text>
          <Text style={styles.subText}>Speak with our experts and place</Text>
          <Text style={styles.subText}>your order hassle-free</Text>
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={handleCallPress}>
            <Image style={styles.icon} source={require('../assets/call.png')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleWhatsAppPress}>
            <Image
              style={styles.icon2}
              source={require('../assets/whatsapp.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
  },
  topBackground: {
    backgroundColor: colors.main, // First color
    height: '50%',
    width: '100%',
    position: 'absolute',
    top: 0,
  },
  bottomBackground: {
    backgroundColor: '#ffffff', // Second color
    height: '50%',
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFE8C4',
    borderRadius: 10,
    padding: 15,
    marginVertical: 20,
    alignSelf: 'center',
    width: '92%',
    top: 0,
  },
  textContainer: {
    flex: 3,
  },
  mainText: {
    fontFamily: 'Outfit-SemiBold',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    color: colors.TextBlack,
  },
  subText: {
    fontFamily: 'Outfit-Regular',
    fontSize: 14,
    color: colors.TextBlack,
  },
  iconContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    width: 44,
    height: 44,
    marginLeft: -5,
    marginRight: 10,
  },
  icon2: {
    width: 40,
    height: 40,
    marginLeft: -5,
    marginRight: 15,
  },
});

export default HelpBox;
