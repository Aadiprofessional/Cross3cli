import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native'; // for navigation
import Icon from 'react-native-vector-icons/Feather';
import {colors} from '../styles/color';
import {useCart} from '../components/CartContext'; // Import CartContext

const CustomHeader3 = ({title}) => {
  const navigation = useNavigation();
  const {cartItemCount} = useCart(); // Access cart item count from context

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.leftIcon}>
        <Icon name="arrow-left" size={24} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.headerText}>{title}</Text>
      <View style={styles.rightIcons}>
        <TouchableOpacity
          style={styles.cartButton2}
          onPress={() => navigation.navigate('HomeTab')}>
          <Icon name="home" size={24} color="#fff" />
        </TouchableOpacity>
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15, // Adjusted to provide space for icons
    paddingVertical: 10, // Adjusted for overall header space
    backgroundColor: colors.main, // Background color of the header
  },
  leftIcon: {
    marginRight: 10, // Added margin to the right of the left icon
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto', // Push icons to the right end
  },
  headerText: {
    color: '#fff', // Color of the header text
    fontSize: 18,
    fontFamily: 'Outfit-Medium',
    flex: 1, // Allow header text to take up available space
    marginLeft: 10, // Adjust margin to space text from the left icon
  },
  cartButton: {
    marginLeft: 20, // Adjust spacing between icons
  },
  cartButton2: {
    marginLeft: 20, // Ensure spacing between home and cart icon
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Outfit-Bold',
  },
});

export default CustomHeader3;
