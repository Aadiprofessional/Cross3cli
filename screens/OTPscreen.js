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
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import {sizes} from '../styles/size';
import {colors} from '../styles/color';
import SmsRetriever from 'react-native-sms-retriever';

const OTPScreen = ({route, navigation}) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const textInputRefs = useRef(
    Array(6)
      .fill(null)
      .map(() => React.createRef()),
  );

  // Extract phoneNumber and orderId from route params
  const {phoneNumber, orderId} = route.params;

  // Log phoneNumber and orderId
  useEffect(() => {
    console.log('Phone Number:', phoneNumber);
    console.log('Order ID:', orderId);
  }, [phoneNumber, orderId]);

  // Start SMS Retriever
  useEffect(() => {
    const startSMSListener = async () => {
      try {
        const registered = await SmsRetriever.startSmsRetriever();
        if (registered) {
          SmsRetriever.addSmsListener(event => {
            console.log('Message:', event.message);
            // Extract the OTP code from the message using regex
            const otpRegex = /\b(\d{6})\b/;
            const otp = otpRegex.exec(event.message)[1];
            if (otp) {
              const otpArray = otp.split('');
              setCode(otpArray);
              // Focus the last input box
              textInputRefs.current[5].current.focus();
              SmsRetriever.removeSmsListener();
            }
          });
        }
      } catch (error) {
        console.error('Failed to start SMS Retriever:', error);
      }
    };

    startSMSListener();
    return () => SmsRetriever.removeSmsListener();
  }, []);

  // Set initial focus on the first input
  useEffect(() => {
    if (textInputRefs.current[0].current) {
      textInputRefs.current[0].current.focus();
    }
  }, []);

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
    setLoading(true); // Start loading animation
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
    } finally {
      setLoading(false); // Stop loading animation
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
        <View style={styles.topImageContainer}>
          <Image
            source={require('../assets/login_top.png')}
            style={styles.topImage}
          />
        </View>
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
        <TouchableOpacity
          style={styles.button}
          onPress={confirmCode}
          disabled={loading || code.includes('')} // Disable button if loading or any input is empty
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
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
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 20,
  },
  topImageContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  topImage: {
    width: '100%',
    height: sizes.topImageHeight,
    resizeMode: 'contain',
    marginTop: -43,
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
    fontFamily: 'Outfit-Bold',
    color: colors.textPrimary,
    marginBottom: sizes.marginVertical,
  },
  otpText: {
    marginBottom: 20,
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
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
    fontFamily: 'Outfit-Medium',
    color: '#000',
  },
  activeOtpInput: {
    borderColor: colors.main,
  },
  button: {
    width: '80%',
    padding: 15,
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: colors.main,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
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
    fontFamily: 'Outfit-Medium',
    color: '#000',
  },
  resendButtonText: {
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    color: colors.second,
  },
});

export default OTPScreen;
