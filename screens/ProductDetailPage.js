import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  Animated,
  ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useCart} from '../components/CartContext';
import WhatsAppButton2 from '../components/WhatsAppButton2';
import {colors} from '../styles/color';
import axios from 'axios';

const ProductDetailPage = ({route}) => {
  const {productId, mainId, categoryId} = route.params || {};
  const {addToCart} = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alertVisible, setAlertVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [sizesAvailable, setSizesAvailable] = useState([]);
  const [colorsAvailable, setColorsAvailable] = useState([]);
  const [quantity, setQuantity] = useState(colorminCartValue || 1);
  const [imageIndex, setImageIndex] = useState(0);
  const [currentImages, setCurrentImages] = useState([]);
  const [currentPrice, setCurrentPrice] = useState('');
  const [attribute1Values, setAttribute1Values] = useState([]);
  const [attribute2Values, setAttribute2Values] = useState([]);
  const [attribute3Values, setAttribute3Values] = useState([]);
  const [colorDescription, setColorDescription] = useState('');
  const [colorDeliveryTime, setColorDeliveryTime] = useState('');
  const [colorminCartValue, setColorMinCartValue] = useState(1);
  const [colorSpecifications, setColorSpecifications] = useState([]);

  // Fetch product data
  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const headers = {
          'Content-Type': 'application/json',
        };
        const response = await axios.post(
          `https://crossbee-server.vercel.app/productData`,
          {
            main: mainId,
            category: categoryId,
            product: productId,
          },
          { headers }
        );

        if (response.data) {
          const productData = response.data;
          setProduct(productData);
          setCurrentImages(productData.mainImages || []); // Set default images
          setCurrentPrice(productData.price || '');
          // Fetch initial attribute values
          fetchAttribute1Values(productData.attribute1 || []);
        } else {
          console.log('Product not found!');
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductData();
    }
  }, [productId, mainId, categoryId]);


  const fetchAttribute1Values = async attribute1 => {
    try {
      const response = await axios.post(
        `https://crossbee-server.vercel.app/attribute1Data`,
        {
          main: mainId,
          category: categoryId,
          product: productId,
        }
      );

      const values = response.data
      

      setAttribute1Values(values);
      // Set default storage
      if (values.length > 0) {
        const defaultStorage = values[0].id;
        setSelectedStorage(defaultStorage);
        fetchAttribute2Values(defaultStorage);
      }
    } catch (error) {
      console.error('Error fetching Attribute 1 values:', error);
    }
  };

  const fetchAttribute2Values = async storage => {
    try {
      const response = await axios.post(
        `https://crossbee-server.vercel.app/attribute2Data`,
        {
          main: mainId,
          category: categoryId,
          product: productId,
          attribute1 : storage
        }
      );

      const values = response.data

      setAttribute2Values(values);
      // Set default size
      if (values.length > 0) {
        const defaultSize = values[0].id;
        setSelectedSize(defaultSize);
        fetchAttribute3Values(storage, defaultSize);
      } else {
        setSelectedSize(null); // No sizes available
      }
    } catch (error) {
      console.error('Error fetching Attribute 2 values:', error);
    }
  };

  const fetchAttribute3Values = async (storage, size) => {
    try {
      const response = await axios.post(
        `https://crossbee-server.vercel.app/colorData`,
        {
          main: mainId,
          category: categoryId,
          product: productId,
          attribute1 : storage,
          attribute2 : size,
        }
      );

      const values = response.data

      setAttribute3Values(values);
      // Set default color
      if (values.length > 0) {
        const defaultColor = values[0].id;
        setSelectedColor(defaultColor);
      } else {
        setSelectedColor(null); // No colors available
      }
    } catch (error) {
      console.error('Error fetching Attribute 3 values:', error);
    }
  };

  // Handle storage selection
  const handleStorageSelect = storage => {
    setSelectedStorage(storage);
    setSelectedSize(null); // Reset selected size
    setSelectedColor(null); // Reset selected color
    fetchAttribute2Values(storage); // Fetch new sizes
  };

  // Handle size selection
  const handleSizeSelect = size => {
    setSelectedSize(size);
    setSelectedColor(null); // Reset selected color
    fetchAttribute3Values(selectedStorage, size); // Fetch new colors
  };

  // Handle color selection
  const handleColorSelect = color => {
    setSelectedColor(color);
  };

  // Update images and price based on selected color
  useEffect(() => {
    if (selectedColor && attribute3Values.length > 0) {
      const selectedColorData = attribute3Values.find(
        colorOption => colorOption.id === selectedColor,
      );
      if (selectedColorData) {
        setCurrentImages(selectedColorData.images || []);
        setCurrentPrice(selectedColorData.price || product.price);
        setColorDescription(
          selectedColorData.description || product.description,
        );
        setColorDeliveryTime(
          selectedColorData.deliveryTime || product.deliveryTime,
        );
        setColorSpecifications(
          selectedColorData.specifications || product.specifications,
        );
        setColorMinCartValue(
          selectedColorData.minCartValue || product.minCartValue,
        );
      }
    }
  }, [selectedColor, attribute3Values, product]);
  // Update sizes and colors when storage or size changes
  useEffect(() => {
    if (selectedStorage) {
      fetchAttribute2Values(selectedStorage);
    }
  }, [selectedStorage]);

  useEffect(() => {
    if (selectedSize) {
      fetchAttribute3Values(selectedStorage, selectedSize);
    } else {
      // If no size selected, reset colors
      setColorsAvailable([]);
      setSelectedColor(null);
    }
  }, [selectedSize]);

  const handlePrevious = () => {
    setImageIndex(prevIndex =>
      prevIndex === 0 ? currentImages.length - 1 : prevIndex - 1,
    );
  };

  const handleNext = () => {
    setImageIndex(prevIndex =>
      prevIndex === currentImages.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const handleCall = () => {
    const phoneNumber = '9289881135';
    Linking.openURL(`tel:${phoneNumber}`);
  };

  useEffect(() => {
    setQuantity(Number(colorminCartValue) || 1); // Ensure quantity is a number
  }, [colorminCartValue]);

  const handleDecreaseQuantity = () => {
    if (quantity > colorminCartValue) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  const handleIncreaseQuantity = () => {
    // Ensure colorminCartValue is a number
    const minCartValue = Number(colorminCartValue);

    // Increase quantity by 1 if minCartValue is valid
    if (!isNaN(minCartValue)) {
      setQuantity(prevQuantity => prevQuantity + 1);
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
      }, 2000);
    });
  };

  const handleAddToCart = () => {
    const newItem = {
      Id: productId,
      name: product.name,
      price: currentPrice,
      quantity,
      selectedStorage,
      selectedSize,
      color: selectedColor,
      image: currentImages[0],
      colorminCartValue,
    };
    addToCart(newItem);
    showAlert();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.main} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Product not found!</Text>
      </View>
    );
  }

  return (
    <View>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.imageContainer}>
          {currentImages.length > 0 && (
            <Image
              source={{uri: currentImages[imageIndex]}}
              style={styles.image}
            />
          )}
          <TouchableOpacity
            style={[styles.arrowButton, {left: 10}]}
            onPress={handlePrevious}>
            <Text style={styles.arrowText}>{'<'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.arrowButton, {right: 10}]}
            onPress={handleNext}>
            <Text style={styles.arrowText}>{'>'}</Text>
          </TouchableOpacity>
          <View style={styles.pagination}>
            {currentImages.map((_, index) => (
              <View
                key={index}
                style={[styles.dot, index === imageIndex && styles.activeDot]}
              />
            ))}
          </View>
          <View style={styles.truckIcon}>
            <Image
              source={require('../assets/truck.png')}
              style={styles.truckImage}
            />
          </View>
          <View style={styles.truckTextContainer}>
            <Text style={styles.truckText}>{colorDeliveryTime} Days</Text>
          </View>
        </View>

        <View style={styles.productDetails}>
          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.descriptionText}>{colorDescription}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>Price: ₹{currentPrice}</Text>
            <TouchableOpacity onPress={handleCall}>
              <Image
                source={require('../assets/call.png')}
                style={styles.callIcon}
              />
            </TouchableOpacity>
          </View>

          {/* Attribute 1 (Storage) */}
          <View style={styles.productDetails}>
            <Text style={styles.Head}>{product.attribute1}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.colorScrollContainer}>
                {attribute1Values.map(storage => (
                  <TouchableOpacity
                    key={storage.id}
                    style={[
                      styles.colorButton,
                      selectedStorage === storage.id && styles.selectedButton,
                    ]}
                    onPress={() => handleStorageSelect(storage.id)}>
                    <Text
                      style={[
                        styles.colorButtonText,
                        selectedStorage === storage.id && styles.selectedText,
                      ]}>
                      {storage.value}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.productDetails}>
            <Text style={styles.Head}>{product.attribute2}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.colorScrollContainer}>
                {attribute2Values.map(size => (
                  <TouchableOpacity
                    key={size.id}
                    style={[
                      styles.colorButton,
                      selectedSize === size.id && styles.selectedButton,
                    ]}
                    onPress={() => handleSizeSelect(size.id)}>
                    <Text
                      style={[
                        styles.colorButtonText,
                        selectedSize === size.id && styles.selectedText,
                      ]}>
                      {size.value}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.productDetails}>
            <Text style={styles.Head}>{product.attribute3}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.colorScrollContainer}>
                {attribute3Values.map(color => (
                  <TouchableOpacity
                    key={color.id}
                    style={[
                      styles.colorButton,
                      selectedColor === color.id && styles.selectedButton,
                    ]}
                    onPress={() => handleColorSelect(color.id)}>
                    <Text
                      style={[
                        styles.colorButtonText,
                        selectedColor === color.id && styles.selectedText,
                      ]}>
                      {color.id}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Quantity and Add to Cart */}
          <View>
            <View style={styles.quantityContainer}>
              <Text style={styles.Head}>Quantity:</Text>
              <TouchableOpacity
                onPress={handleDecreaseQuantity}
                style={[
                  styles.quantityButton,
                  quantity <= colorminCartValue && styles.disabledButton,
                ]}
                disabled={quantity <= colorminCartValue}>
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                onPress={handleIncreaseQuantity}
                style={styles.quantityButton}>
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.productDetails}>
              <Text style={styles.regularText}>
                Min Cart Value: {colorminCartValue}
              </Text>
            </View>
          </View>
          <View style={styles.productDetails}>
            <Text style={styles.Head}>Product Description:</Text>
            <Text style={styles.regularText}>{colorDescription}</Text>
          </View>

          <View style={styles.specificationsContainer}>
            <Text style={styles.specificationsTitle}>Specifications:</Text>
            <View style={styles.specificationTable}>
              {colorSpecifications.map(({label, value}, index) => (
                <View
                  key={index}
                  style={[
                    styles.specificationRow,
                    index % 2 === 0
                      ? styles.specificationRowEven
                      : styles.specificationRowOdd,
                  ]}>
                  <Text style={styles.specificationKey}>{label}</Text>
                  <Text style={styles.specificationValue}>{value}</Text>
                </View>
              ))}
            </View>
          </View>

          <TouchableOpacity
            onPress={handleAddToCart}
            style={styles.addToCartButton}>
            <Text style={styles.addToCartButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {alertVisible && (
        <Animated.View style={[styles.alertContainer, {opacity: fadeAnim}]}>
          <Image
            source={require('../assets/alert.png')}
            style={styles.alertIcon}
          />
          <Text style={styles.alertText}>Item added to cart</Text>
        </Animated.View>
      )}
      <WhatsAppButton2 />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
  },
  container: {
    width: '100%',
    paddingHorizontal: 10,
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
  disabledButton: {
    backgroundColor: colors.mainlight, // Change this to a color that indicates disabled
  },
  activeDot: {
    width: 16,
    backgroundColor: '#316487',
  },
  productDetails: {
    width: '90%',
    marginTop: 1,
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
  selectedText: {
    color: '#fff',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityText: {
    fontSize: 18,
    color: colors.TextBlack,
    marginLeft: 6,
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
  specificationsContainer: {
    marginVertical: 16,
    paddingHorizontal: 1,
  },
  specificationsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  specificationTable: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  specificationRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
  specificationRowEven: {
    backgroundColor: '#f7f7f7',
  },
  specificationRowOdd: {
    backgroundColor: '#e0e0e0',
  },
  specificationKey: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  specificationValue: {
    fontSize: 14,
    color: '#666',
  },
  addToCartButton: {
    backgroundColor: colors.main,
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 30,
    marginHorizontal: 1,
  },
  addToCartButtonText: {
    color: '#ffffff',
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
    zIndex: 1000,
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
    marginRight: -5,
  },
});

export default ProductDetailPage;
