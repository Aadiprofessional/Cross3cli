import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {colors} from '../styles/color';
import {sizes} from '../styles/size';

const LoginScreen = ({navigation}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [showOtp, setShowOtp] = useState(false);
  const otpInputs = useRef([]);

  const handlePhoneNumberChange = value => {
    // Limit input to 10 digits and only allow numeric input
    const formattedValue = value.replace(/[^\d]/g, '').slice(0, 10);
    setPhoneNumber(formattedValue);
  };

  const handleGetOtp = () => {
    setShowOtp(true);
    // Focus on the first OTP input block
    if (otpInputs.current[0]) {
      otpInputs.current[0].focus();
    }
  };

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otpInputs.current.length - 1) {
      otpInputs.current[index + 1].focus();
    }
  };

  const handleLogin = () => {
    // Handle OTP verification logic here
    navigation.replace('Home');
  };

  const handleResendOtp = () => {
    // Handle OTP resend logic here
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Image
        source={require('../assets/login_top.png')}
        style={styles.topImage}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.welcomeText}>Welcome to Cross Bee</Text>
        <Text style={styles.label}>Phone Number</Text>
        <View style={styles.phoneInputContainer}>
          <Text style={styles.phonePrefix}>+91</Text>
          <TextInput
            style={styles.phoneInput}
            placeholder="Enter your phone number"
            placeholderTextColor={colors.inputPlaceholder}
            value={phoneNumber}
            onChangeText={handlePhoneNumberChange}
            keyboardType="phone-pad"
            maxLength={10}
            cursorColor={colors.buttonBackground}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleGetOtp}>
          <Text style={styles.buttonText}>Get OTP</Text>
        </TouchableOpacity>
        {showOtp && (
          <>
            <Text style={styles.label}>Enter OTP</Text>
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={el => (otpInputs.current[index] = el)}
                  style={[
                    styles.otpInput,
                    {
                      borderColor: otp[index]
                        ? colors.main
                        : colors.inputPlaceholder,
                    },
                  ]}
                  value={digit}
                  onChangeText={value => handleOtpChange(value, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  cursorColor={colors.main}
                />
              ))}
            </View>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Verify OTP</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleResendOtp}>
              <Text style={styles.resendButtonText}>Resend OTP</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20, // Adjust as needed
  },
  topImage: {
    width: '100%',
    height: sizes.topImageHeight,
    resizeMode: 'contain',
    marginTop: -25, // Adjust as needed
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
    fontFamily: 'Outfit-Medium',
    marginBottom: sizes.marginMax * 5,
    color: colors.textPrimary,
  },
  label: {
    fontSize: sizes.labelTextSize,
    fontWeight: '400',
    fontFamily: 'Outfit-Medium',
    alignSelf: 'flex-start',
    marginLeft: '10%',
    marginTop: 10,
    marginBottom: 5,
    color: colors.textPrimary,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    backgroundColor: colors.inputBackground,
    borderRadius: sizes.borderRadius,
    paddingHorizontal: sizes.padding,
    marginVertical: sizes.marginVertical,
  },
  phonePrefix: {
    fontSize: sizes.inputFontSize,
    fontFamily: 'Outfit-Medium',
    color: colors.textPrimary,
    marginRight: 10,
  },
  phoneInput: {
    flex: 1,
    fontSize: sizes.inputFontSize,
    fontFamily: 'Outfit-Medium',
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
    fontFamily: 'Outfit-Medium',
    color: colors.background,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginVertical: sizes.marginVertical,
  },
  otpInput: {
    width: '15%',
    padding: sizes.padding,
    borderRadius: sizes.borderRadius,
    backgroundColor: colors.inputBackground,
    fontSize: sizes.inputFontSize,
    fontWeight: '400',
    fontFamily: 'Outfit-Medium',
    color: colors.textPrimary,
    borderWidth: 1,
    textAlign: 'center',
  },
  resendButtonText: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Outfit-Medium',
    color: colors.second,
    marginTop: sizes.marginVertical,
  },
});

export default LoginScreen;
