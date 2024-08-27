import React, {useState, useEffect, useRef} from 'react';
import {View, Image, StyleSheet, ScrollView, Dimensions} from 'react-native';
import {sizes} from '../styles/size';
import {colors} from '../styles/color';
import styles from '../styles/styles'; // Import the styles

const AutoImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const images = [
    require('../assets/banner.png'),
    require('../assets/banner.png'),
    require('../assets/banner.png'),
  ];

  const imagesWithDuplicates = [
    images[images.length - 1],
    ...images,
    images[0],
  ];

  const sliderWidth = Dimensions.get('window').width;
  const imageWidth = sliderWidth;
  const sideImageWidth = 0;

  const scrollRef = useRef();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(current => (current === images.length ? 1 : current + 1));
    }, 7000);
    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        x: currentIndex * (imageWidth + sideImageWidth * 2),
        animated: true,
      });
    }
  }, [currentIndex, imageWidth, sideImageWidth]);

  const handleScroll = event => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.floor(contentOffset / slideSize);

    if (index === 0) {
      setCurrentIndex(images.length);
    } else if (index === images.length + 1) {
      setCurrentIndex(1);
    } else {
      setCurrentIndex(index);
    }
  };

  return (
    <View style={styles.containerImageSlider}>
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
            style={[styles.imageContainerAutoImageSlider, {width: imageWidth}]}>
            <Image source={image} style={styles.imageAutoImageSlider} />
          </View>
        ))}
      </ScrollView>
      <View style={styles.pagination}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[styles.dotAutoImageSlider, index === currentIndex - 1 && styles.activeDotAutoImageSlider]}
          />
        ))}
      </View>
    </View>
  );
};



export default AutoImageSlider;
