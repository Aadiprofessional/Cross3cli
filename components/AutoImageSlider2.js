import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {colors} from '../styles/color';

const AutoImageSlider2 = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const sliderWidth = Dimensions.get('window').width;
  const imageWidth = sliderWidth;

  const scrollRef = useRef();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch(
        'https://crossbee-server-1036279390366.asia-south1.run.app/banners/middle',
      );
      const data = await response.json();
      setImages(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching images:', error);
      setLoading(false);
    }
  };

  const imagesWithDuplicates = [
    images[images.length - 1],
    ...images,
    images[0],
  ];

  useEffect(() => {
    if (images.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex(current =>
          current === images.length ? 1 : current + 1,
        );
      }, 9000);

      return () => clearInterval(interval);
    }
  }, [images.length]);

  useEffect(() => {
    if (scrollRef.current && images.length > 0) {
      scrollRef.current.scrollTo({
        x: currentIndex * imageWidth,
        animated: true,
      });
    }
  }, [currentIndex, imageWidth, images.length]);

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
      <View style={styles.backgroundContainer}>
        <View style={styles.topHalf} />
        <View style={styles.bottomHalf} />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color={colors.main} />
      ) : (
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
              <FastImage
                source={{uri: image}}
                style={styles.image}
                resizeMode={FastImage.resizeMode.cover}
              />
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    height: 250,
    backgroundColor: colors.main,
    justifyContent: 'center', // Center the image vertically
    alignItems: 'center', // Center the image horizontally
    overflow: 'hidden',
  },
  backgroundContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  topHalf: {
    backgroundColor: '#FFFFFF',
    height: '50%',
  },
  bottomHalf: {
    backgroundColor: colors.main,
    height: '50%',
  },
  scrollViewContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%', // Adjust the width to make the image smaller
    height: '80%', // Adjust the height proportionally
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center', // Ensure the image is centered
    alignItems: 'center', // Ensure the image is centered
  },
  image: {
    width: '95%',
    height: '100%',
    borderRadius: 10,
  },
});

export default AutoImageSlider2;
