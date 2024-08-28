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
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {colors} from '../styles/color';
import {sizes} from '../styles/size';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';
import SmsRetriever from 'react-native-sms-retriever'; // Import SmsRetriever for auto-reading OTP

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId:
    '1097929165854-t9p0f55jva07tauq34o1vejt58hg2ot8.apps.googleusercontent.com', // Replace with your actual webClientId
});

const OTPVerificationScreen = ({navigation}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false); // State to manage loading for OTP request
  const textInputRefs = useRef(
    Array(6)
      .fill(null)
      .map(() => React.createRef()),
  );

  useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedIn = await AsyncStorage.getItem('loggedIn');
      if (loggedIn === 'true') {
        navigation.replace('HomeTab');
      }
    };

    checkLoginStatus();
  }, [navigation]);

  useEffect(() => {
    let timerInterval;
    if (otpSent && timer > 0) {
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
  }, [otpSent, timer]);

  useEffect(() => {
    if (otpSent) {
      textInputRefs.current[0].current.focus();
    }
  }, [otpSent]);

  useEffect(() => {
    // Start SMS Retriever when OTP is sent
    if (otpSent) {
      SmsRetriever.startSmsRetriever()
        .then(result => {
          SmsRetriever.addSmsListener(event => {
            const message = event.message;
            const otp = /(\d{6})/g.exec(message)[1];
            if (otp) {
              const otpArray = otp.split('');
              setCode(otpArray);
              confirmCode(otpArray.join(''));
              SmsRetriever.removeSmsListener();
            }
          });
        })
        .catch(error => {
          console.error('Error starting SMS Retriever:', error);
        });
    }
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

    setOtpLoading(true); // Start loading animation for OTP request

    try {
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

      if (
        error.response &&
        error.response.data &&
        error.response.data.error === "User doesn't exist."
      ) {
        navigation.reset({
          index: 0,
          routes: [{name: 'UpdateProfileScreen', params: {phoneNumber}}], // Resetting with UpdateProfileScreen as the first route
        });
      } else {
        showToast('error', 'Error', 'Failed to send OTP. Please try again.');
      }
    } finally {
      setOtpLoading(false); // Stop loading animation after request completes
    }
  };

  const confirmCode = async otp => {
    setLoading(true);
    try {
      let response = await axios.get(
        'https://crossbee-server.vercel.app/verifyOtp?phoneNumber=91' +
          phoneNumber +
          '&orderId=' +
          orderId +
          '&otp=' +
          otp,
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
        navigation.replace('HomeTab');
      } else {
        showToast('error', 'Invalid OTP', 'Please enter the correct OTP.');
      }
    } catch (error) {
      console.error('Error confirming code:', error);
      showToast('error', 'Error', 'Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
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

    if (newCode.every(digit => digit !== '')) {
      confirmCode(newCode.join(''));
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
                onSubmitEditing={handlePhoneNumberSubmit}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={() => requestOTP(phoneNumber)}
                disabled={otpLoading} // Disable button while loading
              >
                {otpLoading ? ( // Display loading indicator if OTP is being requested
                  <ActivityIndicator color={colors.background} />
                ) : (
                  <Text style={styles.buttonText}>Get OTP</Text>
                )}
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
                    onSubmitEditing={() => {
                      if (code.every(digit => digit !== '')) {
                        confirmCode(code.join(''));
                      }
                    }}
                  />
                ))}
              </View>
              <TouchableOpacity style={styles.button} onPress={confirmCode}>
                {loading ? (
                  <ActivityIndicator color={colors.background} />
                ) : (
                  <Text style={styles.buttonText}>Confirm Code</Text>
                )}
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
    marginTop: -15,
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
    fontFamily: 'Outfit-Medium',
    color: colors.textPrimary,
    marginBottom: sizes.marginVertical,
  },
  label: {
    fontSize: sizes.labelTextSize,
    fontWeight: '400',
    fontFamily: 'Outfit-Medium',
    alignSelf: 'flex-start',
    marginTop: 10,
    marginBottom: 5,
    color: colors.textPrimary,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    marginTop: 40,
    width: '80%',
  },
  otpContent: {
    flex: 1,
    alignItems: 'center',
    marginTop: 40,
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
    fontFamily: 'Outfit-Medium',
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
    fontFamily: 'Outfit-Medium',
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
    fontFamily: 'Outfit-Medium',
    color: colors.background,
  },
  otpText: {
    marginBottom: sizes.marginVertical,
    fontSize: sizes.inputFontSize,
    fontFamily: 'Outfit-Medium',
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
    fontFamily: 'Outfit-Medium',
    color: colors.textPrimary,
  },
  resendButtonText: {
    fontSize: sizes.inputFontSize,
    fontFamily: 'Outfit-Medium',
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
    fontFamily: 'Outfit-Medium',
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
    fontFamily: 'Outfit-Medium',
    color: '#333333',
    marginLeft: 10,
  },
  googleLogo: {
    width: 24,
    height: 24,
  },
});

export default OTPVerificationScreen;
