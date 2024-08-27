import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import Gif from 'react-native-gif';

const SplashScreen = ({navigation}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
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
