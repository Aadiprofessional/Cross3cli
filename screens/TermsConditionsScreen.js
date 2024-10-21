import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../styles/color';
import Icon from 'react-native-vector-icons/Feather'; // Import Feather icons
import RenderHTML from 'react-native-render-html'; // Import the render HTML library

const htmlContent = `
<h1>Terms and Conditions</h1>
<p><strong>Last Updated:</strong> [Insert Date]</p>
<p>Welcome to <strong>CrossBEE</strong> (“we,” “us,” or “our”). These terms and conditions ("Terms") govern your access to and use of our website, mobile application, and other online services (collectively, the "Services"). Please read these Terms carefully before accessing or using our Services. By accessing or using any part of the Services, you agree to be bound by these Terms. If you do not agree to all the Terms, then you may not access the Services.</p>
<h2>1. Eligibility</h2>
<p>By using CrossBEE, you affirm that you are at least 18 years old, or have the legal capacity to enter into a contract in your jurisdiction. If you are using the Services on behalf of a company or organization, you represent and warrant that you are authorized to bind that entity to these Terms.</p>
<h2>2. Account Registration</h2>
<p>To access certain features of our Services, you may be required to create an account. You are responsible for maintaining the confidentiality of your account information, including your username and password. You agree to provide accurate, complete, and current information during registration and to update such information as necessary.</p>
<h2>3. User Responsibilities</h2>
<ul>
    <li>You agree not to use the Services for any unlawful or prohibited activities.</li>
    <li>You are responsible for all activities under your account.</li>
    <li>You must not misuse the Services by introducing viruses, malware, or other harmful material.</li>
</ul>
<h2>4. Payment and Pricing</h2>
<p>All prices listed on CrossBEE are subject to change without notice. You agree to pay for all products and services you purchase through our platform. We reserve the right to cancel or modify orders in case of any errors or inaccuracies in pricing or availability.</p>
<h2>5. Intellectual Property</h2>
<p>All content on CrossBEE, including but not limited to text, graphics, logos, and software, is the property of CrossBEE or its licensors and is protected by copyright, trademark, and other intellectual property laws.</p>
<h2>6. Termination</h2>
<p>We may suspend or terminate your access to the Services at any time, without prior notice or liability, for any reason, including your breach of these Terms.</p>
<h2>7. Limitation of Liability</h2>
<p>In no event shall CrossBEE, its officers, directors, employees, or agents be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with the use or inability to use our Services.</p>
<h2>8. Governing Law</h2>
<p>These Terms shall be governed by and construed in accordance with the laws of [Insert Jurisdiction], without regard to its conflict of law principles.</p>
<h2>9. Changes to Terms</h2>
<p>We reserve the right to update or modify these Terms at any time. Any changes will be effective immediately upon posting on our website. Your continued use of the Services after the posting of revised Terms constitutes your agreement to the changes.</p>
<h2>10. Contact Information</h2>
<p>If you have any questions about these Terms, please contact us at [Insert Contact Information].</p>
`;

const TermsConditionsScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: colors.main }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name="arrow-left"
            size={24}
            color="#FFFFFF"
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms and Conditions</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <RenderHTML
          contentWidth={400} // Adjust based on your design
          source={{ html: htmlContent }}
          tagsStyles={{
            h1: { color: 'black', fontFamily: 'Outfit-Medium' },  // Styles for <h1>
            h2: { color: 'black', fontFamily: 'Outfit-Medium' },  // Styles for <h2>
            p: { color: 'black', fontFamily: 'Outfit-Medium' },   // Styles for <p>
            li: { color: 'black', fontFamily: 'Outfit-Medium' },   // Styles for <li>
          }}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    fontFamily: 'Outfit-Medium',
    color: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
});

export default TermsConditionsScreen;
