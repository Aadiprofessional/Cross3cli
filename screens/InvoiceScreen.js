import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image, PermissionsAndroid, Platform } from 'react-native';
import RNFS from 'react-native-fs';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import FileViewer from 'react-native-file-viewer';
import { colors } from '../styles/color';

const InvoiceScreen = ({ route }) => {
  const { invoiceData } = route.params;
  const [pdfPath, setPdfPath] = useState('');

  useEffect(() => {
    const handlePdfGeneration = async () => {
      if (Platform.OS === 'android') {
        if (Platform.Version >= 30) {
          await generatePdf();
        } else {
          const granted = await requestStoragePermission();
          if (granted) {
            await generatePdf();
          } else {
            Alert.alert('Permission Denied', 'Storage permission is required to generate the PDF.');
          }
        }
      } else {
        await generatePdf();
      }
    };

    handlePdfGeneration();
  }, [invoiceData]);

  const requestStoragePermission = async () => {
    try {
      if (Platform.Version >= 30) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.MANAGE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'This app needs access to your storage to download the PDF',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'This app needs access to your storage to download the PDF',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const generatePdf = async () => {
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .title { font-size: 24px; font-weight: bold; }
            .logo { width: 100px; height: 100px; margin-bottom: 20px; }
            .section { margin-bottom: 20px; }
            .subtitle { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
            .table { width: 100%; }
            .tableRow { display: flex; justify-content: space-between; padding: 5px 0; }
            .tableData { font-size: 16px; }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="file:///android_asset/logo.png" alt="Logo" class="logo" />
            <div class="title">INVOICE</div>
          </div>
          <div class="section">
            <div class="subtitle">Total Amount: ₹${invoiceData.totalAmount.toFixed(2)}</div>
            <div class="subtitle">Shipping Charges: ₹${invoiceData.shippingCharges.toFixed(2)}</div>
            <div class="subtitle">Additional Discount: ₹${invoiceData.additionalDiscount.toFixed(2)}</div>
          </div>
          <div class="section">
            <div class="subtitle">Items</div>
            <div class="table">
              ${invoiceData.cartItems.map(item => `
                <div class="tableRow">
                  <div class="tableData">${item.name}</div>
                  <div class="tableData">${item.quantity}</div>
                  <div class="tableData">₹${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </body>
      </html>
    `;

    const fileName = `invoice_${invoiceData.orderId}`; // Unique file name based on order ID
    const options = {
      html: htmlContent,
      fileName: fileName,
      directory: 'Documents', // Save to a public directory
      base64: false,
    };

    try {
      const pdf = await RNHTMLtoPDF.convert(options);
      const newFilePath = `${RNFS.ExternalDirectoryPath}/${fileName}.pdf`; // Use ExternalDirectoryPath
      await RNFS.moveFile(pdf.filePath, newFilePath);
      setPdfPath(newFilePath);
      Alert.alert('Success', `PDF generated successfully at: ${newFilePath}`);
    } catch (error) {
      Alert.alert('Error', `Failed to generate the PDF. ${error.message}`);
    }
  };

  const openPdf = async () => {
    if (pdfPath) {
      try {
        await FileViewer.open(pdfPath);
      } catch (error) {
        Alert.alert('Error', `Cannot open PDF: ${error.message}`);
      }
    } else {
      Alert.alert('Error', 'Failed to generate the PDF.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>INVOICE</Text>
        <Image
          source={require('../assets/logo.png')} // Replace with your logo URL
          style={styles.logo}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Total Amount: ₹{invoiceData.totalAmount.toFixed(2)}</Text>
        <Text style={styles.subtitle}>Shipping Charges: ₹{invoiceData.shippingCharges.toFixed(2)}</Text>
        <Text style={styles.subtitle}>Additional Discount: ₹{invoiceData.additionalDiscount.toFixed(2)}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Items</Text>
        {invoiceData.cartItems.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableData}>{item.name}</Text>
            <Text style={styles.tableData}>{item.quantity}</Text>
            <Text style={styles.tableData}>₹{(item.price * item.quantity).toFixed(2)}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.downloadButton} onPress={openPdf}>
        <Text style={styles.downloadButtonText}>Open PDF</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.TextBlack,
  },
  logo: {
    alignItems: 'right',
    width: 150,
    height: 40,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.TextBlack,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  tableData: {
    fontSize: 16,
    color: '#333333',
  },
  downloadButton: {
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: colors.main,
    borderRadius: 5,
    marginTop: 20,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default InvoiceScreen;
