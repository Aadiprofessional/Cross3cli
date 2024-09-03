import React, {useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  Platform,
  Image,
  Linking,
} from 'react-native';
import LottieView from 'lottie-react-native';
import {
  useNavigation,
  useFocusEffect,
  useRoute,
} from '@react-navigation/native';
import {colors} from '../styles/color';
import Icon from 'react-native-vector-icons/Feather';

const ThankYouScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {orderId, invoiceData} = route.params;

  const handleBackButtonPress = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [{name: 'HomeTab'}],
    });
    return true; // Prevent default behavior (going back to previous screen)
  }, [navigation]);
  const handleWhatsApp = () => {
    const phoneNumber = '9924686611';
    Linking.openURL(`https://wa.me/${phoneNumber}`);
  };
  console.log('Order ID in ThankYouScreen:', orderId);
  const handleCall = () => {
    const phoneNumber = '9924686611';
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleMail = () => {
    const email = 'ecomrtepl@gmail.com';
    Linking.openURL(`mailto:${email}`);
  };
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'android') {
        BackHandler.addEventListener(
          'hardwareBackPress',
          handleBackButtonPress,
        );
      }
      return () => {
        if (Platform.OS === 'android') {
          BackHandler.removeEventListener(
            'hardwareBackPress',
            handleBackButtonPress,
          );
        }
      };
    }, [handleBackButtonPress]),
  );

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/Animation - 1724952662598.json')} // Replace with your tick animation file
        autoPlay
        loop={false}
        style={styles.animation}
      />
      <Text style={styles.thankYouText}>Your order is in processing</Text>
      <Text>Your Order ID is: {orderId}</Text>
      <View style={styles.container2}>
        <TouchableOpacity
          style={styles.button3}
          onPress={() => {
            try {
              navigation.reset({
                index: 0,
                routes: [{name: 'HomeTab'}],
              });
            } catch (error) {
              console.error('Navigation error:', error);
            }
          }}>
          <Text style={styles.buttonText}>Explore more</Text>
        </TouchableOpacity>
        <View style={styles.container}>
          <TouchableOpacity style={styles.rectangle} onPress={handleWhatsApp}>
            <Image
              source={require('../assets/whatsapp.png')}
              style={styles.icon}
            />
            <View style={styles.textContainer}>
              <Text style={[styles.mediumText, {color: colors.main}]}>
                WhatsApp
              </Text>
              <Text style={styles.regularText}>
                Click the Chat with our staffs
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.rectangle} onPress={handleCall}>
            <Image source={require('../assets/call.png')} style={styles.icon} />
            <View style={styles.textContainer}>
              <Text style={[styles.mediumText, {color: colors.main}]}>
                Call
              </Text>
              <Text style={styles.regularText}>
                Click the Chat with our staffs
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.rectangle} onPress={handleMail}>
            <Image source={require('../assets/mail.png')} style={styles.icon} />
            <View style={styles.textContainer}>
              <Text style={[styles.mediumText, {color: colors.main}]}>
                Mail
              </Text>
              <Text style={styles.regularText}>
                Click the Chat with our staffs
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  animation: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  backIcon: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Outfit-Bold',
    color: '#FFFFFF',
  },
  rectangle: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 15,
    marginLeft: 10,
    marginRight: 10,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
    color: colors.TextBlack,
  },
  mediumText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Outfit-Bold',
    color: colors.TextBlack,
  },
  regularText: {
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    marginTop: 5,
    color: colors.TextBlack,
  },
  thankYouText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  orderIdText: {
    fontSize: 18,
    color: '#555',
    marginBottom: 20,
  },
  button3: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 40,
    backgroundColor: colors.main,
    borderRadius: 5,
    marginTop: 20,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Outfit-Bold',
  },
  container2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  queryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
  },
  queryText: {
    fontSize: 16,
    color: '#333',
    marginRight: 10,
  },
});

export default ThankYouScreen;
