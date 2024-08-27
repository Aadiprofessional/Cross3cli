import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image, TouchableOpacity, Alert} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {colors} from '../styles/color';
import Icon from 'react-native-vector-icons/MaterialIcons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import UserCompaniesScreen from '../screens/UserCompaniesScreen';

interface CustomHeaderProps {
  toggleNavBar: () => void;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({toggleNavBar}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const user = auth().currentUser;

    if (user) {
      const unsubscribe = firestore()
        .collection('users')
        .doc(user.uid)
        .onSnapshot(
          snapshot => {
            const userData = snapshot.data();
            if (userData && typeof userData.profilePicture === 'string') {
              setProfileImage(userData.profilePicture);
            } else {
              setProfileImage(null); // Default to null if no valid URL
            }
          },
          error => {
            console.error('Error fetching profile image: ', error);
            Alert.alert('Error', 'Unable to fetch profile image.');
            setProfileImage(null);
          },
        );

      // Cleanup subscription on unmount
      return () => unsubscribe();
    }
  }, []);

  const handleSearchPress = () => {
    navigation.navigate('SearchScreen');
  };

  const handleProfilePress = () => {
    navigation.navigate('UserCompaniesScreen');
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
        <TouchableOpacity onPress={handleProfilePress}>
          <Image
            source={
              profileImage
                ? {uri: UserCompaniesScreen}
                : require('../assets/insurance-company.png')
            }
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
    borderRadius: 18.5, // Make it circular
  },
});

export default CustomHeader;
