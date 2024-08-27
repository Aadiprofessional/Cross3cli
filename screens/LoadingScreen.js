// LoadingScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LoadingScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Loading...</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    fontFamily: 'Outfit-Medium',
    color: '#000',
  },
});

export default LoadingScreen;
