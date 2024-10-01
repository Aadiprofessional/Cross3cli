import React, { useState } from 'react';
import { View, Image, ActivityIndicator, StyleSheet, Text } from 'react-native';
import YoutubeIframe from 'react-native-youtube-iframe';
import ViewPager from '@react-native-community/viewpager';
import { colors } from '../../styles/color';

const ImageCarousel = ({ images, loading, lowestPrice }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const getVideoIdFromUrl = (url) => {
    const regex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const renderMedia = (item, index) => {
    if (item?.startsWith('https://www.youtube.com')) {
      const videoId = getVideoIdFromUrl(item);
      if (videoId) {
        return (
          <View style={styles.videoContainer} key={index}>
            <YoutubeIframe
              height={200}
              play={isPlaying && currentIndex === index}
              videoId={videoId}
              style={styles.youtubeIframe}
            />
          </View>
        );
      }
    }
    return <Image source={{ uri: item }} style={styles.image} key={index} />;
  };

  const handlePageSelected = (event) => {
    const index = event.nativeEvent.position;
    setCurrentIndex(index);
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 100); // Smooth transition
  };

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index && styles.activeDot, // Apply active style to the current dot
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ViewPager
        style={{ flex: 1 }}
        initialPage={0}
        onPageSelected={handlePageSelected}
      >
        {images.map((item, index) => (
          <View key={index}>{renderMedia(item, index)}</View>
        ))}
      </ViewPager>
      {loading && (
        <ActivityIndicator
          size="Medium"
          color={colors.primary}
          style={styles.imageLoader}
        />
      )}
      {lowestPrice && (
        <View style={styles.lowestPriceLabel}>
          <Text style={styles.lowestPriceText}>Highest Discount</Text>
        </View>
      )}
      {renderDots()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 20,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#B3B3B39D',
  },
  image: {
    width: '85%',
    height: '85%',
    resizeMode: 'contain',
    alignSelf: 'center',
    margin: '5%',
  },
  videoContainer: {
    marginTop: 70,
  },
  youtubeIframe: {
    width: '90%',
    height: '90%',
  },
  lowestPriceLabel: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: colors.second,
    padding: 5,
    borderRadius: 5,
    zIndex: 100,
  },
  lowestPriceText: {
    color: 'white',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 10,
    width: '100%',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 30,
    backgroundColor: '#323F4757',
    marginHorizontal: 2,
  },
  activeDot: {
    backgroundColor: colors.second,
    width: 15, // Make the active dot wider for emphasis
    height:10,
    borderRadius: 8,
  },
});

export default ImageCarousel;
