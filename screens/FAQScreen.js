import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Collapsible from 'react-native-collapsible';
import Icon from 'react-native-vector-icons/MaterialIcons'; // You can use other icon libraries if needed
import axios from 'axios';

const FAQScreen = () => {
  const [collapsed, setCollapsed] = useState({});
  const [faq, setFaq] = useState([]); // State for FAQs

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await axios.get('https://crossbee-server-1036279390366.asia-south1.run.app/faqs');
        setFaq(response.data); // Set fetched FAQs to state
      } catch (error) {
        console.error('Error fetching FAQs:', error);
        Alert.alert('Error', 'Failed to fetch FAQs. Please try again later.'); // Handle errors
      }
    };

    fetchFAQs();
  }, []);

  const toggleCollapse = (index) => {
    setCollapsed(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <View style={styles.container}>
      {faq.map((faq, index) => (
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
