import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Collapsible from 'react-native-collapsible';
import Icon from 'react-native-vector-icons/MaterialIcons'; // You can use other icon libraries if needed

const FAQScreen = () => {
  const [collapsed, setCollapsed] = useState({});

  const toggleCollapse = (index) => {
    setCollapsed(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const faqs = [
    { question: "What is your return policy?", answer: "Our return policy lasts 30 days..." },
    { question: "How do I track my order?", answer: "You can track your order using the tracking link we provide..." },
    { question: "Do you ship internationally?", answer: "Yes, we do ship internationally..." },
    { question: "How can I contact customer service?", answer: "You can contact customer service via email or phone..." },
    { question: "What payment methods are accepted?", answer: "We accept various payment methods including credit cards and PayPal..." }
  ];

  return (
    <View style={styles.container}>
      {faqs.map((faq, index) => (
        <View key={index} style={styles.card}>
          <TouchableOpacity onPress={() => toggleCollapse(index)} style={styles.header}>
            <Text style={styles.question}>{faq.question}</Text>
            <Icon
              name={collapsed[index] ? 'expand-less' : 'expand-more'}
              size={24}
              color="#000"
            />
          </TouchableOpacity>
          <Collapsible collapsed={!collapsed[index]}>
            <View style={styles.body}>
              <Text style={styles.answer}>{faq.answer}</Text>
            </View>
          </Collapsible>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  question: {
    flex: 1,
    fontFamily: 'Outfit-Medium',
    fontSize: 16,
    color: '#333',
  },
  body: {
    padding: 16,
  },
  answer: {
    fontFamily: 'Outfit-Medium',
    fontSize: 14,
    color: '#666',
  },
});

export default FAQScreen;
