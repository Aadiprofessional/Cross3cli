import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../styles/color';

const QuotesScreen = () => {
  const navigation = useNavigation();

  const handleStartShopping = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/Quotes.png')} style={styles.image} />
      <Text style={styles.noQuoteText}>No Quote yet</Text>
      <Text style={styles.infoText}>
        Looks like you have not added any quote
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleStartShopping}>
        <Text style={styles.buttonText}>Start Shopping</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  noQuoteText: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
    color: colors.TextBlack,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.main,
    width: '80%',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QuotesScreen;
