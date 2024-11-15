import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image, TouchableOpacity, Text} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {colors} from '../styles/color';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useWishlist} from './WishlistContext'; // Import Wishlist Context

interface CustomHeaderProps {
  toggleNavBar: () => void;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({toggleNavBar}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const {wishlist} = useWishlist(); // Access wishlist from the context

  const handleSearchPress = () => {
    navigation.navigate('SearchScreen');
  };

  const handleWishlistPress = () => {
    navigation.navigate('Wish');
  };

  if (route.name !== 'HomeTab') {
    return null;
  }

  return (
    <View style={styles.header}>
      <View style={styles.leftIcons}>
        <TouchableOpacity onPress={toggleNavBar}>
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
        <View style={styles.wishlistContainer}>
          <TouchableOpacity onPress={handleWishlistPress}>
            <Image
              source={require('../assets/wishlist.png')}
              style={styles.profile}
            />
          </TouchableOpacity>
          {wishlist.length > 0 && (
            <View style={styles.wishlistBadge}>
              <Text style={styles.wishlistCount}>{wishlist.length}</Text>
            </View>
          )}
        </View>
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
  
    width: 30,
    height: 32,
  },
  wishlistContainer: {
    position: 'relative',
   
  },
  wishlistBadge: {
    position: 'absolute',
    right: 0,
    top: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wishlistCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default CustomHeader;
