import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert } from 'react-native';
import CartItem from '../components/CartItem';
import { colors } from '../styles/color';
import { sizes } from '../styles/size';
import { data } from '../data/data';

const OrderSummaryScreen = ({ route, navigation }) => {
  const { cartItems: initialCartItems, totalAmount: initialTotalAmount } = route.params;
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [totalAmount, setTotalAmount] = useState(initialTotalAmount);
  const [couponCode, setCouponCode] = useState('');
  const [useRewardPoints, setUseRewardPoints] = useState(false); // State for reward points toggle
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  useEffect(() => {
    // Calculate total amount with or without reward points deduction and coupon
    const newTotalAmount = calculateTotalAmount();
    setTotalAmount(newTotalAmount);
  }, [cartItems, useRewardPoints, appliedCoupon]);

  const calculateTotalAmount = () => {
    let amount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (useRewardPoints) {
      amount -= data.rewardPointsPrice;
    }
    if (appliedCoupon) {
      amount -= (amount * appliedCoupon.value) / 100;
    }
    amount += data.shippingCharges - data.additionalDiscount;
    return amount;
  };

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

  const handleToggleRewardPoints = () => {
    setUseRewardPoints(prev => !prev);
  };

  const handleCheckout = () => {
    const invoiceData = {
      totalAmount,
      shippingCharges: data.shippingCharges,
      additionalDiscount: data.additionalDiscount,
      rewardPointsPrice: useRewardPoints ? data.rewardPointsPrice : 0,
      appliedCoupon: appliedCoupon ? appliedCoupon.value : 0,
      cartItems,
    };
    navigation.navigate('InvoiceScreen', { invoiceData });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.itemCount}>{cartItems.length} items:</Text>
        <Text style={styles.subtotal}>₹{totalAmount.toFixed(2)}</Text>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping Charges:</Text>
          <Text style={styles.summaryValue}>₹{data.shippingCharges.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Additional Discount:</Text>
          <Text style={styles.summaryValue}>₹{data.additionalDiscount.toFixed(2)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>₹{totalAmount.toFixed(2)}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.rewardPointsToggle} onPress={handleToggleRewardPoints}>
        <Text style={styles.rewardPointsText}>
          Use Reward Points (-₹{data.rewardPointsPrice.toFixed(2)})
        </Text>
        <View style={[styles.checkbox, useRewardPoints ? styles.checked : null]} />
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
            <View key={index} style={styles.couponSection}>
              <Text style={styles.applicableText}>
                <Text style={{ color: colors.main, fontWeight: 'bold' }}>{coupon.code}</Text>{'\n'}
                {coupon.text}
              </Text>
              <TouchableOpacity style={styles.applyTextButton} onPress={() => setCouponCode(coupon.code)}>
                <Text style={styles.applyTextButtonText}>Apply</Text>
              </TouchableOpacity>
              {index < data.coupons.length - 1 && <View style={styles.separator} />}
            </View>
          ))}
        </View>
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <CartItem
            item={item}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
          />
        )}
        contentContainerStyle={styles.cartItemsContainer}
      />

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
    padding: 5,
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
    fontWeight: 'bold',
    textAlign: 'center',
  },
  applicableCoupons: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: colors.TextBlack,
  },
  applicableText: {
    fontSize: 14,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    color: colors.TextBlack,
  },
  itemCount: {
    fontSize: 16,
    color: colors.TextBlack,
  },
  subtotal: {
    fontSize: 16,
    color: colors.TextBlack,
  },
  cartItemsContainer: {
    flexGrow: 1,
  },
  summaryContainer: {
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 16,
    color: colors.TextBlack,
  },
  summaryValue: {
    fontSize: 16,
    color: colors.TextBlack,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    color: colors.TextBlack,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.TextBlack,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.TextBlack,
  },
  checkoutContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  checkoutButton: {
    width: '90%',
    padding: sizes.padding,
    borderRadius: sizes.borderRadius,
    backgroundColor: colors.main,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#DDD',
    marginVertical: 10,
  },
  couponSection: {
    marginBottom: 10,
  },
  rewardPointsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderColor: colors.main,
  },
  checked: {
    backgroundColor: colors.main,
  },
  rewardPointsText: {
    fontSize: 16,
    color: colors.TextBlack,
  },
});

export default OrderSummaryScreen;

