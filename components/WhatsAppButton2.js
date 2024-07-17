// WhatsAppButton.js
import React from 'react';
import { TouchableOpacity, View, Image, StyleSheet, Linking } from 'react-native';

const WhatsAppButton2 = () => {
  const handleWhatsAppPress = () => {
    const url = 'whatsapp://send?phone=9289881135';
    Linking.openURL(url).catch(() => {
      alert('Make sure WhatsApp is installed on your device');
    });
  };

  return (
    <TouchableOpacity style={styles.whatsappButton} onPress={handleWhatsAppPress}>
      <View style={styles.whatsappIcon}>
        <Image source={require('../assets/whatsapp.png')} style={styles.whatsappIconImage} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  whatsappButton: {
    position: 'absolute',
    bottom: 8,
    right: 25,
    zIndex: 10,
  },
  whatsappIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
   
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  whatsappIconImage: {
    width: 60,
    height: 60,
  },
});

export default WhatsAppButton2;
