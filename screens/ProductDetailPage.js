import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Button,
  TouchableOpacity,
} from 'react-native'; // Use TouchableOpacity
import axios from 'axios';
import Toast from 'react-native-toast-message';
import AttributesSelector from '../components/productScreen/AttributesSelector';
import ProductHeader from '../components/productScreen/ProductHeader';
import ImageCarousel from '../components/productScreen/ImageCarousel';
import QuantityControl from '../components/productScreen/QuantityControl';
import SpecificationsTable from '../components/productScreen/SpecificationsTable';
import AddToCartButton from '../components/productScreen/AddToCartButton';
import { useCart } from '../components/CartContext';
import { colors } from '../styles/color';
import { ActivityIndicator } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import CustomHeader2 from '../components/CustomHeader2';

const ProductDetailPage = ({ route }) => {
  const { mainId, productId, attribute1D, attribute2D, attribute3D } = route.params || {};
  const [productData, setProductData] = useState(null);
  const [selectedAttribute1, setSelectedAttribute1] = useState(null);
  const [selectedAttribute2, setSelectedAttribute2] = useState(null);
  const [selectedAttribute3, setSelectedAttribute3] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [imageIndex, setImageIndex] = useState(0);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const userId = auth().currentUser?.uid; // Get the user ID from the authentication module

        const response = await axios.post(
          'https://crossbee-server-1036279390366.asia-south1.run.app/productInfo',
          {
            main: mainId,
          
            product: productId,
            uid: userId, // Add the user ID to the API request body
          },
        );

        const data = response.data;
        setProductData(data);

        if (attribute1D && attribute2D && attribute3D) {
          setSelectedAttribute1(attribute1D);
          setSelectedAttribute2(attribute2D);
          setSelectedAttribute3(attribute3D);
        } else {
          updateSelections(data);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [mainId, productId, attribute1D, attribute2D, attribute3D]);


  useEffect(() => {
    // Ensure quantity is set to minCartValue when selections change
    if (
      productData &&
      selectedAttribute1 &&
      selectedAttribute2 &&
      selectedAttribute3
    ) {
      const minCartValue = getMinCartValue();
      setQuantity(minCartValue);
    }
  }, [productData, selectedAttribute1, selectedAttribute2, selectedAttribute3]);


  const updateSelections = (data) => {
    if (data) {
      const attribute1 = data.attribute1;
      const attribute2 = data.attribute2;
      const attribute3 = data.attribute3;

      // Use the first available option if no route params
      const firstAttribute1 = attribute1D || Object.keys(data.data[attribute1])[0];
      setSelectedAttribute1(firstAttribute1);

      const attribute2Options = Object.keys(data.data[attribute1][firstAttribute1]?.[attribute2] || {});
      if (attribute2Options.length > 0) {
        const firstAttribute2 = attribute2D || attribute2Options[0];
        setSelectedAttribute2(firstAttribute2);

        const colorOptions = Object.keys(data.data[attribute1][firstAttribute1]?.[attribute2]?.[firstAttribute2] || {});
        if (colorOptions.length > 0) {
          setSelectedAttribute3(attribute3D || colorOptions[0]);
        }
      }
    }
  };

  const handleNextImage = () => {
    setImageIndex(prevIndex => (prevIndex + 1) % uniqueImages.length);
  };

  const handlePreviousImage = () => {
    setImageIndex(
      prevIndex => (prevIndex - 1 + uniqueImages.length) % uniqueImages.length,
    );
  };

  const getMinCartValue = () => {
    if (
      productData &&
      selectedAttribute1 &&
      selectedAttribute2 &&
      selectedAttribute3
    ) {
      const attribute1 = productData.attribute1;
      const attribute2 = productData.attribute2;
      const attribute3 = productData.attribute3;

      const currentProduct =
        productData.data[attribute1]?.[selectedAttribute1]?.[attribute2]?.[
        selectedAttribute2
        ]?.[selectedAttribute3];
      if (currentProduct) {
        return parseInt(currentProduct.minCartValue || '1', 10);
      }
    }
    return 1; // Default value if no attributes or color are selected
  };
  const getMaxCartValue = () => {
    if (
      productData &&
      selectedAttribute1 &&
      selectedAttribute2 &&
      selectedAttribute3
    ) {
      const attribute1 = productData.attribute1;
      const attribute2 = productData.attribute2;
      const attribute3 = productData.attribute3;

      const currentProduct =
        productData.data[attribute1]?.[selectedAttribute1]?.[attribute2]?.[
        selectedAttribute2
        ]?.[selectedAttribute3];
      if (currentProduct) {
        return parseInt(currentProduct.inventory || '0', 10);
      }
    }
    return 0;
  };
  const handleAttribute1Change = attribute1 => {
    if (productData) {
      setSelectedAttribute1(attribute1);
      const attribute2Key = productData.attribute2;

      // Fetch new attribute2 options based on the updated attribute1 selection
      const attribute2Options = Object.keys(
        productData.data[attribute1]?.[attribute2Key] || {},
      );
      if (attribute2Options.length > 0) {
        const firstAttribute2 = attribute2Options[0];
        setSelectedAttribute2(firstAttribute2);

        // Fetch new color options based on the updated attribute2 selection
        const colorOptions = Object.keys(
          productData.data[attribute1]?.[attribute2Key]?.[firstAttribute2] ||
          {},
        );
        if (colorOptions.length > 0) {
          setSelectedAttribute3(colorOptions[0]);
        }
      }
    }
  };

  const handleAttribute2Change = attribute2 => {
    if (productData && selectedAttribute1) {
      setSelectedAttribute2(attribute2);

      // Fetch new color options based on the updated attribute2 selection
      const attribute1 = productData.attribute1;
      const attribute2Key = productData.attribute2;

      const colorOptions = Object.keys(
        productData.data[attribute1]?.[selectedAttribute1]?.[attribute2Key]?.[
        attribute2
        ] || {},
      );
      if (colorOptions.length > 0) {
        setSelectedAttribute3(colorOptions[0]);
      }
    }
  };

  const handleColorChange = color => {
    setSelectedAttribute3(color);
  };

  const handleIncrease = () => {
    const maxQuantity = getMaxCartValue();
    const increment = parseInt(bag, 10) || 1; // Use the bag value or default to 1
    if (quantity + increment <= maxQuantity) {
      setQuantity(quantity + increment);
      Toast.show({
        type: 'success',
        text1: 'Quantity Increased',
        text2: `Quantity is now ${quantity + increment}`,
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Max Quantity Reached',
        text2: `You cannot exceed ${maxQuantity}`,
      });
    }
  };
  
  const handleDecrease = () => {
    const minCartValue = getMinCartValue();
    const decrement = parseInt(bag, 10) || 1; // Use the bag value or default to 1
    if (quantity - decrement >= minCartValue) {
      setQuantity(quantity - decrement);
      Toast.show({
        type: 'info',
        text1: 'Quantity Decreased',
        text2: `Quantity is now ${quantity - decrement}`,
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Minimum Quantity Reached',
        text2: `You cannot go below ${minCartValue}`,
      });
    }
  };
 
  

  const handleAddToCart = () => {
    console.log(bag);
    if (
      productData &&
      selectedAttribute1 &&
      selectedAttribute2 &&
      selectedAttribute3
    ) {
      const attribute1 = productData.attribute1;
      const attribute2 = productData.attribute2;
      const attribute3 = productData.attribute3;

      const item = {
        productName,
        productId,
        name: productData.data[attribute1][selectedAttribute1]?.[attribute2]?.[
          selectedAttribute2
        ]?.[selectedAttribute3]?.name,
        price:
          productData.data[attribute1][selectedAttribute1]?.[attribute2]?.[
            selectedAttribute2
          ]?.[selectedAttribute3]?.price,
        quantity,
        bag,
        image:
          productData.data[attribute1][selectedAttribute1]?.[attribute2]?.[
            selectedAttribute2
          ]?.[selectedAttribute3]?.images[0],
        colorminCartValue:
          productData.data[attribute1][selectedAttribute1]?.[attribute2]?.[
            selectedAttribute2
          ]?.[selectedAttribute3]?.minCartValue,
        colormaxCartValue:
          productData.data[attribute1][selectedAttribute1]?.[attribute2]?.[
            selectedAttribute2
          ]?.[selectedAttribute3]?.inventory,
        attributeSelected1: selectedAttribute1,
        attributeSelected2: selectedAttribute2,
        attributeSelected3: selectedAttribute3,
        attribute1: attribute1,
        attribute2: attribute2,
        attribute3: attribute3,
        attribute1Id: attribute1Id,
        attribute2Id: attribute2Id,
        attribute3Id: attribute3Id,
        additionalDiscount: discountPercentage || 0, // Ensure additionalDiscount is passed
        discountedPrice: cutPrice,
        mainId, // Added mainId
   

      };
   

      // Add item to cart in Firebase
      addToCart(item);
    } else {
      Toast.show({
        type: 'error',
        text1: 'Incomplete Selection',
        text2: 'Please select all attributes before adding to the cart.',
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFB800" />
      </View>
    );
  }


  const attribute1 = productData?.attribute1;
  const attribute2 = productData?.attribute2;
  const attribute3 = productData?.attribute3;
  const productName = productData?.productName || 'Product Name';
 
  const storageOptions =
    productData && attribute1
      ? Object.keys(productData.data[attribute1] || {})
      : [];
  const ramOptions =
    selectedAttribute1 && attribute1
      ? Object.keys(
        productData.data[attribute1][selectedAttribute1]?.[attribute2] || {},
      )
      : [];
  const colorOptions =
    selectedAttribute1 && selectedAttribute2 && attribute1
      ? Object.keys(
        productData.data[attribute1][selectedAttribute1]?.[attribute2]?.[
        selectedAttribute2
        ] || {},
      )
      : [];
  const currentProduct =
    selectedAttribute1 && selectedAttribute2 && selectedAttribute3 && attribute1
      ? productData.data[attribute1][selectedAttribute1]?.[attribute2]?.[
      selectedAttribute2
      ]?.[selectedAttribute3]
      : {};

  const additionalDiscount = currentProduct?.additionalDiscount;
  const attribute1Id = currentProduct?.attribute1Id;
  const attribute2Id = currentProduct?.attribute2Id;
  const bag = currentProduct?.bag || '1';
  console.log(currentProduct);

  const attribute3Id = currentProduct?.attribute3Id;
  const images = currentProduct?.images || [];
  const videoLink = currentProduct?.videoLink;
  const discountPercentage = currentProduct.additionalDiscount;
  const cutPrice = (currentProduct.price * (1 - discountPercentage / 100)).toFixed(0);
 const lowestPrice = currentProduct.lowestPrice;
  const uniqueImages = Array.from(
    new Set(images.concat(videoLink).filter(Boolean)),
  );
  if (videoLink) {
    images.push(videoLink); // Add the video link to the images array
  }

  const product = {
    mainId, // Already present in the component
    productId,
 
    attribute1Id: currentProduct?.attribute1Id,
    attribute2Id: currentProduct?.attribute2Id,
    attribute3Id: currentProduct?.attribute3Id,
    additionalDiscount : currentProduct?.additionalDiscount,
    displayName: productName,
    productId,
    name: productData.data[attribute1][selectedAttribute1]?.[attribute2]?.[
      selectedAttribute2
    ]?.[selectedAttribute3]?.name,
    price:
      productData.data[attribute1][selectedAttribute1]?.[attribute2]?.[
        selectedAttribute2
      ]?.[selectedAttribute3]?.price,
    quantity,
    image:
      productData.data[attribute1][selectedAttribute1]?.[attribute2]?.[
        selectedAttribute2
      ]?.[selectedAttribute3]?.images[0],

  };

  const getStockStatus = () => {
    if (
      productData &&
      selectedAttribute1 &&
      selectedAttribute2 &&
      selectedAttribute3
    ) {
      const attribute1 = productData.attribute1;
      const attribute2 = productData.attribute2;

      const currentProduct =
        productData.data[attribute1]?.[selectedAttribute1]?.[attribute2]?.[
        selectedAttribute2
        ]?.[selectedAttribute3];
      return currentProduct ? currentProduct.outOfStock : false;
    }
    return false; // Default value if no attributes or color are selected
  };

  const getEstimatedArrivalDate = () => {
    if (
      productData &&
      selectedAttribute1 &&
      selectedAttribute2 &&
      selectedAttribute3
    ) {
      const attribute1 = productData.attribute1;
      const attribute2 = productData.attribute2;

      const currentProduct =
        productData.data[attribute1]?.[selectedAttribute1]?.[attribute2]?.[
        selectedAttribute2
        ]?.[selectedAttribute3];
      return currentProduct ? currentProduct.estdArrivalDate : null;
    }
    return null; // Default value if no attributes or color are selected
  };


  const stockStatus = getStockStatus();
  const estdArrivalDate = getEstimatedArrivalDate();

  return (
    <View style={styles.container2}>
      <CustomHeader2 title="Product" />
      <ScrollView ref={scrollViewRef} style={styles.container}>
        <ImageCarousel
          images={uniqueImages}
          onPrevious={handlePreviousImage}
          onNext={handleNextImage}
          imageIndex={imageIndex}
          loading={loading}
          lowestPrice={lowestPrice}
        />

        <ProductHeader
        product={product}
          name={productName}
          description={currentProduct?.description || 'N/A'}
          price={currentProduct.price || 'N/A'}
          discountedPrice={cutPrice || 'N/A'}
          scrollViewRef={scrollViewRef} // Pass the ref to ProductHeader
          onCall={() => { }}
          colorDeliveryTime={currentProduct?.deliveryTime}
          outOfStock={stockStatus}
        />
        <AttributesSelector
          attributeData={storageOptions.map(item => ({ id: item, value: item }))}
          selectedValue={selectedAttribute1}
          onSelect={handleAttribute1Change}
          attributeName={attribute1}
        />
        {selectedAttribute1 && (
          <AttributesSelector
            attributeData={ramOptions.map(item => ({ id: item, value: item }))}
            selectedValue={selectedAttribute2}
            onSelect={handleAttribute2Change}
            attributeName={attribute2}
          />
        )}
        {selectedAttribute1 && selectedAttribute2 && (
          <>
            <AttributesSelector
              attributeData={colorOptions.map(item => ({
                id: item,
                value: item,
              }))}
              selectedValue={selectedAttribute3}
              onSelect={handleColorChange}
              attributeName={attribute3}
            />
            <QuantityControl
              quantity={quantity}
              minValue={getMinCartValue()} // Pass the minCartValue
              maxValue={getMaxCartValue()}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              bag={bag}
            />
            <View style={styles.productDetails}>
              <Text style={styles.Head}>Product Description:</Text>
              <Text style={styles.regularText}>
                {currentProduct?.description || 'N/A'}
              </Text>
            </View>
            <SpecificationsTable
              specifications={currentProduct?.specifications || []}
            />
            {stockStatus ? (
              <View style={styles.outOfStockContainer}>
                <Text style={styles.outOfStockText}>Out Of Stock</Text>
                {estdArrivalDate && (
                  <Text style={styles.arrivalDateText}>
                    Estimated Arrival: {estdArrivalDate}
                  </Text>
                )}
              </View>
            ) : null}
          </>
        )}
      </ScrollView>
      {!stockStatus && (
        <TouchableOpacity
          style={[
            styles.addToCartButton,
            {
              backgroundColor: colors.main,
              opacity:
                !selectedAttribute1 ||
                  !selectedAttribute2 ||
                  !selectedAttribute3 ||
                  !currentProduct?.price ||
                  currentProduct?.price === 'N/A'
                  ? 0.5
                  : 1,
            },
          ]}
          onPress={handleAddToCart}
          disabled={
            !selectedAttribute1 ||
            !selectedAttribute2 ||
            !selectedAttribute3 ||
            !currentProduct?.price ||
            currentProduct?.price === 'N/A'
          }>
          <Text style={styles.addToCartButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container2: {
    flex: 1,
    backgroundColor: '#fff',

  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 50,
  },
  productDetails: {
    width: '90%',
    marginTop: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Head: {
    fontSize: 18,
    fontFamily: 'Outfit-Medium',
    color: colors.TextBlack,
    marginTop: 10,
  },
  regularText: {
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    color: colors.TextBlack,
  },
  addToCartButton: {
    position: 'absolute',
    bottom: 0,

    width: '100%',
    paddingVertical: 10,

    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
  },
  outOfStockContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  outOfStockText: {
    fontSize: 18,
    color: 'red',
    fontFamily: 'Outfit-Medium',
  },
  arrivalDateText: {
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    color: 'gray',
    marginTop: 5,
    marginBottom: 20,
  },
});

export default ProductDetailPage;