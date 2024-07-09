import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';

const HelpBox = () => {
  const handleCallPress = () => {
    Linking.openURL('tel:9289881135');
  };

  const handleWhatsAppPress = () => {
    const url = 'whatsapp://send?phone=9289881135';
    Linking.openURL(url).catch(() => {
      // eslint-disable-next-line no-alert
      alert('Make sure WhatsApp is installed on your device');
    });
  };

  return (
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
            style={styles.icon}
            source={require('../assets/whatsapp.png')}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFE8C4',
    borderRadius: 10,
    padding: 15,
    marginVertical: 20,
    alignSelf: 'center',
    width: '92%',
    position: 'absolute',
    top: 0,
    left: '4%',
  },
  textContainer: {
    flex: 3,
  },
  mainText: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 16,
    marginBottom: 5,
  },
  subText: {
    fontFamily: 'Outfit-Regular',
    fontSize: 14,
  },
  iconContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    width: 48, // Increased the icon size to 2x
    height: 48, // Increased the icon size to 2x
    marginLeft: -15, // Adjusted margin to reduce space
  },
});

export default HelpBox;
