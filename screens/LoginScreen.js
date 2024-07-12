import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {colors} from '../styles/color';
import {sizes} from '../styles/size';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {

    navigation.replace('Home');
  };

  const handleGuestLogin = () => {
    navigation.replace('Home');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/login_top.png')}
        style={styles.topImage}
      />
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.welcomeText}>Welcome to Cross Bee</Text>
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
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log in</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.googleButton}>
        <View style={styles.googleButtonContent}>
          <Image
            source={require('../assets/google_logo.png')}
            style={styles.googleLogo}
          />
          <Text style={styles.googleButtonText}>Log in with Google</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.guestButton} onPress={handleGuestLogin}>
        <Text style={styles.guestButtonText}>Log in as Guest User</Text>
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
    marginTop: -23,
  },
  logo: {
    width: sizes.logoWidth,
    height: sizes.logoHeight,
    resizeMode: 'contain',
    marginVertical: sizes.marginVertical / 2,
  },
  welcomeText: {
    fontSize: sizes.welcomeTextSize,
    fontWeight: '500',
    marginBottom: sizes.marginMax * 5,
    color: colors.textPrimary,
  },
  label: {
    fontSize: sizes.labelTextSize,
    fontWeight: '400',
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
    fontSize: sizes.inputFontSize,
    fontWeight: '400',
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
    fontSize: 16,
    fontWeight: '500',
    color: colors.background,
  },
  googleButton: {
    width: '80%',
    padding: sizes.padding,
    marginTop: sizes.marginMax * 5,
    borderRadius: sizes.borderRadius,
    borderWidth: 1,
    borderColor: '#333333',
    alignItems: 'center',
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginLeft: 10,
  },
  googleLogo: {
    width: 24,
    height: 24,
  },
  guestButton: {
    width: '80%',
    padding: sizes.padding,
    marginTop: sizes.marginMax,
    borderRadius: sizes.borderRadius,
    borderWidth: 1,
    borderColor: '#333333',
    alignItems: 'center',
  },
  guestButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
});

export default LoginScreen;
