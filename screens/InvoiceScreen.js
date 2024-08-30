import React, {useEffect, useState} from 'react';
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
import RNFS from 'react-native-fs';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import FileViewer from 'react-native-file-viewer';
import {colors} from '../styles/color';
import {useNavigation} from '@react-navigation/native';

const InvoiceScreen = ({route}) => {
  const {invoiceData} = route.params; // Destructure invoiceData from route params
  const [pdfPath, setPdfPath] = useState('');
  const navigation = useNavigation();
  useEffect(() => {
    const handlePdfGeneration = async () => {
      if (Platform.OS === 'android' && Platform.Version >= 30) {
        await generatePdf();
      } else if (Platform.OS === 'android') {
        const granted = await requestStoragePermission();
        if (granted) {
          await generatePdf();
        } else {
          Alert.alert(
            'Permission Denied',
            'Storage permission is required to generate the PDF.',
          );
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
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
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
        <section id="invoice">
            <div class="container my-5 py-5">
                <div class="text-center pb-5">
                    <img src="https://firebasestorage.googleapis.com/v0/b/crossbee.appspot.com/o/logo.png?alt=media&token=b7622c61-0fff-4083-ac26-a202a0cd970d" alt="Company Logo" class="logo">
                </div>

                <div class="invoice-section">
                    <div class="invoice-to">
                        <p class="fw-bold text-primary">Invoice To</p>
                        <h4>${invoiceData.customerName}</h4>
                        <ul class="list-unstyled m-0">
                            <li>${invoiceData.customerAddress}</li>
                            <li>${invoiceData.customerEmail}</li>
                            <li>${invoiceData.customerPhone}</li>
                        </ul>
                    </div>
                    <div class="invoice-from">
                        <p class="fw-bold text-primary">Invoice From</p>
                        <h4>Your Company Name</h4>
                        <ul class="list-unstyled m-0">
                            <li>Your Company Address</li>
                            <li>Your Company Email</li>
                            <li>Your Company Phone</li>
                        </ul>
                    </div>
                </div>

                <div class="invoice-header d-flex justify-content-between align-items-center">
    <h2 class="text-start">Invoice</h2>
    <div class="text-end">
        <p class="m-0"><span class="fw-medium">Invoice No:</span> ${
          invoiceData.orderId
        }</p>
        <p class="m-0"><span class="fw-medium">Invoice Date:</span> ${
          invoiceData.orderDate
        }</p>
        <p class="m-0"><span class="fw-medium">Due Date:</span> ${
          invoiceData.dueDate
        }</p>
    </div>
</div>


                <table>
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>
                                <div class="quantity-title">Quantity</div>
                                <div class="quantity-number">(Number)</div>
                            </th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${invoiceData.cartItems
                          .map(
                            (item, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${item.name}</td>
                            <td>${item.price}</td>
                            <td>${item.quantity}</td>
                            <td>${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>`,
                          )
                          .join('')}
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>Sub-Total</td>
                            <td>${invoiceData.totalAmount}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>TAX ${invoiceData.taxRate}%</td>
                            <td>${invoiceData.taxAmount}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td class="text-primary fs-5 fw-bold">Grand-Total</td>
                            <td class="text-primary fs-5 fw-bold">${
                              invoiceData.totalAmount
                            }</td>
                        </tr>
                    </tbody>
                </table>
            </div>
               <div class="d-md-flex justify-content-between my-5">
                    <div>
                        <h5 class="fw-bold my-4">Payment Info</h5>
                        <ul class="list-unstyled">
                            <li><span class="fw-semibold">Account No: </span> 1234567890</li>
                            <li><span class="fw-semibold">Account Name: </span> Your Account Name</li>
                            <li><span class="fw-semibold">Branch Name: </span> Your Branch Name</li>
                        </ul>
                    </div>

                    <div>
                        <h5 class="fw-bold my-4">Contact Us</h5>
                        <ul class="list-unstyled">
                            <li>123 Your Street, Your City</li>
                            <li>+1 123 456 7890</li>
                            <li>youremail@company.com</li>
                        </ul>
                    </div>
                </div>

                <div class="text-center my-5">
                    <p class="text-muted"><span class="fw-semibold">NOTICE: </span> A finance charge of 1.5% will be made on unpaid balances after 30 days.</p>
                </div>

                <div id="footer-bottom">
                    <div class="container border-top border-primary">
                        <div class="row mt-3">
                            <div class="col-md-6 copyright">
                                <p>© 2024 Invoice. <a href="#" target="_blank" class="text-decoration-none text-black-50">Terms & Conditions</a></p>
                            </div>
                            <div class="col-md-6 text-md-end">
                                
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    </body>
    </html>
    `;

    const fileName = `invoice_${invoiceData.orderId}.pdf`;
    const downloadsDir = RNFS.DownloadDirectoryPath; // This should point to the main Downloads directory on Android
    const filePath = `${downloadsDir}/${fileName}`;

    const options = {
      html: htmlContent,
      fileName: fileName,
      directory: 'Download', // Use 'Download' instead of 'downloadsDir' to specify the main Downloads directory
    };
    try {
      const {filePath: generatedFilePath} = await RNHTMLtoPDF.convert(options);

      // Notify user
      ToastAndroid.show('PDF downloaded successfully.', ToastAndroid.SHORT);

      // Refresh the media scanner on Android
      await RNFS.scanFile(generatedFilePath);

      setPdfPath(generatedFilePath);
      Alert.alert(
        'Success',
        `PDF generated and saved to Downloads: ${generatedFilePath}`,
      );
    } catch (error) {
      Alert.alert('Error', `Failed to generate PDF: ${error.message}`);
    }
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>INVOICE</Text>
        <Image
          source={require('../assets/logo.png')} // Replace with your logo path
          style={styles.logo}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>
          Total Amount: ₹{invoiceData.totalAmount.toFixed(2)}
        </Text>
        <Text style={styles.subtitle}>
          Shipping Charges: ₹{invoiceData.shippingCharges.toFixed(2)}
        </Text>
        <Text style={styles.subtitle}>
          Additional Discount: ₹{invoiceData.additionalDiscount.toFixed(2)}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Items</Text>
        {invoiceData.cartItems.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableData}>{item.name}</Text>
            <Text style={styles.tableData}>{item.quantity}</Text>
            <Text style={styles.tableData}>
              ₹{(item.price * item.quantity).toFixed(2)}
            </Text>
          </View>
        ))}
      </View>
      <View style={styles.container2}>
        <TouchableOpacity
          style={styles.button3}
          onPress={() => {
            try {
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: 'HomeTab',
                  },
                ],
              });
            } catch (error) {
              console.error('Navigation error:', error);
            }
          }}>
          <Text style={styles.buttonText}>Start Shopping</Text>
        </TouchableOpacity>
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
  container2: {
    flex: 1, // Takes up the full space of the screen
    justifyContent: 'center', // Centers content vertically
    alignItems: 'center', // Centers content horizontally
    backgroundColor: '#fff', // Optional: sets the background color of the screen
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
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
    fontWeight: 'bold',
    fontFamily: 'Outfit-Bold',
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
    fontFamily: 'Outfit-Bold',
    color: '#333333',
  },
  button3: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 40, // Optional: add horizontal padding for better button shape
    backgroundColor: colors.main,
    borderRadius: 5,
    marginTop: 20,
    alignSelf: 'center', // This will keep it centered horizontally within its container
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Outfit-Bold',
  },

  tableRowAlt: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    backgroundColor: '#ffffff', // White background
  },
});

export default InvoiceScreen;
