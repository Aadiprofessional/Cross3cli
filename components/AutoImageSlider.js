import React, { useState, useEffect, useRef } from 'react';
import { View, Image, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { sizes } from '../styles/size';
import { colors } from '../styles/color';
import styles from '../styles/styles';

const AutoImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [images, setImages] = useState([]);
  const sliderWidth = Dimensions.get('window').width;
  const imageWidth = sliderWidth;
  const sideImageWidth = 0;
  const scrollRef = useRef();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('https://crossbee-server.vercel.app/banners/upper');
        const data = await response.json();
        const imagesWithDuplicates = [
          data[data.length - 1],
          ...data,
          data[0],
        ];
        setImages(imagesWithDuplicates);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((current) => (current === images.length - 2 ? 1 : current + 1));
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

  const handleScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.floor(contentOffset / slideSize);

    if (index === 0) {
      setCurrentIndex(images.length - 2);
    } else if (index === images.length - 1) {
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
        style={{ width: sliderWidth }}
        contentContainerStyle={styles.scrollViewContent}
        ref={scrollRef}
      >
        {images.map((image, index) => (
          <View
            key={index}
            style={[styles.imageContainerAutoImageSlider, { width: imageWidth }]}
          >
            <Image
              source={{ uri: image }}
              style={styles.imageAutoImageSlider}
              resizeMode="cover"
            />
          </View>
        ))}
      </ScrollView>
      <View style={styles.pagination}>
        {images.slice(1, images.length - 1).map((_, index) => (
          <View
            key={index}
            style={[
              styles.dotAutoImageSlider,
              index === currentIndex - 1 && styles.activeDotAutoImageSlider,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default AutoImageSlider;
