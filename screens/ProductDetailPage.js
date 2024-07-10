import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../styles/color'; // Assuming you have defined colors elsewhere
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome icons

const ProductDetailPage = ({ route }) => {
  const { productName, imageSource, description, price } = route.params;

  // Dummy product images for demonstration
  const productImages = [
    require('../assets/product.png'),
    require('../assets/product.png'),
    require('../assets/product.png'),
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrevious = () => {
    setActiveIndex(activeIndex === 0 ? productImages.length - 1 : activeIndex - 1);
  };

  const handleNext = () => {
    setActiveIndex(activeIndex === productImages.length - 1 ? 0 : activeIndex + 1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {/* Truck icon and shipping text */}
        <View style={styles.shippingInfo}>
          <FontAwesome name="truck" size={24} color="white" style={styles.truckIcon} />
          <Text style={styles.shippingText}>Shipping Within 12 Days</Text>
        </View>

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
      </View>
      <Text style={styles.title}>{productName}</Text>
      <Text style={styles.text}>Description: {description}</Text>
      <Text style={styles.text}>Price: {price}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
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
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  shippingInfo: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: colors.second,
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  truckIcon: {
    marginRight: 5,
  },
  shippingText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
});

export default ProductDetailPage;
