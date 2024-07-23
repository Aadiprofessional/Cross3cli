import React, {useState, useEffect, useRef} from 'react';
import {View, Image, StyleSheet, ScrollView, Dimensions} from 'react-native';
import {sizes} from '../styles/size';
import {colors} from '../styles/color';

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
            style={[styles.dot, index === currentIndex - 1 && styles.activeDot]}
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
    height: 250,

    backgroundColor: colors.main,
    overflow: 'hidden',
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
    bottom: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 5,
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
