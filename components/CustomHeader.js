import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../styles/color';

interface CustomHeaderProps {
  toggleNavBar: () => void;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ toggleNavBar }) => {
  const navigation = useNavigation();
  const route = useRoute();

  const handleSearchPress = () => {
    navigation.navigate('SearchScreen');
  };
  if (route.name !== 'Home') {
    return null;
  }

  return (
    <View style={styles.header}>
      <View style={styles.leftIcons}>
        <TouchableOpacity onPress={toggleNavBar}>
          <Image source={require('../assets/nav.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
      <View style={styles.centerLogo}>
        <Image source={require('../assets/logo.png')} style={styles.logoImage} />
      </View>
      <View style={styles.rightIcons}>
        <TouchableOpacity onPress={handleSearchPress}>
          <Image source={require('../assets/search.png')} style={styles.icon} />
        </TouchableOpacity>
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
    backgroundColor: colors.main,
    elevation: 2,
    paddingTop: 30,
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
    width: 120,
    height: 40,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 30,
    height: 30,
    marginHorizontal: 10,
  },
});

export default CustomHeader;
