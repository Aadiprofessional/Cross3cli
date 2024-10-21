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
<h1>Privacy Policy</h1>
<p><strong>Last Updated:</strong> [Insert Date]</p>

<p>At <strong>CrossBEE</strong>, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our mobile application and services (collectively, the "Services"). Please read this policy carefully to understand our practices regarding your personal information.</p>

<h2>1. Information We Collect</h2>
<p>We may collect the following types of information:</p>
<ul>
    <li><strong>Personal Information:</strong> Includes name, email address, phone number, billing address, and payment information that you voluntarily provide when creating an account or making a purchase.</li>
    <li><strong>Non-Personal Information:</strong> Information that does not personally identify you, such as your IP address, browser type, device type, and browsing behavior on our site.</li>
</ul>

<h2>2. How We Use Your Information</h2>
<p>We may use the information we collect for the following purposes:</p>
<ul>
    <li>To provide, maintain, and improve our Services.</li>
    <li>To process transactions and deliver the products and services you request.</li>
    <li>To communicate with you about your account, orders, and updates.</li>
    <li>To personalize your experience on our platform.</li>
    <li>To analyze usage and trends to improve the user experience.</li>
</ul>

<h2>3. How We Share Your Information</h2>
<p>We do not sell, trade, or rent your personal information to third parties. However, we may share your information with:</p>
<ul>
    <li><strong>Service Providers:</strong> Third-party companies that help us operate our business, such as payment processors, shipping companies, and marketing service providers.</li>
    <li><strong>Legal Obligations:</strong> If required by law, we may disclose your information to comply with legal obligations, such as responding to a court order or government request.</li>
</ul>

<h2>4. Cookies and Tracking Technologies</h2>
<p>We use cookies and similar tracking technologies to collect information about your interactions with our Services. Cookies are small files stored on your device that help us enhance the functionality of our platform. You can manage your cookie preferences through your browser settings.</p>

<h2>5. Data Security</h2>
<p>We implement a variety of security measures to protect your personal information from unauthorized access, use, or disclosure. However, no method of transmission over the internet or method of electronic storage is 100% secure, and we cannot guarantee the absolute security of your information.</p>

<h2>6. Your Rights</h2>
<p>You have the following rights regarding your personal information:</p>
<ul>
    <li><strong>Access:</strong> You can request a copy of the personal data we hold about you.</li>
    <li><strong>Correction:</strong> You can request that we correct any inaccuracies in your personal data.</li>
    <li><strong>Deletion:</strong> You can request that we delete your personal data under certain circumstances.</li>
</ul>

<h2>7. Third-Party Links</h2>
<p>Our Services may contain links to third-party websites or services. We are not responsible for the privacy practices or the content of these external sites. We encourage you to review the privacy policies of any third-party services you interact with.</p>

<h2>8. Children's Privacy</h2>
<p>Our Services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it.</p>

<h2>9. Changes to This Privacy Policy</h2>
<p>We may update this Privacy Policy from time to time. Any changes will be effective immediately upon posting on our website. Your continued use of the Services after the posting of revised Privacy Policy constitutes your agreement to the changes.</p>

<h2>10. Contact Us</h2>
<p>If you have any questions or concerns about this Privacy Policy, please contact us at [Insert Contact Information].</p>
`;


const PrivacyPolicyScreen = () => {
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
        <Text style={styles.headerTitle}>Privacy Policy</Text>
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

export default PrivacyPolicyScreen;
