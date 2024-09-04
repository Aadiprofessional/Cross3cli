import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useFonts} from 'expo-font';
import {colors} from '../styles/color';
import {sizes} from '../styles/size';

const SignupScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [fontsLoaded] = useFonts({
    'Outfit-Medium': require('../assets/fonts/Outfit-Medium.ttf'),
    'Outfit-Regular': require('../assets/fonts/Outfit-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleSignup = () => {
    if (password === confirmPassword) {
      navigation.replace('Home');
    } else {
      // eslint-disable-next-line no-alert
      alert('Passwords do not match');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/login_top.png')}
        style={styles.topImage}
      />
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.welcomeText}>Create Your Account</Text>
      <Text style={styles.label}>Email Id</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter the Email id"
        placeholderTextColor={colors.inputPlaceholder}
        value={email}
        onChangeText={setEmail}
        cursorColor={colors.buttonBackground}
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter the Password"
        placeholderTextColor={colors.inputPlaceholder}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        cursorColor={colors.buttonBackground}
      />
      <Text style={styles.label}>Confirm Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Confirm the Password"
        placeholderTextColor={colors.inputPlaceholder}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        cursorColor={colors.buttonBackground}
      />
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  topImage: {
    width: '100%',
    height: sizes.topImageHeight,
    resizeMode: 'contain',
  },
  logo: {
    width: sizes.logoWidth,
    height: sizes.logoHeight,
    resizeMode: 'contain',
    marginVertical: sizes.marginVertical / 2,
  },
  welcomeText: {
    fontFamily: 'Outfit-Medium',
    fontSize: sizes.welcomeTextSize,
 
    marginBottom: sizes.marginMax * 5,
    color: colors.textPrimary,
  },
  label: {
    fontFamily: 'Outfit-Regular',
    fontSize: sizes.labelTextSize,
   
    alignSelf: 'flex-start',
    marginLeft: '10%',
    marginTop: 10,
    marginBottom: 5,
    color: colors.textPrimary,
  },
  input: {
    width: '80%',
    padding: sizes.padding,
    marginVertical: sizes.marginVertical,
    borderRadius: sizes.borderRadius,
    backgroundColor: colors.inputBackground,
    fontFamily: 'Outfit-Regular',
    fontSize: sizes.inputFontSize,
   
    color: colors.textPrimary,
  },
  button: {
    width: '80%',
    padding: sizes.padding,
    marginTop: sizes.marginMax * 2,
    borderRadius: sizes.borderRadius,
    backgroundColor: colors.buttonBackground,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Outfit-Medium',
    fontSize: 16,
  
    color: colors.background,
  },
});

export default SignupScreen;
