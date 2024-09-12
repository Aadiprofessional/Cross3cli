import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Gif from 'react-native-gif';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const checkUserStatus = async () => {
      const user = auth().currentUser;
      if (user) {
        try {
          const docSnapshot = await firestore().collection('users').doc(user.uid).get();
          if (docSnapshot.exists) {
            navigation.replace('HomeTab');
          } else {
            navigation.replace('OTPVerification');
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          navigation.replace('OTPVerification');
        }
      } else {
        navigation.replace('OTPVerification');
      }
    };

    const timer = setTimeout(() => {
      checkUserStatus();
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Gif source={require('../assets/logo.png')} style={styles.gif} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFB800',
  },
  gif: {
    width: '60%',
  },
});

export default SplashScreen;
