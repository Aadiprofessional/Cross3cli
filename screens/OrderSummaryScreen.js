
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import CartItem from '../components/CartItem';
import { colors } from '../styles/color';
import { sizes } from '../styles/size';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import CheckBox from '@react-native-community/checkbox';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import CompanyDropdown from '../components/CompanyDropdown';
import { ActivityIndicator } from 'react-native-paper';
import CompanyDropdown2 from '../components/CompanyDropdown copy';
import CompanyDropdown3 from '../components/CompanyDropdown copy 3';
import CompanyDropdown4 from '../components/CompanyDropdown copy 2';

const OrderSummaryScreen = ({ route, navigation }) => {
  const {
    cartItems: initialCartItems,
    totalAmount: initialTotalAmount,
    totalAdditionalDiscountValue,
  } = route.params;
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [totalAmount, setTotalAmount] = useState(initialTotalAmount);
  const [couponCode, setCouponCode] = useState('');
  const [useRewardPoints, setUseRewardPoints] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [coupons, setCoupons] = useState([]);

  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [selectedPincode, setSelectedPincode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchRewardPoints();
  }, []);

  const fetchRewardPoints = async () => {
    try {
      const userId = auth().currentUser.uid;
      const response = await axios.get(
        `https://crossbee-server-1036279390366.asia-south1.run.app/getUserDetails?uid=${userId}`,
      );
      const rewardPoints = response.data.rewardPoints;

      setData(prevData => ({
        ...prevData,
        rewardPointsPrice: Math.min(totalAmount, rewardPoints),
      }));
    } catch (error) {
      console.error('Error fetching reward points:', error);
    }
  };

  // Update useEffect to recalculate totalAmount when reward points are fetched
  useEffect(() => {
    const newTotalAmount = calculateTotalAmount();
    setTotalAmount(newTotalAmount);
  }, [cartItems, useRewardPoints, appliedCoupon]);

  const [data, setData] = useState({
    rewardPointsPrice: 10,
    shippingCharges: 0,
    additionalDiscount: totalAdditionalDiscountValue,
  });
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get(
          'https://crossbee-server-1036279390366.asia-south1.run.app/coupons/' +
          auth().currentUser.uid,
        );
        setCoupons(response.data);
      } catch (error) {
        console.error('Error fetching coupons:', error);
        Alert.alert(
          'Error',
          'Failed to fetch coupons. Please try again later.',
        );
      }
    };

    fetchCoupons();
  }, []);

  useEffect(() => {
    const newTotalAmount = calculateTotalAmount();
    setTotalAmount(newTotalAmount);
  }, [cartItems, useRewardPoints, appliedCoupon]);

  const calculateTotalAmount = () => {
    let amount = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    if (useRewardPoints) {
      amount -= data.rewardPointsPrice;
    }
    if (appliedCoupon) {
      amount -= Number(appliedCoupon.value);
    }
    amount += data.shippingCharges - totalAdditionalDiscountValue;
    return Math.max(0, amount); // Ensure total amount does not go below zero
  };

  const calculateSubtotal = () => {
    let subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    if (appliedCoupon && !isNaN(appliedCoupon.value)) {
      subtotal -= appliedCoupon.value;
    }
    return Math.max(0, subtotal); // Ensure subtotal does not go below zero
  };

  {
    appliedCoupon && (
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Coupon Discount:</Text>
        <Text style={styles.couponDiscount}>
          -₹{Number(appliedCoupon.value)}
        </Text>
      </View>
    );
  }

  // Inside your JSX where you display the coupon discount:

  const handleUpdateQuantity = (id, quantity) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item,
      );
      return updatedItems.filter(item => item.quantity > 0);
    });
  };

  const handleRemoveItem = id => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };
  const handleSelectCompany = companyId => {
    setSelectedCompanyId(companyId);
  };

  const handlePincodeChange = pincode => {
    setSelectedPincode(pincode);
  };

  const handleApplyCoupon = () => {
    const coupon = coupons.find(c => c.code === couponCode);
    if (coupon) {
      // Convert value to number
      const couponValue = Number(coupon.value);
      if (!isNaN(couponValue)) {
        setAppliedCoupon({ ...coupon, value: couponValue });
        Alert.alert('Coupon applied', 'Coupon applied successfully!');
      } else {
        Alert.alert('Invalid coupon', 'Coupon value is not valid.');
      }
    } else {
      Alert.alert('Invalid coupon', 'Please enter a valid coupon code.');
    }
    setCouponCode('');
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    Alert.alert('Coupon removed', 'Coupon has been removed.');
  };

  const handleToggleRewardPoints = () => {
    setUseRewardPoints(prev => !prev);
  };

  const handleCheckout = async () => {
    if (!selectedCompanyId) {
      Alert.alert(
        'Select Company',
        'Please select a company before proceeding.',
      );
      return;
    }
    setIsLoading(true);

    try {
      const userId = auth().currentUser.uid;
      const response = await axios.post(
        `https://crossbee-server-1036279390366.asia-south1.run.app/checkout`,
        {
          totalAmount,
          data,
          useRewardPoints,
          appliedCoupon,
          cartItems,
          uid: userId,
          companyId: selectedCompanyId,
        },
      );
      console.log('Checkout response:', response.data);

      if (response.data.cartError) {
        Alert.alert(
          'Out of Stock',
          'Some items in your cart are out of stock. Please review your cart.',
        );
      } else if (response.data.orderId) {
        // Updated line
        console.log('Item added to cart successfully');
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: 'Order Placed Successfully',
          visibilityTime: 3000,
          autoHide: true,
          bottomOffset: 50,
        });
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'ThankYouScreen',
              params: {
                invoiceData: response.data.data,
                orderId: response.data.orderId, // Ensure orderId is being passed correctly
              },
            },
          ],
        });
      } else {
        console.error('Failed to checkout');
      }
    } catch (error) {
      console.error('Error saving order data: ', error);
      Alert.alert(
        'Out of Stock',
        'Some items in your cart are out of stock. Please review your cart.',
      );
    }
  };
  const formatPrice = price => {
    return price
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      .replace(/\d(?=(\d{2})+\d{3}\b)/g, '$&,');
  };


  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <Text style={styles.itemCount}>{cartItems.length} items:</Text>
          <Text style={styles.subtotal}>
            ₹{formatPrice(calculateSubtotal().toFixed(2))}
          </Text>
        </View>
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping Charges:</Text>
            <Text style={styles.summaryValue}>
              ₹{data.shippingCharges.toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Additional Discount:</Text>
            <Text style={styles.summaryValue}>
              -₹{totalAdditionalDiscountValue.toFixed(0)}
            </Text>
          </View>
          {appliedCoupon && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Coupon Discount:</Text>
              <Text style={styles.couponDiscount}>
                -₹{formatPrice(appliedCoupon.value)}
              </Text>
            </View>
          )}
          {useRewardPoints && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Reward Points Discount:</Text>
              <Text style={styles.couponDiscount}>
                -₹{formatPrice(data.rewardPointsPrice.toFixed(2))}
              </Text>
            </View>
          )}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>
              ₹{formatPrice(totalAmount.toFixed(2))}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.rewardPointsToggle}
          onPress={handleToggleRewardPoints}>
          <Text style={styles.rewardPointsText}>
            Use Reward Points (-₹{data.rewardPointsPrice.toFixed(2)})
          </Text>
          <CheckBox
            value={useRewardPoints}
            onValueChange={handleToggleRewardPoints}
            boxType="square"
            tintColors={{ true: colors.main, false: '#dcdcdc' }}
          />
        </TouchableOpacity>

        <View style={styles.couponContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter the coupon code"
              placeholderTextColor="rgba(120, 120, 120, 0.3)"
              value={couponCode}
              onChangeText={setCouponCode}
            />
            <TouchableOpacity
              style={[
                styles.applyButton,
                appliedCoupon && styles.appliedButton, // Disable button if coupon applied
              ]}
              onPress={handleApplyCoupon}
              disabled={!!appliedCoupon} // Disable button if coupon applied
            >
              <Text style={styles.applyButtonText}>
                {appliedCoupon ? 'Applied' : 'Apply'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.couponSection}>
            <Text style={styles.applicableCoupons}>Applicable coupons</Text>
            {coupons.map((coupon, index) => (
              <View key={index} style={styles.couponItem}>
                <Text style={styles.applicableText}>
                  <Text
                    style={{
                      color: colors.main,

                      fontFamily: 'Outfit-Medium',
                    }}>
                    {coupon.code}
                  </Text>
                  {'\n'}
                  {coupon.description}
                </Text>
                <TouchableOpacity
                  style={styles.applyTextButton}
                  onPress={() => {
                    setAppliedCoupon(coupon);
                    Alert.alert(
                      'Coupon applied',
                      `Coupon ${coupon.code} applied successfully!`,
                    );
                  }}
                  disabled={!!appliedCoupon} // Disable button if coupon applied
                >
                  <Text style={styles.applyTextButtonText}>
                    {appliedCoupon && appliedCoupon.code === coupon.code
                      ? 'Applied'
                      : 'Apply'}
                  </Text>
                </TouchableOpacity>
                {index < coupons.length - 1 && (
                  <View style={styles.separator} />
                )}
              </View>
            ))}
          </View>

          {appliedCoupon && (
            <TouchableOpacity
              style={styles.removeCouponButton}
              onPress={handleRemoveCoupon}>
              <Text style={styles.removeCouponButtonText}>Remove Coupon</Text>
            </TouchableOpacity>
          )}
        </View>
        <CompanyDropdown
          onSelectCompany={handleSelectCompany}
          onPincodeChange={handlePincodeChange}
        />
        <CompanyDropdown2
          onSelectCompany={handleSelectCompany}
          pincode={selectedPincode}
        />
        <CompanyDropdown3
          onSelectCompany={handleSelectCompany}
          pincode={selectedPincode}
        />
        <CompanyDropdown4
          onSelectCompany={handleSelectCompany}
          pincode={selectedPincode}
        />
        {cartItems.map(item => (
          <CartItem
            key={item.id}
            item={item}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            isOrderSummary={true} // Pass true if accessing from OrderSummaryScreen
          />
        ))}
      </ScrollView>
      <View style={styles.checkoutContainer}>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleCheckout}
          disabled={isLoading} // <-- Disable button while loading
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" /> // <-- Loading animation
          ) : (
            <Text style={styles.checkoutButtonText}>Checkout</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    paddingBottom: 80, // Space for the checkout button
  },
  couponContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#F6F6F6',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    color: '#000',
  },
  applyButton: {
    backgroundColor: colors.main,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  applyButtonText: {
    color: '#fff',

    textAlign: 'center',
    fontFamily: 'Outfit-Medium',
  },
  applicableCoupons: {
    fontSize: sizes.body,

    fontFamily: 'Outfit-Medium',
    marginBottom: 10,
    color: colors.TextBlack,
  },
  applicableText: {
    fontSize: sizes.body,
    fontFamily: 'Outfit-Medium',
    color: '#000',
  },
  applyTextButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    paddingVertical: 10,
  },
  applyTextButtonText: {
    color: colors.second,
    fontSize: 16,

    fontFamily: 'Outfit-Medium',
  },
  removeCouponButton: {
    backgroundColor: colors.main,
    borderRadius: 5,
    paddingVertical: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  removeCouponButtonText: {
    color: '#fff',

    fontFamily: 'Outfit-Medium',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    color: colors.TextBlack,
    padding: 15,
  },
  itemCount: {
    fontSize: sizes.body,

    fontFamily: 'Outfit-Bold',
    color: colors.TextBlack,
  },
  subtotal: {
    fontSize: sizes.body,
    fontFamily: 'Outfit-Bold',
    color: colors.TextBlack,
  },
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  summaryLabel: {
    fontSize: sizes.body,
    fontFamily: 'Outfit-Medium',
    color: '#333',
  },
  summaryValue: {
    fontSize: sizes.body,
    fontFamily: 'Outfit-Medium',
    color: '#333',
  },
  couponDiscount: {
    fontSize: sizes.body,
    fontFamily: 'Outfit-Bold',
    color: colors.Green,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
  },
  totalLabel: {
    fontSize: sizes.body,

    fontFamily: 'Outfit-Medium',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,

    fontFamily: 'Outfit-Bold',
    color: colors.TextBlack,
  },
  rewardPointsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  rewardPointsText: {
    marginLeft: 20,
    fontSize: sizes.body,
    fontFamily: 'Outfit-Medium',
    flex: 1,
    color: colors.TextBlack,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.main,
    marginLeft: 10,
  },
  checked: {
    backgroundColor: colors.main,
  },
  checkoutContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  checkoutButton: {
    backgroundColor: colors.main,
    borderRadius: 5,
    paddingVertical: 15,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',

    fontSize: sizes.body,
    fontFamily: 'Outfit-Medium',
  },
  scrollViewContent: {
    paddingBottom: 80, // Space for the checkout button
  },
  couponContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#F6F6F6',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    color: '#000',
  },
  applyButton: {
    backgroundColor: colors.main,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  applyButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Outfit-Medium',
  },
  applicableCoupons: {
    fontSize: sizes.body,

    fontFamily: 'Outfit-Bold',
    marginBottom: 10,
    color: colors.TextBlack,
  },
  applicableText: {
    fontSize: sizes.body,
    fontFamily: 'Outfit-Bold',
    color: '#000',
  },
  applyTextButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    paddingVertical: 10,
  },
  applyTextButtonText: {
    color: colors.second,
    fontSize: 16,

    fontFamily: 'Outfit-Medium',
  },
  removeCouponButton: {
    backgroundColor: colors.main,
    borderRadius: 5,
    paddingVertical: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  removeCouponButtonText: {
    color: '#fff',

    fontFamily: 'Outfit-Bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    color: colors.TextBlack,
    padding: 15,
  },
  itemCount: {
    fontSize: sizes.body,

    fontFamily: 'Outfit-Bold',
    color: colors.TextBlack,
  },
  subtotal: {
    fontSize: sizes.body,

    fontFamily: 'Outfit-Bold',
    color: colors.TextBlack,
  },
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  summaryLabel: {
    fontSize: sizes.body,
    fontFamily: 'Outfit-Bold',
    color: '#333',
  },
  summaryValue: {
    fontSize: sizes.body,
    fontFamily: 'Outfit-Bold',
    color: '#333',
  },
  couponDiscount: {
    fontSize: sizes.body,
    fontFamily: 'Outfit-Medium',
    color: colors.Green,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
  },
  totalLabel: {
    fontSize: sizes.body,

    fontFamily: 'Outfit-Medium',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,

    fontFamily: 'Outfit-Medium',
    color: colors.TextBlack,
  },
  rewardPointsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  rewardPointsText: {
    marginLeft: 20,
    fontSize: sizes.body,
    fontFamily: 'Outfit-Medium',
    flex: 1,
    color: colors.TextBlack,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.main,
    marginLeft: 10,
  },
  checked: {
    backgroundColor: colors.main,
  },
  checkoutContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  checkoutButton: {
    backgroundColor: colors.main,
    borderRadius: 5,
    paddingVertical: 15,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',

    fontSize: sizes.body,
    fontFamily: 'Outfit-Bold',
  },
});

export default OrderSummaryScreen;
