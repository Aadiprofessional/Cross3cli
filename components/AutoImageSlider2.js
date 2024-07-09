import React, {useState, useEffect, useRef} from 'react';
import {View, Image, StyleSheet, ScrollView, Dimensions} from 'react-native';
import {colors} from '../styles/color';

const AutoImageSlider2 = () => {
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
        x: currentIndex * imageWidth, // Adjust scroll position
        animated: true,
      });
    }
  }, [currentIndex, imageWidth]);

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
      <View style={styles.backgroundContainer}>
        <View style={styles.topHalf} />
        <View style={styles.bottomHalf} />
      </View>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    height: 250, // Adjusted height to accommodate the images
    overflow: 'hidden', // Ensures the content does not overflow the container
  },
  backgroundContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  topHalf: {
    backgroundColor: '#FFFFFF',
    height: '50%', // Top half
  },
  bottomHalf: {
    backgroundColor: colors.main,
    height: '50%', // Bottom half
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
});

export default AutoImageSlider2;
