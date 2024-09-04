import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { BottomTabBar } from '@react-navigation/bottom-tabs';

const CustomTabBar = (props) => {
  return (
    <View style={styles.tabBar}>
      <BottomTabBar {...props} />
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    height: 60, // Adjust the height here
    justifyContent: 'flex-end', // Align items to the bottom
    paddingBottom: 10, // Add padding to ensure icons are not too close to the edge
  },
});

export default CustomTabBar;
