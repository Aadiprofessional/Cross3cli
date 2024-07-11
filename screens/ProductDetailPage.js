import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { colors } from '../styles/color'; // Assuming you have defined colors elsewhere

const ProductDetailPage = ({ route }) => {
  const { productName, imageSource, description, price } = route.params;

  // Dummy product images for demonstration
  const productImages = [
    require('../assets/product2.png'),
    require('../assets/product2.png'),
    require('../assets/product2.png'),
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handlePrevious = () => {
    setActiveIndex(activeIndex === 0 ? productImages.length - 1 : activeIndex - 1);
  };

  const handleNext = () => {
    setActiveIndex(activeIndex === productImages.length - 1 ? 0 : activeIndex + 1);
  };

  const handleCall = () => {
    const phoneNumber = '9289881135';
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(event) => {
              const contentOffsetX = event.nativeEvent.contentOffset.x;
              const index = Math.floor(contentOffsetX / styles.imageContainer.width);
              setActiveIndex(index);
            }}
          >
            {productImages.map((img, index) => (
              <Image key={index} source={img} style={styles.image} />
            ))}
          </ScrollView>

          {/* Navigation arrows and dot indicators */}
          <TouchableOpacity style={[styles.arrowButton, { left: 10 }]} onPress={handlePrevious}>
            <Text style={styles.arrowText}>{'<'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.arrowButton, { right: 10 }]} onPress={handleNext}>
            <Text style={styles.arrowText}>{'>'}</Text>
          </TouchableOpacity>
          <View style={styles.dotContainer}>
            {productImages.map((img, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === activeIndex ? styles.activeDot : null,
                ]}
              />
            ))}
          </View>

          {/* Truck icon */}
          <View style={styles.truckIcon}>
            <Image
              source={require('../assets/truck.png')}
              style={styles.truckImage}
            />
          </View>

          {/* Text outside the truck icon */}
          <View style={styles.truckTextContainer}>
            <Text style={styles.truckText}>Shipping Within 12 Days</Text>
          </View>
          
        </View>

        {/* Product details */}
        <View style={styles.productDetails}>
          <Text style={styles.title}>{productName}</Text>
          <Text style={styles.descriptionText}>Description: {description}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>Price: {price}</Text>
            <TouchableOpacity onPress={handleCall}>
              <Image source={require('../assets/call.png')} style={styles.callIcon} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Color selection */}
        <View style={styles.productDetails}>
          <Text style={styles.Head}>Colour:</Text>
          <View style={styles.colorSelectionContainer}>
            <ColorButton
              color="Black"
              selectedColor={selectedColor}
              onPress={() => handleColorSelect('Black')}
            />
            <ColorButton
              color="Blue"
              selectedColor={selectedColor}
              onPress={() => handleColorSelect('Blue')}
            />
            <ColorButton
              color="Red"
              selectedColor={selectedColor}
              onPress={() => handleColorSelect('Red')}
            />
            <ColorButton
              color="Green"
              selectedColor={selectedColor}
              onPress={() => handleColorSelect('Green')}
            />
          </View>
        </View>

        {/* Quantity selector */}
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

        {/* Product description */}
        <View style={styles.productDetails}>
          <Text style={styles.Head}>Product Description:</Text>
          <Text style={styles.regularText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac ligula ac urna posuere mollis.
            Nullam condimentum tellus nec magna iaculis, sit amet mollis ex lacinia. Phasellus eget leo 
            ut ligula iaculis venenatis. Sed faucibus enim ut lacus ultricies aliquet. Suspendisse potenti.
            Morbi malesuada lacus non magna auctor, at tristique elit interdum. Cras sit amet maximus lorem.
            Proin ac magna scelerisque, tincidunt mauris id, consequat lorem. Nam sed neque nec risus 
            lacinia tincidunt. Sed a odio luctus, tincidunt nunc eget, ultricies nunc. Aenean suscipit, 
            sapien quis fermentum pellentesque, turpis ipsum finibus sem, eget vehicula justo ante quis leo.
            Duis ut erat leo. Nullam ut quam risus. Quisque nec metus eu lectus rutrum ultricies. 
          </Text>
        </View>

        {/* Product specifications */}
        <View style={styles.productDetails}>
          <Text style={styles.Head}>Product Specifications:</Text>
          <View style={styles.specificationTable}>
            <View style={[styles.specRow, styles.firstRow]}>
              <Text style={styles.specLabel}>Material:</Text>
              <Text style={styles.specValue}>Cotton</Text>
            </View>
            <View style={[styles.specRow, styles.secondRow]}>
              <Text style={styles.specLabel}>Size:</Text>
              <Text style={styles.specValue}>Medium</Text>
            </View>
          </View>
        </View>

        {/* Add to cart button */}
        <TouchableOpacity style={styles.addToCartButton}>
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
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
    justifyContent: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
    marginRight: -40,
  },
  container: {
    width: '100%',
  },
  imageContainer: {
    width: '90%',
    aspectRatio: 1, // Square aspect ratio
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 20,
    position: 'relative',
    borderWidth: 0.1,
    borderColor: '#474747',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    width: '100%',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C4C4C4',
    marginHorizontal: 5,
  },
  activeDot: {
    width: 12,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.second,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.TextBlack,
  },
  productDetails: {
    width: '90%',
    marginTop: 20,
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
  truckIcon: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: colors.second, // Assuming colors.second is defined in your color styles
    borderRadius: 20,
    padding: 10,
  },
  truckImage: {
    width: 24,
    height: 24,
    tintColor: 'white', // Change the color of the truck icon if needed
  },
  truckTextContainer: {
    position: 'absolute',
    top: 15,
    left: 50, // Adjust the position as needed
    paddingHorizontal: 10,
    paddingVertical: 5,
    // Assuming colors.second is defined in your color styles
    borderRadius: 10,
  },
  truckText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '600', // Semi-bold
  },
  callIcon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  Head:{
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.TextBlack,

  
  },
  colorSelectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '90%',
  },
  colorButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.main,
    backgroundColor: '#FFFFFF',
    elevation: 5,
    marginRight: 5,
  },
  selectedButton: {
    backgroundColor: colors.main,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  colorButtonText: {
    fontSize: 12,
    fontWeight: 'regular',
    textAlign: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    width: '90%',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
    color: colors.TextBlack,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  quantityButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    
  },
  quantityNumber: {
    fontSize: 18,
    marginHorizontal: 10,
    color: colors.TextBlack,
  },
  regularText: {
    fontSize: 12,
    fontWeight: 'regular',
    color: colors.TextBlack,
    
    marginBottom: 10,
  },
  specificationTable: {
    marginTop: 10,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  firstRow: {
    backgroundColor: '#FFFFFF',
  },
  secondRow: {
    backgroundColor: '#D9D9D9',
  },
  specLabel: {
    fontWeight: 'bold',
    color: colors.TextBlack,
  },
  specValue: {
    flex: 1,
    textAlign: 'right',
    color: colors.TextBlack,
  },
  addToCartButton: {
    backgroundColor: colors.main,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    width: '90%',
    alignItems: 'center',
    marginBottom: 20,
  },
  addToCartText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProductDetailPage;
