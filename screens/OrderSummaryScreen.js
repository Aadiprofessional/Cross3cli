import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import CartItem from '../components/CartItem';
import { colors } from '../styles/color';
import { sizes } from '../styles/size';
import auth from '@react-native-firebase/auth';
import CheckBox from '@react-native-community/checkbox';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import CompanyDropdown from '../components/CompanyDropdown';
import { ActivityIndicator } from 'react-native-paper';
import AddCommentComponent from '../components/AddCommentComponent'; // Import the AddCommentComponent
import CompanyDropdown2 from '../components/CompanyDropdown copy';
import CompanyDropdown3 from '../components/CompanyDropdown copy 3';
import { useCart } from '../components/CartContext';
import SuggestedProducts from '../components/SuggestedProducts';
import CompanyDropdown4 from '../components/CompanyDropdown copy 2';

const OrderSummaryScreen = ({ route, navigation }) => {
  const { cartItems: initialCartItems, totalAmount: initialTotalAmount, totalAdditionalDiscountValue, comment: passedComment } = route.params;

  const { cartItems, updateCartItemQuantity, removeCartItem } = useCart();
  const [totalAmount, setTotalAmount] = useState(initialTotalAmount);
  const [couponCode, setCouponCode] = useState('');
  const [useRewardPoints, setUseRewardPoints] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [selectedBrandId, setSelectedBrandId] = useState(null);
  const [selectedLogId, setSelectedLogId] = useState(null);
  const [selectedTransId, setSelectedTransId] = useState(null);
  const [selectedPincode, setSelectedPincode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [unavailableCoupons, setUnavailableCoupons] = useState([]);
  const [comment, setComment] = useState(passedComment || ''); // Store the comment
  const [discounts, setDiscounts] = useState([]);
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await axios.get('https://crossbee-server-1036279390366.asia-south1.run.app/discounts');
        setDiscounts(response.data);

        // Automatically apply the first active discount if it exists
        const applicableDiscount = response.data
          .filter(discount => discount.status === 'Active' && initialTotalAmount >= discount.amount)
          .sort((a, b) => b.amount - a.amount)[0];

        if (applicableDiscount) {
          const discountAmount = (initialTotalAmount * applicableDiscount.discount) / 100;
          setTotalAmount(prevTotal => prevTotal - discountAmount); // Update the total amount with the discount applied
          setAppliedDiscount(applicableDiscount); // Store the applied discount
          Alert.alert('Discount Applied', `Discount of ${applicableDiscount.discount}% has been applied.`);
        }
      } catch (error) {
        console.error('Error fetching discounts:', error);
      }
    };

    fetchDiscounts();
  }, [initialTotalAmount]); // Run only when initialTotalAmount changes
  console.log(cartItems, totalAdditionalDiscountValue, totalAmount);

  const calculateTotalAmount = () => {
    let amount = calculateSubtotal();

    const applicableDiscount = discounts
      .filter(discount => discount.status === 'Active' && amount >= discount.amount)
      .sort((a, b) => b.amount - a.amount)[0];

    if (applicableDiscount) {
      const discountAmount = (amount * applicableDiscount.discount) / 100;
      amount -= discountAmount;
      setAppliedDiscount(applicableDiscount);
    }

    if (appliedCoupon) {
      amount -= Number(appliedCoupon.value);
    }

    amount -= totalAdditionalDiscountValue;

    const gstTotal = calculateGSTTotal(); // Get total GST
    amount += gstTotal; // Subtract GST from total

    amount += data.shippingCharges;

    return Math.max(0, amount);
  };

  const fetchRewardPoints = async () => {
    try {
      const userId = auth().currentUser.uid;
      const response = await axios.get(
        `https://crossbee-server-1036279390366.asia-south1.run.app/getUserDetails?uid=${userId}`
      );
      const rewardPoints = response.data.rewardPoints;
      const CreditCard = response.data.credit;

      setData(prevData => ({
        ...prevData,
        rewardPointsPrice: Math.min(totalAmount, rewardPoints),
        creditCardAvailable: CreditCard,
      }));
    } catch (error) {
      console.error('Error fetching reward points:', error);
    }
  };

  useEffect(() => {
    const newTotalAmount = calculateTotalAmount();
    setTotalAmount(newTotalAmount);
  }, [cartItems, useRewardPoints, appliedCoupon, appliedDiscount]);

  const handleUpdateQuantity = (cartId, quantity) => {
    setCartItems(prevItems => {
      return prevItems.map(item =>
        item.cartId === cartId ? { ...item, quantity } : item
      );
    });
  };

  const handleRemoveItem = cartId => {
    setCartItems(prevItems => prevItems.filter(item => item.cartId !== cartId));
  };

  const handleApplyCoupon = () => {
    const coupon = availableCoupons.find(c => c.code === couponCode);
    if (coupon) {
      setAppliedCoupon({ ...coupon, value: Number(coupon.value) });
      setCouponCode(coupon.code); // Update the coupon code in the input field with the applied coupon
      Alert.alert('Coupon applied', 'Coupon applied successfully!');
    } else {
      Alert.alert('Invalid coupon', 'Please enter a valid coupon code.');
    }
  };




  // Fetch reward points (existing logic)
  useEffect(() => {
    fetchRewardPoints();
  }, []);

  // Update comment if passed through route
  useEffect(() => {
    if (comment) {
      console.log("Received comment:", comment);
    }
  }, [comment]);




  // Update useEffect to recalculate totalAmount when reward points are fetched
  useEffect(() => {
    const newTotalAmount = calculateTotalAmount();
    setTotalAmount(newTotalAmount);
  }, [cartItems, useRewardPoints, appliedCoupon, appliedDiscount]);

  const [data, setData] = useState({
    rewardPointsPrice: 0,
    shippingCharges: 0,
    additionalDiscount: totalAdditionalDiscountValue,
    comment: comment,
  });


  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const userId = auth().currentUser.uid;
        const response = await axios.get(
          `https://crossbee-server-1036279390366.asia-south1.run.app/coupons/${userId}?amount=${totalAmount}`
        );
        const fetchedCoupons = response.data;

        const filteredAvailableCoupons = fetchedCoupons.filter(coupon => coupon.min_amount <= totalAmount);
        const filteredUnavailableCoupons = fetchedCoupons.filter(coupon => coupon.min_amount > totalAmount);

        setCoupons(fetchedCoupons);
        setAvailableCoupons(filteredAvailableCoupons);
        setUnavailableCoupons(filteredUnavailableCoupons);
      } catch (error) {
        console.error('Error fetching coupons:', error);
        Alert.alert('Error', 'Failed to fetch coupons. Please try again later.');
      }
    };

    fetchCoupons();
  }, [totalAmount]);// Ensure that totalAmount is passed in as a dependency


  useEffect(() => {
    const newTotalAmount = calculateTotalAmount();
    setTotalAmount(newTotalAmount);
  }, [cartItems, useRewardPoints, appliedCoupon]);


  {
    appliedCoupon && (
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Coupon Discount:</Text>
        <Text style={styles.couponDiscount}>
          -{Number(appliedCoupon.value)}
        </Text>
      </View>
    );
  }
  const calculateGSTTotal = () => {
    return cartItems.reduce((totalGST, item) => {
      const itemGST = (item.price * item.quantity * item.gst) / 100;
      return totalGST + itemGST;
    }, 0);
  };

  const calculateSubtotal = () => {
    let subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Apply Reward Points Discount to Subtotal
    if (useRewardPoints && data.rewardPointsPrice) {
      subtotal -= data.rewardPointsPrice;
    }

    return Math.max(0, subtotal); // Ensure subtotal is non-negative
  };

  // Inside your JSX where you display the coupon discount:


  const handleSelectCompany = companyId => {
    setSelectedCompanyId(companyId);
  };
  const handleSelectBrand = brandId => {
    setSelectedBrandId(brandId);
  };
  const handleSelectLog = logId => {
    setSelectedBrandId(logId);
  };
  const handleSelectTrans = transId => {
    setSelectedBrandId(transId);
  };

  const handlePincodeChange = pincode => {
    setSelectedPincode(pincode);

  };


  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    Alert.alert('Coupon removed', 'Coupon has been removed.');
  };

  const handleToggleRewardPoints = () => {
    setUseRewardPoints(prev => !prev);
  };
  console.log(cartItems);

  const handlePaymentOptionSelect = (option) => {
    setSelectedPaymentOption(option);
    setModalVisible(false);

    // Only call checkout if the selected option is valid
    if (option) {
      handleCheckout(); // Call checkout after selecting payment option
    } else {
      Alert.alert('Select Payment Option', 'Please select a valid payment option.');
    }
  };

  const handleCheckout = async () => {
    if (!selectedCompanyId) {
      Alert.alert('Select Company', 'Please select a company before proceeding.');
      return;
    }
    if (!selectedBrandId) {
      Alert.alert('Select Brand', 'Please select a Brand before proceeding.');
      return;
    }


    setIsLoading(true);

    try {
      const userId = auth().currentUser.uid;
      const response = await axios.post(
        `https://crossbee-server-1036279390366.asia-south1.run.app/checkout`,
        {
          totalAmount,
          data: {
            ...data,
            companyId: selectedCompanyId,  // Add selected company ID
            brandId: selectedBrandId,       // Add selected brand ID
            gst : calculateGSTTotal().toFixed(2),
            // Include other relevant data if needed
          },
          useRewardPoints,
          appliedCoupon,
          cartItems,
          uid: userId,
          companyId: selectedCompanyId,
          comment,
          paymentOption: selectedPaymentOption, // Ensure payment option is included
        }
      );

      if (response.data.orderId) {
        // Order placed successfully
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
                orderId: response.data.orderId,
              },
            },
          ],
        });
      } else if (response.data.cartError) {
        // Cart-specific error
        Alert.alert('Out of Stock', 'Some items in your cart are out of stock. Please review your cart.');
      } else {
        Alert.alert('Error', 'Unable to place the order.');
      }
    } catch (error) {
      console.error('Error saving order data:', error);

      if (error.response && error.response.data && error.response.data.cartError) {
        // Handle cart-specific error
        Alert.alert('Out of Stock', 'Some items in your cart are out of stock. Please review your cart.');
      } else {
        // General error handling
        Alert.alert('Alert', 'Some error occurred while placing the order.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <Text style={styles.itemCount}>{cartItems.length} items:</Text>
          <Text style={styles.subtotal}>
            {Number(calculateSubtotal().toFixed(2)).toLocaleString("en-IN", {
              maximumFractionDigits: 0,
              style: 'currency',
              currency: 'INR',
            })}
          </Text>
        </View>

        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping Charges:</Text>
            <Text style={styles.summaryValue}>
              {Number(data.shippingCharges.toFixed(2)).toLocaleString("en-IN", {
                maximumFractionDigits: 0,
                style: 'currency',
                currency: 'INR',
              })}
            </Text>
          </View>
          {appliedDiscount && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount ({appliedDiscount.discount}%):</Text>
              <Text style={styles.summaryValue}>
                -{Number((calculateSubtotal() * appliedDiscount.discount / 100).toFixed(2)).toLocaleString("en-IN", {
                  maximumFractionDigits: 0,
                  style: 'currency',
                  currency: 'INR',
                })}
              </Text>
            </View>
          )}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Additional Discount:</Text>
            <Text style={styles.summaryValue}>
              -{Number(totalAdditionalDiscountValue).toLocaleString("en-IN", {
                maximumFractionDigits: 0,
                style: 'currency',
                currency: 'INR',
              })}
            </Text>
          </View>

          {appliedCoupon && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Coupon Discount:</Text>
              <Text style={styles.couponDiscount}>
                -{Number(appliedCoupon.value).toLocaleString("en-IN", {
                  maximumFractionDigits: 0,
                  style: 'currency',
                  currency: 'INR',
                })}
              </Text>
            </View>
          )}

          {useRewardPoints && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Wallet Points Discount:</Text>
              <Text style={styles.couponDiscount}>
                -{Number(data.rewardPointsPrice.toFixed(2)).toLocaleString("en-IN", {
                  maximumFractionDigits: 0,
                  style: 'currency',
                  currency: 'INR',
                })}
              </Text>
            </View>
          )}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>GST:</Text>
            <Text style={styles.summaryValue}>
              +{Number(calculateGSTTotal().toFixed(2)).toLocaleString("en-IN", {
                maximumFractionDigits: 0,
                style: 'currency',
                currency: 'INR',
              })}
            </Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>
              {Number(totalAmount.toFixed(2)).toLocaleString("en-IN", {
                maximumFractionDigits: 0,
                style: 'currency',
                currency: 'INR',
              })}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.rewardPointsToggle}
          onPress={handleToggleRewardPoints}
        >
          <Text style={styles.rewardPointsText}>
            Use Wallet Points ({Number(data.rewardPointsPrice.toFixed(2)).toLocaleString("en-IN", {
              maximumFractionDigits: 0,
              style: 'currency',
              currency: 'INR',
            })})
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
            <Text style={styles.applicableCoupons}>Coupons</Text>
            {coupons.map((coupon, index) => {
              const isAvailable = coupon.min_amount <= totalAmount;
              const isApplied = appliedCoupon && appliedCoupon.code === coupon.code;

              return (
                <View key={index} style={styles.couponItem}>
                  <View style={styles.couponItemContainer}>
                    <Text style={styles.applicableText}>
                      <Text style={styles.couponCodeText}>{coupon.code}</Text>
                      {'\n'}
                      {isAvailable
                        ? `Save ₹${Number(coupon.value).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`
                        : coupon.description}
                    </Text>
                    <TouchableOpacity
                      style={styles.applyTextButton}
                      onPress={() => {
                        setAppliedCoupon(coupon);
                        setCouponCode(coupon.code); // Show the applied coupon code in the input field
                        Alert.alert('Coupon applied', `Coupon ${coupon.code} applied successfully!`);
                      }}
                      disabled={!isAvailable || isApplied}
                    >
                      <Text
                        style={[
                          styles.applyTextButtonText,
                          (!isAvailable || isApplied) && { opacity: 0.5 } // Lower opacity for disabled buttons
                        ]}
                      >
                        {isApplied ? 'Applied' : 'Apply'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {index < coupons.length - 1 && <View style={styles.separator} />}
                </View>
              );
            })}
          </View>



          {appliedCoupon && (
            <TouchableOpacity
              style={styles.removeCouponButton}
              onPress={handleRemoveCoupon}>
              <Text style={styles.removeCouponButtonText}>Remove Coupon</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.applicableCoupons2}>{comment ? `Comment: ${comment}` : 'No Comment'}</Text>

        {/* Add Comment Button/Modal */}
        <AddCommentComponent setComment={setComment} comment={comment} />
        <CompanyDropdown
          onSelectCompany={handleSelectCompany}
          onPincodeChange={handlePincodeChange}
        />
        <CompanyDropdown2
          onSelectCompany={handleSelectBrand}
          pincode={selectedPincode}
        />
        <CompanyDropdown3
          onSelectCompany={handleSelectLog}
          pincode={selectedPincode}
        />

        {cartItems.map(item => (
          <CartItem
            key={item.cartId}
            item={item}
            onUpdateQuantity={updateCartItemQuantity}
            onRemoveItem={removeCartItem}
          />
        ))}
        < SuggestedProducts />
      </ScrollView>

      <View style={styles.checkoutContainer}>
        {/* Checkout Button */}
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => setModalVisible(true)} // Open modal instead of directly calling handleCheckout
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" /> // Loading animation
          ) : (
            <Text style={styles.checkoutButtonText}>Checkout</Text>
          )}
        </TouchableOpacity>

        {/* Payment Options Modal */}
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Payment Option</Text>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => handlePaymentOptionSelect('paid')}
              >
                <Text style={styles.optionText}>Pay Now</Text>
              </TouchableOpacity>
              {data.creditCardAvailable && (
                <TouchableOpacity
                  style={[
                    styles.paymentOptionButton,
                    selectedPaymentOption === 'Credit' && styles.selectedPaymentOption,
                  ]}
                  onPress={() => handlePaymentOptionSelect('Credit')}
                >
                  <Text style={styles.paymentOptionText}>Credit</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => handlePaymentOptionSelect('Already')}
              >
                <Text style={styles.optionText}>Already Paid</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  appliedButton: {
    color: '#fff',

    textAlign: 'center',
    fontFamily: 'Outfit-Medium',
  },
  applicableCoupons: {
    fontSize: sizes.body,
    marginTop: 10,
    fontFamily: 'Outfit-Bold',
    marginBottom: 10,
    color: colors.second,
  },
  applicableCoupons2: {
    marginLeft: 15,

    fontFamily: 'Outfit-Regular',
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
  couponItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Ensures space between text and apply button
    alignItems: 'center', // Align items vertically
  },
  couponCodeText: {
    color: colors.main,
    fontFamily: 'Outfit-Medium',
  },
  applyTextButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  applyTextButtonText: {
    color: colors.second,
    fontSize: 16,
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
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    borderRadius: 4,
    alignItems: 'center',
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    color: colors.TextBlack,
    fontFamily: 'Outfit-Medium',
    marginBottom: 15,
  },
  optionButton: {
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    color: colors.TextBlack
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
