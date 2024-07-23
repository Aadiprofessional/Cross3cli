import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import { colors } from '../styles/color';
import { sizes } from '../styles/size';

const OTPVerificationScreen = ({navigation}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmResult, setConfirmResult] = useState(null);
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const textInputRefs = useRef([
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(), React.createRef()
  ]);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedIn = await AsyncStorage.getItem('loggedIn');
      if (loggedIn === 'true') {
        navigation.replace('Home');
      }
    };

    checkLoginStatus();
  }, [navigation]);

  useEffect(() => {
    let timerInterval;
    if (confirmResult) {
      timerInterval = setInterval(() => {
        setTimer(prev => {
          if (prev === 1) {
            clearInterval(timerInterval);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [confirmResult]);

  const signInWithPhoneNumber = async (phoneNumber) => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirmResult(confirmation);
      setTimer(60);
      setCanResend(false);
    } catch (error) {
      console.error(error);
    }
  };

  const confirmCode = async () => {
    try {
      const completeCode = code.join('');
      await confirmResult.confirm(completeCode);
      await AsyncStorage.setItem('loggedIn', 'true');
      await AsyncStorage.setItem('phoneNumber', phoneNumber); 
      console.log('Phone number verified!');
      navigation.replace('Home');
    } catch (error) {
      console.error('Invalid code.', error);
    }
  };

  const handleChangeText = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < textInputRefs.current.length - 1) {
      textInputRefs.current[index + 1].current.focus();
    }
  };

  const resendOTP = async () => {
    if (canResend) {
      await signInWithPhoneNumber('+91' + phoneNumber);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={require('../assets/login_top.png')}
          style={styles.topImage}
        />
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
        />
        <Text style={styles.welcomeText}>Welcome to Cross Bee</Text>
        {!confirmResult ? (
          <View style={styles.content}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Phone Number"
              keyboardType="phone-pad"
              maxLength={10}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              cursorColor={colors.buttonBackground}
              placeholderTextColor={colors.placeholder}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => signInWithPhoneNumber('+91' + phoneNumber)}
            >
              <Text style={styles.buttonText}>Get OTP</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.otpContent}>
            <Text style={styles.otpText}>
              We sent a 6-digit one-time password to this number +91 {phoneNumber}
            </Text>
            <View style={styles.otpInputsContainer}>
              {textInputRefs.current.map((ref, index) => (
                <TextInput
                  key={index}
                  ref={ref}
                  style={[
                    styles.otpInput,
                    code[index] ? styles.activeOtpInput : {},
                  ]}
                  keyboardType="numeric"
                  maxLength={1}
                  value={code[index]}
                  onChangeText={text => handleChangeText(text, index)}
                  cursorColor={colors.buttonBackground}
                  placeholderTextColor={colors.placeholder}
                />
              ))}
            </View>
            <View style={styles.timerResendContainer}>
              <Text style={styles.timerText}>{timer}s</Text>
              <TouchableOpacity
                style={[styles.resendButton, { opacity: canResend ? 1 : 0.5 }]}
                onPress={resendOTP}
                disabled={!canResend}
              >
                <Text style={styles.resendButtonText}>Resend</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={confirmCode}
            >
              <Text style={styles.buttonText}>Confirm Code</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.googleButton}>
            <View style={styles.googleButtonContent}>
              <Image
                source={require('../assets/google_logo.png')}
                style={styles.googleLogo}
              />
              <Text style={styles.googleButtonText}>Log in with Google</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.guestButton} onPress={() => navigation.replace('Home')}>
            <Text style={styles.guestButtonText}>Log in as Guest User</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingVertical: sizes.paddingVertical,
  },
  topImage: {
    width: '100%',
    height: sizes.topImageHeight,
    resizeMode: 'contain',
    marginTop: -27,
  },
  logo: {
    width: sizes.logoWidth,
    height: sizes.logoHeight,
    resizeMode: 'contain',
    marginVertical: sizes.marginVertical / 2,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: sizes.marginVertical,
  },
  label: {
    fontSize: sizes.labelTextSize,
    fontWeight: '400',
    alignSelf: 'flex-start',
    marginTop: 10,
    marginBottom: 5,
    color: colors.textPrimary,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
  },
  otpContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
  },
  input: {
    width: '100%',
    padding: sizes.padding,
    marginVertical: sizes.marginVertical,
    borderRadius: sizes.borderRadius,
    backgroundColor: colors.inputBackground,
    fontSize: sizes.inputFontSize,
    fontWeight: '400',
    color: colors.textPrimary,
    // Updated placeholder color
    placeholderTextColor: colors.placeholder, // Ensure this is the correct color
  },
  otpInputsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: sizes.marginVertical,
  },
  otpInput: {
    width: '14%',
    height: 50,
    marginHorizontal: 5,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    textAlign: 'center',
    fontSize: sizes.inputFontSize,
    color: colors.textPrimary,
  },
  activeOtpInput: {
    borderColor: colors.main,
    backgroundColor: colors.mainLight,
  },
  button: {
    width: '100%',
    padding: sizes.padding,
    marginTop: sizes.marginMax * 2,
    borderRadius: sizes.borderRadius,
    backgroundColor: colors.main,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.background,
  },
  otpText: {
    marginBottom: sizes.marginVertical,
    fontSize: sizes.inputFontSize,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  timerResendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: sizes.marginMax,
  },
  timerText: {
    fontSize: sizes.inputFontSize,
    color: colors.textPrimary,
  },
  resendButton: {
    // Add styles for resend button if needed
  },
  resendButtonText: {
    fontSize: sizes.inputFontSize,
    color: colors.second,
  },
  footer: {
    width: '80%',
    alignItems: 'center',
    marginTop: sizes.marginMax * 3, // Adjusted margin to decrease distance
  },
  googleButton: {
    width: '100%',
    padding: sizes.padding,
    marginBottom: sizes.marginMax,
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
    width: '100%',
    padding: sizes.padding,
    borderRadius: sizes.borderRadius,
    marginBottom: sizes.marginMax,
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

export default OTPVerificationScreen;
