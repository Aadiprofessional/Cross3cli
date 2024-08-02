import React from 'react';
import {View, StyleSheet, Image, TouchableOpacity, Text} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {colors} from '../styles/color';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Using Feather icons

interface CustomHeaderProps {
  toggleNavBar: () => void;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({toggleNavBar}) => {
  const navigation = useNavigation();
  const route = useRoute();

  const handleSearchPress = () => {
    navigation.navigate('SearchScreen');
  };

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  if (route.name !== 'Home') {
    return null; // Ensure that this logic is correct
  }

  // Debug: Log to ensure components are rendering correctl

  return (
    <View style={styles.header}>
      <View style={styles.leftIcons}>
        <TouchableOpacity onPress={toggleNavBar}>
          {/* Ensure this icon renders correctly */}
          <Icon name="menu" size={30} color="#FFFFFF" style={styles.icon} />
        </TouchableOpacity>
      </View>
      <View style={styles.centerLogo}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logoImage}
        />
      </View>
      <View style={styles.rightIcons}>
        <TouchableOpacity onPress={handleSearchPress}>
          <Icon name="search" size={30} color="#FFFFFF" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleProfilePress}>
          <Image
            source={require('../assets/profile.png')}
            style={styles.profile}
          />
        </TouchableOpacity>
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
  },
  leftIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerLogo: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 120,
    height: 40,
    marginBottom: 10,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginHorizontal: 10,
  },
  profile: {
    marginHorizontal: 10,
    width: 35,
    height: 37,
  },
});

export default CustomHeader;
