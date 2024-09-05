import axios from 'axios';
import auth from '@react-native-firebase/auth';
const userId = auth().currentUser.uid;

const API_URL =
  'https://crossbee-server-1036279390366.asia-south1.run.app/searchItems?uid=' + userId;

export const fetchProducts = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};
