import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, BackHandler, Platform } from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { colors } from '../styles/color';

const ThankYouScreen = () => {
  const navigation = useNavigation();

  const handleBackButtonPress = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'HomeTab' }],
    });
    return true; // Prevent default behavior (going back to previous screen)
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'android') {
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonPress);
      }
      return () => {
        if (Platform.OS === 'android') {
          BackHandler.removeEventListener('hardwareBackPress', handleBackButtonPress);
        }
      };
    }, [handleBackButtonPress])
  );

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/Animation - 1724952662598.json')} // Replace with your tick animation file
        autoPlay
        loop={false}
        style={styles.animation}
      />
      <Text style={styles.thankYouText}>Thank you for shopping with us!</Text>
      <View style={styles.container2}>
        <TouchableOpacity
          style={styles.button3}
          onPress={() => {
            try {
              navigation.reset({
                index: 0,
                routes: [{ name: 'HomeTab' }],
              });
            } catch (error) {
              console.error('Navigation error:', error);
            }
          }}>
          <Text style={styles.buttonText}>Start Shopping</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  animation: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  thankYouText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  button3: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 40, // Optional: add horizontal padding for better button shape
    backgroundColor: colors.main,
    borderRadius: 5,
    marginTop: 20,
    alignSelf: 'center', // This will keep it centered horizontally within its container
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Outfit-Bold',
  },
  container2: {
    flex: 1, // Takes up the full space of the screen
    justifyContent: 'center', // Centers content vertically
    alignItems: 'center', // Centers content horizontally
    backgroundColor: '#fff', // Optional: sets the background color of the screen
  },
});

export default ThankYouScreen;
