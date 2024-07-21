import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Linking, Animated } from 'react-native'; // Import Animated from react-native
import { colors } from '../styles/color'; // Assuming you have defined colors elsewhere
import { products } from '../data/productData'; // Import your products data
import { useCart } from '../components/CartContext'; // Import CartContext for managing cart items

import WhatsAppButton2 from '../components/WhatsAppButton2';

const ProductDetailPage = ({ route }) => {
  const { productId } = route.params;
  const { addToCart } = useCart(); // Using addToCart function from CartContext
  const product = products.find(item => item.id === productId);
  const [alertVisible, setAlertVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  
  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Product not found!</Text>
      </View>
    );
  }

  const { productName, mainImage, description, price, colorsAvailable, specifications, deliveryTime } = product;

  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(colorsAvailable[0]); // Default to the first color
  const [quantity, setQuantity] = useState(1);

  const handlePrevious = () => {
    setActiveIndex(activeIndex === 0 ? product.images[selectedColor].length - 1 : activeIndex - 1);
  };

  const handleNext = () => {
    setActiveIndex(activeIndex === product.images[selectedColor].length - 1 ? 0 : activeIndex + 1);
  };

  const handleCall = () => {
    const phoneNumber = '9289881135'; // Replace with your phone number
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setActiveIndex(0); // Reset index when changing color
  };

  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const showAlert = () => {
    setAlertVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          setAlertVisible(false);
        });
      }, 2000); // Adjust the duration as needed
    });
  };

  const handleAddToCart = () => {
    const newItem = {
      id: product.id,
      name: productName,
      price: price,
      quantity: quantity,
      color: selectedColor,
      image: product.images[selectedColor][activeIndex],
    };
    addToCart(newItem); // Add item to cart using addToCart function from CartContext
    showAlert(); // Show alert after adding item to cart
  };

  return (
    <View>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image source={product.images[selectedColor][activeIndex]} style={styles.image} />
            <View style={styles.pagination}>
              {product.images[selectedColor].map((_, index) => (
                <View
                  key={index}
                  style={[styles.dot, index === activeIndex && styles.activeDot]}
                />
              ))}
            </View>
            <TouchableOpacity style={[styles.arrowButton, { left: 10 }]} onPress={handlePrevious}>
              <Text style={styles.arrowText}>{'<'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.arrowButton, { right: 10 }]} onPress={handleNext}>
              <Text style={styles.arrowText}>{'>'}</Text>
            </TouchableOpacity>

            <View style={styles.truckIcon}>
              <Image
                source={require('../assets/truck.png')}
                style={styles.truckImage}
              />
            </View>
            <View style={styles.truckTextContainer}>
              <Text style={styles.truckText}>{deliveryTime}</Text>
            </View>
          </View>

          <View style={styles.productDetails}>
            <Text style={styles.title}>{productName}</Text>
            <Text style={styles.descriptionText}>Description: {description}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.priceText}>Price: ₹{price}</Text>
              <TouchableOpacity onPress={handleCall}>
                <Image
                  source={require('../assets/call.png')}
                  style={styles.callIcon}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.productDetails}>
            <Text style={styles.Head}>Color:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorScrollContainer}>
              {colorsAvailable.map((color, index) => (
                <ColorButton
                  key={index}
                  color={color}
                  selectedColor={selectedColor}
                  onPress={() => handleColorSelect(color)}
                />
              ))}
            </ScrollView>
          </View>

          <View style={styles.quantityContainer}>
            <Text style={styles.quantityText}>Quantity:</Text>
            <View style={styles.quantityControl}>
              <TouchableOpacity style={styles.quantityButton} onPress={handleDecreaseQuantity}>
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityNumber}>{quantity}</Text>
              <TouchableOpacity style={styles.quantityButton} onPress={handleIncreaseQuantity}>
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.productDetails}>
            <Text style={styles.Head}>Product Description:</Text>
            <Text style={styles.regularText}>{description}</Text>
          </View>

          <View style={styles.productDetails}>
            <Text style={styles.Head}>Product Specifications:</Text>
            <View style={styles.specificationTable}>
              {specifications.map((spec, index) => (
                <View key={index} style={[styles.specRow, index % 2 === 0 ? styles.firstRow : styles.secondRow]}>
                  <Text style={styles.specLabel}>{spec.label}</Text>
                  <Text style={styles.specValue}>{spec.value}</Text>
                </View>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {alertVisible && (
        <Animated.View style={[styles.alertContainer, { opacity: fadeAnim }]}>
          <Image source={require('../assets/alert.png')} style={styles.alertIcon} />
          <Text style={styles.alertText}>Item added to cart</Text>
        </Animated.View>
      )}

      <WhatsAppButton2 />
    </View>
  );
};

const ColorButton = ({ color, selectedColor, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.colorButton,
        { backgroundColor: selectedColor === color ? colors.main : '#FFFFFF' },
        selectedColor === color ? styles.selectedButton : null,
      ]}
      onPress={onPress}
    >
      <Text style={[styles.colorButtonText, { color: selectedColor === color ? 'white' : colors.main }]}>
        {color}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  container: {
    width: '100%',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 20,
    position: 'relative',
    borderWidth: 1, // Adding a stroke
    borderColor: '#B3B3B39D', // Stroke color
  },
  image: {
    width: '85%',
    height: '85%',
    resizeMode: 'contain', // Adjusts the image to fit inside the container
    alignSelf: 'center', // Center the image horizontally
    margin: '5%', // Adds space around the image
  },
  arrowButton: {
    position: 'absolute',
    top: '40%',
    backgroundColor: colors.main,
    borderRadius: 50,
    padding: 10,
  },
  arrowText: {
    color: 'white',
    fontSize: 30,
  },
  pagination: {
    position: 'absolute',
    bottom: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#A7A7A7',
    marginHorizontal: 5,
  },
  activeDot: {
    width: 16,
    backgroundColor: '#316487',
  },
  productDetails: {
    width: '90%',
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.TextBlack,
  },
  descriptionText: {
    fontSize: 16,
    marginBottom: 5,
    color: colors.TextBlack,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  priceText: {
    fontSize: 24,
    color: colors.TextBlack,
  },
  Head: {
    fontSize: 20,
    color: colors.TextBlack,
    fontWeight: 'bold',
  },
  colorScrollContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  colorButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.main,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  selectedButton: {
    backgroundColor: colors.main,
    borderWidth: 1,
    borderColor: colors.main,
  },
  colorButtonText: {
    fontSize: 16,
    color: colors.main,
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityText: {
    fontSize: 18,
    color: colors.TextBlack,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  quantityButton: {
    backgroundColor: colors.main,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  quantityButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  quantityNumber: {
    fontSize: 18,
    marginHorizontal: 10,
    color: colors.TextBlack,
  },
  regularText: {
    fontSize: 16,
    color: colors.TextBlack,
  },
  specificationTable: {
    marginTop: 10,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(120, 120, 120, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(120, 120, 120, 0.3)',
    marginBottom: 5,
  },
  firstRow: {
    backgroundColor: '#F5F5F5', // Alternate row color
  },
  secondRow: {
    backgroundColor: '#CFCECE9C', // Default row color
  },
  specLabel: {
    fontSize: 16,
    color: colors.TextBlack,
    fontWeight: 'bold',
  },
  specValue: {
    flex: 1,
    textAlign: 'right',
    color: colors.TextBlack,
  },
  addToCartButton: {
    backgroundColor: colors.main,
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 30,
    marginHorizontal: 20,
  },
  addToCartText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  alertContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#333333',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  alertIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  alertText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  truckIcon: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: colors.second,
    borderRadius: 20,
    padding: 10,
  },
  truckImage: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
  truckTextContainer: {
    position: 'absolute',
    top: 15,
    left: 50,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  truckText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '600',
  },
  callIcon: {
    width: 65,
    height: 65,
    marginRight: -20,
  },
});

export default ProductDetailPage;
