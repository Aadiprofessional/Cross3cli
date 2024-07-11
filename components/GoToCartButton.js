import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const GoToCartButton = () => {
  const navigation = useNavigation();

  const handleGoToCart = () => {
    navigation.navigate('Cart'); // Navigate to 'Cart' screen
  };

  return (
    <TouchableOpacity onPress={handleGoToCart}>
      <Text>Go to Cart</Text>
    </TouchableOpacity>
  );
};

export default GoToCartButton;
