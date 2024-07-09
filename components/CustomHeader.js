import React from 'react';
import {View, StyleSheet, Image} from 'react-native';

const CustomHeader = () => {
  return (
    <View style={styles.header}>
      <View style={styles.leftIcons}>
        <Image source={require('../assets/nav.png')} style={styles.icon} />
      </View>
      <View style={styles.centerLogo}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logoImage}
        />
      </View>
      <View style={styles.rightIcons}>
        <Image source={require('../assets/cart.png')} style={styles.icon} />
        <Image source={require('../assets/profile.png')} style={styles.icon} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FCCC51', // Background color
    elevation: 2,
    paddingTop: 30, // Increase distance from top
  },
  leftIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerLogo: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 120, // Adjust width and height as needed
    height: 40,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    marginHorizontal: 10, // Adjust as needed for spacing between icons
  },
});

export default CustomHeader;
