import React, {useState, useEffect} from 'react';
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
import {useCart} from '../components/CartContext';
import {colors} from '../styles/color';
import {ActivityIndicator} from 'react-native-paper';

const ProductDetailPage = ({route}) => {
  const {mainId, categoryId, productId} = route.params || {};

  const [productData, setProductData] = useState(null);
  const [selectedAttribute1, setSelectedAttribute1] = useState(null);
  const [selectedAttribute2, setSelectedAttribute2] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const {addToCart} = useCart();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.post(
          'https://crossbee-server.vercel.app/productInfo',
          {
            main: mainId,
            category: categoryId,
            product: productId,
          },
        );
        const data = response.data;
        setProductData(data);

        // Initial setup of selections
        updateSelections(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [mainId, categoryId, productId]);

  useEffect(() => {
    // Ensure quantity is set to minCartValue when selections change
    if (
      productData &&
      selectedAttribute1 &&
      selectedAttribute2 &&
      selectedColor
    ) {
      const minCartValue = getMinCartValue();
      setQuantity(minCartValue);
    }
  }, [productData, selectedAttribute1, selectedAttribute2, selectedColor]);

  const updateSelections = data => {
    if (data) {
      const attribute1 = data.attribute1;
      const attribute2 = data.attribute2;

      // Reset selections and set defaults
      const firstAttribute1 = Object.keys(data.data[attribute1])[0];
      setSelectedAttribute1(firstAttribute1);

      const attribute2Options = Object.keys(
        data.data[attribute1][firstAttribute1]?.[attribute2] || {},
      );
      if (attribute2Options.length > 0) {
        const firstAttribute2 = attribute2Options[0];
        setSelectedAttribute2(firstAttribute2);

        const colorOptions = Object.keys(
          data.data[attribute1][firstAttribute1]?.[attribute2]?.[
            firstAttribute2
          ] || {},
        );
        if (colorOptions.length > 0) {
          setSelectedColor(colorOptions[0]);
        }
      }
    }
  };

  const getMinCartValue = () => {
    if (
      productData &&
      selectedAttribute1 &&
      selectedAttribute2 &&
      selectedColor
    ) {
      const attribute1 = productData.attribute1;
      const attribute2 = productData.attribute2;

      const currentProduct =
        productData.data[attribute1]?.[selectedAttribute1]?.[attribute2]?.[
          selectedAttribute2
        ]?.[selectedColor];
      if (currentProduct) {
        return parseInt(currentProduct.minCartValue || '1', 10);
      }
    }
    return 1; // Default value if no attributes or color are selected
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
          setSelectedColor(colorOptions[0]);
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
        setSelectedColor(colorOptions[0]);
      }
    }
  };

  const handleColorChange = color => {
    setSelectedColor(color);
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
    Toast.show({
      type: 'success',
      text1: 'Quantity Increased',
      text2: `Quantity is now ${quantity + 1}`,
    });
  };

  const handleDecrease = () => {
    const minCartValue = getMinCartValue();
    if (quantity > minCartValue) {
      setQuantity(quantity - 1);
      Toast.show({
        type: 'info',
        text1: 'Quantity Decreased',
        text2: `Quantity is now ${quantity - 1}`,
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
    if (
      productData &&
      selectedAttribute1 &&
      selectedAttribute2 &&
      selectedColor
    ) {
      const attribute1 = productData.attribute1;
      const attribute2 = productData.attribute2;

      const item = {
        productId,
        name: productData.data[attribute1][selectedAttribute1]?.[attribute2]?.[
          selectedAttribute2
        ]?.[selectedColor]?.name,
        price:
          productData.data[attribute1][selectedAttribute1]?.[attribute2]?.[
            selectedAttribute2
          ]?.[selectedColor]?.price,
        color: selectedColor,
        quantity,
        image:
          productData.data[attribute1][selectedAttribute1]?.[attribute2]?.[
            selectedAttribute2
          ]?.[selectedColor]?.images[0],
        colorminCartValue:
          productData.data[attribute1][selectedAttribute1]?.[attribute2]?.[
            selectedAttribute2
          ]?.[selectedColor]?.minCartValue,
      };

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
        <ActivityIndicator size="large" color="#FCCC51" />
      </View>
    );
  }

  const attribute1 = productData?.attribute1;
  const attribute2 = productData?.attribute2;
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
    selectedAttribute1 && selectedAttribute2 && selectedColor && attribute1
      ? productData.data[attribute1][selectedAttribute1]?.[attribute2]?.[
          selectedAttribute2
        ]?.[selectedColor]
      : {};
  const images = currentProduct?.images || [];
  console.log(images);

  const getStockStatus = () => {
    if (
      productData &&
      selectedAttribute1 &&
      selectedAttribute2 &&
      selectedColor
    ) {
      const attribute1 = productData.attribute1;
      const attribute2 = productData.attribute2;

      const currentProduct =
        productData.data[attribute1]?.[selectedAttribute1]?.[attribute2]?.[
          selectedAttribute2
        ]?.[selectedColor];
      return currentProduct ? currentProduct.outOfStock : false;
    }
    return false; // Default value if no attributes or color are selected
  };

  const getEstimatedArrivalDate = () => {
    if (
      productData &&
      selectedAttribute1 &&
      selectedAttribute2 &&
      selectedColor
    ) {
      const attribute1 = productData.attribute1;
      const attribute2 = productData.attribute2;

      const currentProduct =
        productData.data[attribute1]?.[selectedAttribute1]?.[attribute2]?.[
          selectedAttribute2
        ]?.[selectedColor];
      return currentProduct ? currentProduct.estdArrivalDate : null;
    }
    return null; // Default value if no attributes or color are selected
  };

  const stockStatus = getStockStatus();
  const estdArrivalDate = getEstimatedArrivalDate();

  return (
    <ScrollView style={styles.container}>
      <ImageCarousel
        images={images}
        onPrevious={() => {}}
        onNext={() => {}}
        imageIndex={0}
        loading={loading}
        colorDeliveryTime={currentProduct?.deliveryTime}
      />
      <ProductHeader
        name={productName}
        description={currentProduct?.description || 'N/A'}
        price={currentProduct?.price || 'N/A'}
        onCall={() => {}}
      />
      <AttributesSelector
        attributeData={storageOptions.map(item => ({id: item, value: item}))}
        selectedValue={selectedAttribute1}
        onSelect={handleAttribute1Change}
        attributeName={attribute1}
      />
      {selectedAttribute1 && (
        <AttributesSelector
          attributeData={ramOptions.map(item => ({id: item, value: item}))}
          selectedValue={selectedAttribute2}
          onSelect={handleAttribute2Change}
          attributeName={attribute2}
        />
      )}
      {selectedAttribute1 && selectedAttribute2 && (
        <>
          <AttributesSelector
            attributeData={colorOptions.map(item => ({id: item, value: item}))}
            selectedValue={selectedColor}
            onSelect={handleColorChange}
            attributeName="Color"
          />
          <QuantityControl
            quantity={quantity}
            minValue={getMinCartValue()} // Pass the minCartValue
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
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
          ) : (
            <TouchableOpacity
              style={[
                styles.addToCartButton,
                {
                  backgroundColor: colors.main,
                  marginBottom: 25,
                  opacity:
                    !selectedAttribute1 || !selectedAttribute2 || !selectedColor
                      ? 0.5
                      : 1,
                },
              ]}
              onPress={handleAddToCart}
              disabled={
                !selectedAttribute1 || !selectedAttribute2 || !selectedColor
              }>
              <Text style={styles.addToCartButtonText}>Add to Cart</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
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
    fontSize: 20,
    fontFamily: 'Outfit-Bold',
    color: colors.TextBlack,
    fontWeight: 'bold',
  },
  regularText: {
    fontSize: 16,
    fontFamily: 'Outfit-Bold',
    color: colors.TextBlack,
  },
  addToCartButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Outfit-Bold',
    fontWeight: 'bold',
  },
  outOfStockContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  outOfStockText: {
    fontSize: 18,
    color: 'red',
    fontWeight: 'bold',
  },
  arrivalDateText: {
    fontSize: 16,
    color: 'gray',
    marginTop: 5,
    marginBottom: 20,
  },
});

export default ProductDetailPage;
