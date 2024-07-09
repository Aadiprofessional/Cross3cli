import React, {useState, useEffect, useRef} from 'react';
import {View, Image, StyleSheet, ScrollView, Dimensions} from 'react-native';
import {sizes} from '../styles/size';
import {colors} from '../styles/color';

const AutoImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(1); // Start from the first actual image (after the duplicated one)
  const images = [
    require('../assets/banner.png'),
    require('../assets/banner.png'),
    require('../assets/banner.png'),
  ];

  // Add duplicates for looping effect
  const imagesWithDuplicates = [
    images[images.length - 1], // Last image
    ...images,
    images[0], // First image
  ];

  const sliderWidth = Dimensions.get('window').width;
  const imageWidth = sliderWidth; // 100% of the screen width
  const sideImageWidth = 0; // No side margins

  const scrollRef = useRef();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(current => (current === images.length ? 1 : current + 1));
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        x: currentIndex * (imageWidth + sideImageWidth * 2), // Adjust scroll position
        animated: true,
      });
    }
  }, [currentIndex, imageWidth, sideImageWidth]);

  const handleScroll = event => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.floor(contentOffset / slideSize);

    if (index === 0) {
      setCurrentIndex(images.length); // Jump to the last image (without animation)
    } else if (index === images.length + 1) {
      setCurrentIndex(1); // Jump to the first image (without animation)
    } else {
      setCurrentIndex(index);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={{width: sliderWidth}}
        contentContainerStyle={styles.scrollViewContent}
        ref={scrollRef}>
        {imagesWithDuplicates.map((image, index) => (
          <View
            key={index}
            style={[styles.imageContainer, {width: imageWidth}]}>
            <Image source={image} style={styles.image} />
          </View>
        ))}
      </ScrollView>
      <View style={styles.pagination}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex - 1 && styles.activeDot, // Apply active dot style when current
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    height: 250, // Adjusted height to accommodate the images and dots

    backgroundColor: colors.main, // Background color for the entire component
    overflow: 'hidden', // Ensures the content does not overflow the container
  },
  scrollViewContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  pagination: {
    position: 'absolute',
    bottom: 1, // Adjusted distance from the bottom of the images
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 5, // Padding for vertical spacing
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    marginHorizontal: sizes.marginVertical,
  },
  activeDot: {
    width: 16,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#316487',
  },
});

export default AutoImageSlider;
