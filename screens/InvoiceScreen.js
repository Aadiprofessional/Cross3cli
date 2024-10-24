import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Linking,
  Platform,
  PermissionsAndroid,
  ToastAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../styles/color';

const InvoiceScreen = ({ route }) => {
  const { invoiceData, quotationId, url } = route.params; 
  const [pdfPath, setPdfPath] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigation = useNavigation();
  const userId = auth().currentUser?.uid;

  if (!userId) {
    Alert.alert('Error', 'User not authenticated.');
    return null;
  }

  useEffect(() => {
    const fetchPhoneNumber = async () => {
      const savedPhoneNumber = await AsyncStorage.getItem('phoneNumber');
      setPhoneNumber(savedPhoneNumber || 'N/A');
    };

    fetchPhoneNumber();
  }, []);

  useEffect(() => {
    if (pdfPath) {
      sendQuotation();
    }
  }, [pdfPath]);

  const sendQuotation = async () => {
    const formattedNumber = phoneNumber.replace(/^91/, ''); // Remove '91' from the phone number
    const body = {
      url: pdfPath,
      phone: formattedNumber,
    };

    try {
      const response = await fetch('https://crossbee-server-1036279390366.asia-south1.run.app/sendQuotation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Quotation sent successfully:', data);
        ToastAndroid.show('Quotation sent successfully!', ToastAndroid.SHORT);
      } else {
        console.error('Error sending quotation:', data);
        ToastAndroid.show('Failed to send quotation.', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error('Network error:', error);
      ToastAndroid.show('Network error while sending quotation.', ToastAndroid.SHORT);
    }
  };

  useEffect(() => {
    const handlePdfGeneration = async () => {
      if (Platform.OS === 'android' && Platform.Version >= 30) {
        await generatePdf();
      } else if (Platform.OS === 'android') {
        const granted = await requestStoragePermission();
        if (granted) {
          await generatePdf();
        } else {
          Alert.alert('Permission Denied', 'Storage permission is required to generate the PDF.');
        }
      } else {
        await generatePdf();
      }
    };

    handlePdfGeneration();
  }, [invoiceData]);

  const requestStoragePermission = async () => {
    try {
      const permission =
        Platform.Version >= 30
          ? PermissionsAndroid.PERMISSIONS.MANAGE_EXTERNAL_STORAGE
          : PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

      const granted = await PermissionsAndroid.request(permission, {
        title: 'Storage Permission Required',
        message: 'This app needs access to your storage to download the PDF',
      });

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const generatePdf = async () => {
    console.log("Starting PDF Generation...");
    const startTime = Date.now();

    const htmlContent = `
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Invoice</title>
          <style>
              body { font-family: 'Roboto', sans-serif; }
              .logo { width: 150px; height: auto; }
              .invoice-section { display: flex; justify-content: space-between; margin-top: 20px; }
              .invoice-to, .invoice-from { width: 50%; }
              .invoice-to { text-align: left; }
              .invoice-from { text-align: right; }
              .invoice-header { border-top: 3px solid #FCCC51; border-bottom: 3px solid #FCCC51; margin: 30px 0; padding: 10px 0; }
              .invoice-header h2 { margin: 0; font-size: 2rem; font-weight: bold; color: #000; }
              .text-primary { color: #FCCC51 !important; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { padding: 8px 12px; text-align: left; }
              th { background-color: #f2f2f2; }
              td { background-color: #ffffff; }
              tr:nth-child(odd) td { background-color: #f2f2f2; } /* Alternate row colors */
              .quantity-title { color: #000; font-weight: bold; }
              .quantity-number { color: #333; }
          </style>
          </head>
        <body>
          <h1>Invoice</h1>
          <p>Total Amount: ${invoiceData.totalAmount.toFixed(2)}</p>
          <p>Shipping Charges: ${invoiceData.shippingCharges.toFixed(2)}</p>
          <p>Additional Discount: ${invoiceData.additionalDiscount.toFixed(2)}</p>
        </body>
      </html>
    `;

    const fileName = `invoice_${invoiceData.orderId}.pdf`;
    const options = {
      html: htmlContent,
      fileName: fileName,
      directory: 'Documents', 
    };

    try {
      const { filePath: generatedFilePath } = await RNHTMLtoPDF.convert(options);
      console.log("PDF Generated at:", generatedFilePath);

      // Upload to Firebase Storage
      console.log("Starting PDF Upload...");
      const reference = storage().ref(`users/${userId}/${quotationId}`);
      await reference.putFile(generatedFilePath);

      // Get download URL
      console.log("Fetching Download URL...");
      const downloadURL = await reference.getDownloadURL();

      ToastAndroid.show('PDF uploaded and saved successfully.', ToastAndroid.SHORT);
      setPdfPath(downloadURL);
      console.log("PDF Path:", downloadURL);
    } catch (error) {
      console.error("Error generating or uploading PDF:", error);
    }
  };

  const handleOpenInvoice = (url) => {
    if (url && /^https?:\/\//i.test(url)) {
      Linking.openURL(url).catch(err => {
        console.error('Failed to open URL:', err);
      });
    } else {
      console.log('No valid invoice URL provided');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>INVOICE</Text>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>
          Total Amount: {Number(invoiceData.totalAmount.toFixed(2)).toLocaleString("en-IN", { style: 'currency', currency: 'INR' })}
        </Text>
        <Text style={styles.subtitle}>
          Shipping Charges: {Number(invoiceData.shippingCharges.toFixed(2)).toLocaleString("en-IN", { style: 'currency', currency: 'INR' })}
        </Text>
        <Text style={styles.subtitle}>
          Additional Discount: {Number(invoiceData.additionalDiscount.toFixed(2)).toLocaleString("en-IN", { style: 'currency', currency: 'INR' })}
        </Text>
      </View>

      <View style={styles.container2}>
        <TouchableOpacity
          style={styles.button3}
          onPress={() => {
            try {
              navigation.reset({
                index: 0,
                routes: [{ name: 'HomeTab' }],
              });
            } catch (error) {
              console.error('Navigation error:', error);
            }
          }}
        >
          <Text style={styles.buttonText}>Explore More</Text>
        </TouchableOpacity>
        {url && (
          <TouchableOpacity style={styles.downloadButton} onPress={() => handleOpenInvoice(url)}>
            <View style={styles.iconContainer}>
              <Text style={styles.downloadText}>Download Quotation</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  downloadButton: {
    padding: 10,
    backgroundColor: colors.main,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  downloadText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Outfit-Bold',
  },
  container2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Outfit-Bold',
    color: colors.TextBlack,
  },
  logo: {
    width: 150,
    height: 40,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Outfit-Bold',
    marginBottom: 10,
    color: colors.TextBlack,
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
    fontFamily: 'Outfit-Bold',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default InvoiceScreen;
