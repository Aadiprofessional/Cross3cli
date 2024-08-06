import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Image,
  route,
} from 'react-native';
import axios from 'axios'; // Import axios or your preferred HTTP client
import Toast from 'react-native-toast-message';
import { sizes } from '../styles/size';
import { colors } from '../styles/color';



const OTPscreen = ({route, navigation}) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const textInputRefs = useRef(
    Array(6)
      .fill(null)
      .map(() => React.createRef()),
  );

  // Extract token and orderId from route params
  const {token, orderId} = route.params;

  useEffect(() => {
    let timerInterval;
    if (timer > 0) {
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
  }, [timer]);

  const confirmCode = async () => {
    try {
      const completeCode = code.join('');
      let response = await axios.get(
        'https://crossbee-server.vercel.app/verifyOtp?phoneNumber=91' +
          phoneNumber +
          '&orderId=' +
          orderId +
          '&otp=' +
          completeCode,
      );
      if (response.data.isOTPVerified) {
        showToast('success', 'Success', 'OTP verified!');
        navigation.replace('HomeTab'); // Navigate to the next screen
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
        // Replace this URL with your actual resend OTP endpoint
        await axios.get(
          `https://crossbee-server.vercel.app/resendOtp?orderId=${orderId}`,
        );
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={require('../assets/login_top.png')}
          style={styles.topImage}
        />
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.welcomeText}>Welcome to Cross Bee</Text>
        <Text style={styles.otpText}>
          Enter the 6-digit OTP sent to your phone
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
              cursorColor="#000"
              placeholderTextColor="#888"
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
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 20,
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
  otpText: {
    marginBottom: 20,
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
  otpInputsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginVertical: 20,
  },
  otpInput: {
    width: '14%',
    height: 50,
    marginHorizontal: 5,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 18,
    color: '#000',
  },
  activeOtpInput: {
    borderColor: colors.main,
    backgroundColor: '#E3F2FD',
  },
  button: {
    width: '80%',
    padding: 15,
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: colors.main,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
  },
  timerResendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 20,
  },
  timerText: {
    fontSize: 16,
    color: '#000',
  },
  resendButtonText: {
    fontSize: 16,
    color: colors.second,
  },
});

export default OTPscreen;
