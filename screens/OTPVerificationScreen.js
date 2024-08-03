import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; // Import axios or your preferred HTTP client
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {colors} from '../styles/color';
import {sizes} from '../styles/size';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId:
    '1097929165854-t9p0f55jva07tauq34o1vejt58hg2ot8.apps.googleusercontent.com', // Replace with your actual webClientId
});

const OTPVerificationScreen = ({navigation}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false); // Renamed state for better clarity
  const [orderId, setOrderId] = useState(null);
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const textInputRefs = useRef(
    Array(6)
      .fill(null)
      .map(() => React.createRef()),
  );

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
    if (otpSent) {
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
  }, [otpSent]);

  const isValidPhoneNumber = number => {
    // Basic validation for Indian phone numbers
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(number);
  };

  const requestOTP = async phoneNumber => {
    if (!isValidPhoneNumber(phoneNumber)) {
      showToast(
        'error',
        'Invalid Number',
        'Please enter a valid phone number.',
      );
      return;
    }

    try {
      // Replace this with your API call to request OTP
      let response = await axios.get(
        'https://crossbee-server.vercel.app/sendOtp?phoneNumber=91' +
          phoneNumber,
      );
      setOrderId(response.data.orderId);
      setOtpSent(true);
      setTimer(60);
      setCanResend(false);
      showToast('success', 'OTP Sent', 'OTP has been sent to your phone.');
    } catch (error) {
      console.error('Error requesting OTP:', error);
      showToast('error', 'Error', 'Failed to send OTP. Please try again.');
    }
  };

  const confirmCode = async () => {
    try {
      const completeCode = code.join('');
      // Replace this with your API call to verify OTP
      let response = await axios.get(
        'https://crossbee-server.vercel.app/verifyOtp?phoneNumber=91' +
          phoneNumber +
          '&orderId=' +
          orderId +
          '&otp=' +
          completeCode,
      );
      if (response.data.isOTPVerified) {
        let tokenResponse = await axios.get(
          'https://crossbee-server.vercel.app/getCustomToken?phoneNumber=91' +
            phoneNumber,
        );
        await auth().signInWithCustomToken(tokenResponse.data.token);
        await AsyncStorage.setItem('loggedIn', 'true');
        await AsyncStorage.setItem('phoneNumber', phoneNumber);
        showToast('success', 'Success', 'Phone number verified!');
        navigation.replace('Home');
      } else {
        showToast('error', 'Invalid OTP', 'Please enter the correct OTP.');
      }
    } catch (error) {
      console.error('Error confirming code:', error);
      showToast('error', 'Error', 'Failed to verify OTP. Please try again.');
    }
  };

  const handleChangeText = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < textInputRefs.current.length - 1) {
      textInputRefs.current[index + 1].current.focus();
    } else if (!text && index > 0) {
      textInputRefs.current[index - 1].current.focus();
    }
  };

  const resendOTP = async () => {
    if (canResend) {
      try {
        await axios.get(
          'https://crossbee-server.vercel.app/resendOtp?orderId=' + orderId,
        );
        setOtpSent(true);
        setTimer(60);
        setCanResend(false);
        showToast(
          'success',
          'OTP Resent',
          'OTP has been resent to your phone.',
        );
      } catch (error) {
        console.error('Error resending OTP:', error);
        showToast('error', 'Error', 'Failed to resend OTP. Please try again.');
      }
    }
  };

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const {idToken} = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
      await AsyncStorage.setItem('loggedIn', 'true');
      console.log('User signed in with Google!');
      navigation.replace('Home');
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.error('User cancelled the sign-in.');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.error('Sign-in is in progress.');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.error('Play services not available.');
      } else {
        console.error('Some other error happened:', error);
      }
    }
  };

  const handleGuestLogin = () => {
    showToast('info', 'Guest Login', 'Logged in as a guest.');
    navigation.replace('Home');
  };

  const handlePhoneNumberSubmit = () => {
    if (phoneNumber.length === 10) {
      requestOTP(phoneNumber);
    }
  };

  const showToast = (type, title, message) => {
    Toast.show({
      type,
      text1: title,
      text2: message,
      position: 'bottom',
      visibilityTime: 2000,
      icon: 'info',
    });
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          <Image
            source={require('../assets/login_top.png')}
            style={styles.topImage}
          />
          <Image source={require('../assets/logo.png')} style={styles.logo} />
          <Text style={styles.welcomeText}>Welcome to Cross Bee</Text>
          {!otpSent ? (
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
                onSubmitEditing={handlePhoneNumberSubmit} // Automatically request OTP on submit
              />
              <TouchableOpacity
                style={styles.button}
                onPress={() => requestOTP(phoneNumber)}>
                <Text style={styles.buttonText}>Get OTP</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.otpContent}>
              <Text style={styles.otpText}>
                We sent a 6-digit one-time password to this number +91{' '}
                {phoneNumber}
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
                    onKeyPress={({nativeEvent}) => {
                      if (nativeEvent.key === 'Backspace' && index > 0) {
                        textInputRefs.current[index - 1].current.focus();
                      }
                    }}
                    onSubmitEditing={confirmCode} // Automatically confirm code on submit
                  />
                ))}
              </View>
              <TouchableOpacity style={styles.button} onPress={confirmCode}>
                <Text style={styles.buttonText}>Confirm Code</Text>
              </TouchableOpacity>
              <View style={styles.timerResendContainer}>
                {timer > 0 ? (
                  <Text style={styles.timerText}>Resend OTP in {timer}s</Text>
                ) : (
                  <TouchableOpacity onPress={resendOTP}>
                    <Text style={styles.resendButtonText}>Resend OTP</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.googleButton}
              onPress={signInWithGoogle}>
              <View style={styles.googleButtonContent}>
                <Image
                  source={require('../assets/google_logo.png')}
                  style={styles.googleLogo}
                />
                <Text style={styles.googleButtonText}>Log in with Google</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.guestButton}
              onPress={handleGuestLogin}>
              <Text style={styles.guestButtonText}>Log in as Guest User</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
      <Toast />
    </>
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
    placeholderTextColor: colors.placeholder,
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
    marginTop: sizes.marginMax * 3,
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
});

export default OTPVerificationScreen;
