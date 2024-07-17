import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { PDFDocument, PDFPage, PDFText } from 'react-native-pdf-lib';
import RNFS from 'react-native-fs';

const InvoiceScreen = ({ route }) => {
  const { invoiceData } = route.params;

  const generateInvoicePDF = async () => {
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([400, 600]);

      const invoiceContent = `
        Invoice
        ----------
        Total Amount: $${invoiceData.totalAmount.toFixed(2)}
        Shipping Charges: $10.00
        Additional Discount: $5.00
        ----------------------
        Final Total: $${(invoiceData.totalAmount + 10 - 5).toFixed(2)}
      `;

      const { width, height } = page.getSize();
      await page.drawText(invoiceContent, {
        x: 50,
        y: height - 50,
        size: 20,
      });

      const pdfBytes = await pdfDoc.save();
      const invoicePath = `${RNFS.DocumentDirectoryPath}/invoice_${Date.now()}.pdf`;
      await RNFS.writeFile(invoicePath, pdfBytes, 'base64');

      return invoicePath;
    } catch (error) {
      console.error('Failed to generate invoice:', error);
      throw error;
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const invoicePath = await generateInvoicePDF();
      Alert.alert('Invoice Generated', `Invoice saved at: ${invoicePath}`);
    } catch (error) {
      console.error('Error generating invoice:', error);
      Alert.alert('Error', 'Failed to generate invoice. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Invoice Screen</Text>
      <TouchableOpacity style={styles.downloadButton} onPress={handleDownloadPDF}>
        <Text style={styles.downloadButtonText}>Download PDF</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default InvoiceScreen;
