import React, {useState, useEffect} from 'react';
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
import {colors} from '../styles/color';
import {sizes} from '../styles/size';
import {data} from '../data/data';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import CheckBox from '@react-native-community/checkbox';
import axios from 'axios';

const OrderSummaryScreen = ({route, navigation}) => {
  const {cartItems: initialCartItems, totalAmount: initialTotalAmount} =
    route.params;
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [totalAmount, setTotalAmount] = useState(initialTotalAmount);
  const [couponCode, setCouponCode] = useState('');
  const [useRewardPoints, setUseRewardPoints] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

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
      amount -= (amount * appliedCoupon.value) / 100;
    }
    amount += data.shippingCharges - data.additionalDiscount;
    return amount;
  };

  const calculateSubtotal = () => {
    let subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    if (appliedCoupon) {
      subtotal -= (subtotal * appliedCoupon.value) / 100;
    }
    return subtotal;
  };

  const handleUpdateQuantity = (id, quantity) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item =>
        item.id === id ? {...item, quantity} : item,
      );
      return updatedItems.filter(item => item.quantity > 0);
    });
  };

  const handleRemoveItem = id => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const handleApplyCoupon = () => {
    const coupon = data.coupons.find(c => c.code === couponCode);
    if (coupon) {
      setAppliedCoupon(coupon);
      Alert.alert('Coupon applied', 'Coupon applied successfully!');
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
    try {
      const userId = auth().currentUser.uid;
      // const orderData = {
      //   totalAmount,
      //   shippingCharges: data.shippingCharges,
      //   additionalDiscount: data.additionalDiscount,
      //   rewardPointsPrice: useRewardPoints ? data.rewardPointsPrice : 0,
      //   appliedCoupon: appliedCoupon ? appliedCoupon.value : 0,
      //   cartItems,
      //   userId,
      //   timestamp: firestore.FieldValue.serverTimestamp(),
      // };

      // await firestore().collection('orders').add(orderData);
      const response = await axios.post(`https://crossbee-server.vercel.app/checkout`, {
        totalAmount,
        data,

        useRewardPoints,
        appliedCoupon,
        cartItems,
        uid : userId 
      });

      if (response.data.data) {
        console.log('Item added to cart successfully');
        navigation.navigate('InvoiceScreen', {invoiceData: response.data.data});
      
      } else {
        console.error('Failed to checkout');
      }
    } catch (error) {
      console.error('Error saving order data: ', error);
      Alert.alert(
        'Error',
        'There was an issue processing your order. Please try again.',
      );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <Text style={styles.itemCount}>{cartItems.length} items:</Text>
          <Text style={styles.subtotal}>₹{calculateSubtotal().toFixed(2)}</Text>
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
              -₹{data.additionalDiscount.toFixed(2)}
            </Text>
          </View>
          {appliedCoupon && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Coupon Discount:</Text>
              <Text style={styles.couponDiscount}>
                -₹
                {((calculateSubtotal() * appliedCoupon.value) / 100).toFixed(2)}
              </Text>
            </View>
          )}
          {useRewardPoints && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Reward Points Discount:</Text>
              <Text style={styles.couponDiscount}>
                -₹{data.rewardPointsPrice.toFixed(2)}
              </Text>
            </View>
          )}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>₹{totalAmount.toFixed(2)}</Text>
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
            tintColors={{true: colors.main, false: '#dcdcdc'}}
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
              style={styles.applyButton}
              onPress={handleApplyCoupon}>
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.couponSection}>
            <Text style={styles.applicableCoupons}>Applicable coupons</Text>
            {data.coupons.map((coupon, index) => (
              <View key={index} style={styles.couponItem}>
                <Text style={styles.applicableText}>
                  <Text style={{color: colors.main, fontWeight: 'bold'}}>
                    {coupon.code}
                  </Text>
                  {'\n'}
                  {coupon.text}
                </Text>
                <TouchableOpacity
                  style={styles.applyTextButton}
                  onPress={() => {
                    setAppliedCoupon(coupon);
                    Alert.alert(
                      'Coupon applied',
                      `Coupon ${coupon.code} applied successfully!`,
                    );
                  }}>
                  <Text style={styles.applyTextButtonText}>Apply</Text>
                </TouchableOpacity>
                {index < data.coupons.length - 1 && (
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

        {/* Render the list of cart items */}
        {cartItems.map(item => (
          <CartItem
            key={item.id}
            item={item}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
          />
        ))}
      </ScrollView>
      <View style={styles.checkoutContainer}>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleCheckout}>
          <Text style={styles.checkoutButtonText}>Checkout</Text>
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
    shadowOffset: {width: 0, height: 2},
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
    fontWeight: 'bold',
    textAlign: 'center',
  },
  applicableCoupons: {
    fontSize: sizes.body,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.TextBlack,
  },
  applicableText: {
    fontSize: sizes.body,
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
    fontWeight: 'bold',
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
    fontWeight: 'bold',
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
  },
  itemCount: {
    fontSize: sizes.body,
    fontWeight: 'bold',
    color: colors.TextBlack,
  },
  subtotal: {
    fontSize: sizes.body,
    fontWeight: 'bold',
    color: colors.TextBlack,
  },
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
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
    color: '#333',
  },
  summaryValue: {
    fontSize: sizes.body,
    color: '#333',
  },
  couponDiscount: {
    fontSize: sizes.body,
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
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
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
    fontWeight: 'bold',
    fontSize: sizes.body,
  },
});

export default OrderSummaryScreen;
