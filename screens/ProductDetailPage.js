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
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useCart} from '../components/CartContext';
import WhatsAppButton2 from '../components/WhatsAppButton2';
import {colors} from '../styles/color';

const ProductDetailPage = ({route}) => {
  const {productId} = route.params || {};
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
  const [quantity, setQuantity] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  const [currentImages, setCurrentImages] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(null);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const categoriesSnapshot = await firestore()
          .collection('categories')
          .get();
        for (const categoryDoc of categoriesSnapshot.docs) {
          const companiesSnapshot = await categoryDoc.ref
            .collection('companies')
            .get();
          for (const companyDoc of companiesSnapshot.docs) {
            const productDoc = await companyDoc.ref
              .collection('products')
              .doc(productId)
              .get();
            if (productDoc.exists) {
              const productData = productDoc.data();
              setProduct(productData);
              setSelectedColor(productData.colorsAvailable[0]); // Set default color
              setCurrentImages(productData.mainImage); // Set default images
              setCurrentPrice(productData.price); // Set default price
              return;
            }
          }
        }
        console.log('Product not found!');
      } catch (error) {
        console.error('Error fetching product data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductData();
    }
  }, [productId]);

  useEffect(() => {
    if (selectedStorage && product) {
      const sizes = product.storageOptions[selectedStorage]?.sizes || [];
      setSizesAvailable(sizes);
      setSelectedSize(null);
      setColorsAvailable([]);
    }
  }, [selectedStorage, product]);

  useEffect(() => {
    if (selectedSize && selectedStorage && product) {
      const selectedSizeMap = product.storageOptions[
        selectedStorage
      ]?.sizes.find(sizeMap => sizeMap[selectedSize]);
      const colors = selectedSizeMap
        ? selectedSizeMap[selectedSize].colors
        : [];
      setColorsAvailable(colors);
    }
  }, [selectedSize, selectedStorage, product]);

  useEffect(() => {
    if (selectedColor && product) {
      const sizeMap = product.storageOptions[selectedStorage]?.sizes.find(
        sizeMap => sizeMap[selectedSize]
      );
      const colorMap = sizeMap?.[selectedSize]?.colors.find(
        colorMap => Object.keys(colorMap)[0] === selectedColor
      );

      if (colorMap) {
        const colorImages = colorMap[selectedColor]?.images || [];
        setCurrentImages(colorImages);
        const price = colorMap[selectedColor]?.price || product.price;
        setCurrentPrice(price);
      } else {
        setCurrentImages(product.mainImage); // Fallback to main images if color not found
        setCurrentPrice(product.price);
      }
    }
  }, [selectedColor, selectedSize, selectedStorage, product]);

  const handlePrevious = () => {
    setImageIndex(prevIndex => (prevIndex === 0 ? currentImages.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setImageIndex(prevIndex => (prevIndex === currentImages.length - 1 ? 0 : prevIndex + 1));
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Product not found!</Text>
      </View>
    );
  }

  const {
    productName,
    description,
    specifications,
    deliveryTime,
  } = product;

  const handleCall = () => {
    const phoneNumber = '9289881135';
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleColorSelect = colorName => {
    setSelectedColor(colorName);

    if (selectedSize && selectedStorage && product) {
      const sizeMap = product.storageOptions[selectedStorage]?.sizes.find(
        sizeMap => sizeMap[selectedSize]
      );
      const colorMap = sizeMap?.[selectedSize]?.colors.find(
        colorMap => Object.keys(colorMap)[0] === colorName
      );

      if (colorMap) {
        const colorImages = colorMap[colorName]?.images || [];
        setCurrentImages(colorImages);
        const price = colorMap[colorName]?.price || product.price;
        setCurrentPrice(price);
      } else {
        setCurrentImages(product.mainImage); // Fallback to main images if color not found
        setCurrentPrice(product.price);
      }
    }
  };

  const handleStorageSelect = storage => {
    setSelectedStorage(storage);
  };

  const handleSizeSelect = size => {
    setSelectedSize(size);
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
      }, 2000);
    });
  };

  const handleAddToCart = () => {
    const newItem = {
      id: productId,
      name: productName,
      price: currentPrice || price,
      quantity: quantity,
      color: selectedColor,
      image: currentImages[0], // Defaulting to the first image of the currentImages array
    };
    addToCart(newItem);
    showAlert();
  };

  return (
    <View>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.imageContainer}>
          {currentImages.length > 0 && (
            <Image
              source={{ uri: currentImages[imageIndex] }}
              style={styles.image}
            />
          )}
          <TouchableOpacity
            style={[styles.arrowButton, { left: 10 }]}
            onPress={handlePrevious}>
            <Text style={styles.arrowText}>{'<'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.arrowButton, { right: 10 }]}
            onPress={handleNext}>
            <Text style={styles.arrowText}>{'>'}</Text>
          </TouchableOpacity>
          <View style={styles.pagination}>
            {currentImages.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === imageIndex && styles.activeDot,
                ]}
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
              <Text style={styles.truckText}>{deliveryTime}</Text>
            </View>

        </View>

        <View style={styles.productDetails}>
          <Text style={styles.title}>{productName}</Text>
          <Text style={styles.descriptionText}>{description}</Text>
          <View style={styles.priceContainer}>
          <Text style={styles.priceText}>
            Price: ₹{currentPrice || price}
          </Text>
          <TouchableOpacity onPress={handleCall}>
                <Image
                  source={require('../assets/call.png')}
                  style={styles.callIcon}
                />
              </TouchableOpacity>
              </View>

          <View style={styles.productDetails}>
            <Text style={styles.Head}>Storage:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.colorScrollContainer}>
              {Object.keys(product.storageOptions).map((storage, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.colorButton,
                    selectedStorage === storage && styles.selectedButton,
                  ]}
                  onPress={() => handleStorageSelect(storage)}>
                  <Text
                    style={[
                      styles.colorButtonText,
                      selectedStorage === storage && styles.selectedText,
                    ]}>
                    {storage}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>


          {selectedStorage && (
            <View style={styles.productDetails}>
              <Text style={styles.Head}>Sizes:</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.colorScrollContainer}>
                {sizesAvailable.map((sizeMap, index) => {
                  const size = Object.keys(sizeMap)[0];
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.colorButton,
                        selectedSize === size && styles.selectedButton,
                      ]}
                      onPress={() => handleSizeSelect(size)}>
                      <Text
                        style={[
                          styles.colorButtonText,
                          selectedSize === size && styles.selectedText,
                        ]}>
                        {size}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}
          {selectedSize && selectedStorage && (
            <View style={styles.productDetails}>
              <Text style={styles.Head}>Color:</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.colorScrollContainer}>
                {colorsAvailable.map((colorMap, index) => {
                  const colorName = Object.keys(colorMap)[0];
                return (
                  <TouchableOpacity
                    key={colorName}
                    onPress={() => handleColorSelect(colorName)}
                    style={[
                      styles.colorButton,
                      selectedColor === colorName && styles.selectedButton,
                    ]}>
                    <Text
                      style={[
                        styles.colorButtonText,
                        selectedColor === colorName && styles.selectedText,
                      ]}>
                      {colorName}
                    </Text>
                  </TouchableOpacity>
                );
              })}
              </ScrollView>
            </View>
          )}

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
          <View style={styles.specificationsContainer}>
            <Text style={styles.specificationsTitle}>Specifications:</Text>
            <View style={styles.specificationTable}>
              {Object.entries(specifications).map(([key, value], index) => (
                <View
                  key={index}
                  style={[
                    styles.specificationRow,
                    index % 2 === 0 ? styles.specificationRowEven : styles.specificationRowOdd,
                  ]}
                >
                  <Text style={styles.specificationKey}>{key}</Text>
                  <Text style={styles.specificationValue}>{value}</Text>
                </View>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
            <Text style={styles.addToCartButtonText}>Add to Cart</Text>
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

