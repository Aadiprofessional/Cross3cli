import React, { useState, useCallback } from 'react';
import {
  View,
  Image,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Swiper from 'react-native-swiper';
import YoutubeIframe from 'react-native-youtube-iframe';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../../styles/color';

const { width } = Dimensions.get('window'); // Get the device width for responsive swiper

const ImageCarousel = ({ images, loading }) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Function to extract YouTube video ID from URL
  const getVideoIdFromUrl = url => {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  useFocusEffect(
    useCallback(() => {
      // When the screen is focused, set video to play
      setIsVideoPlaying(true);

      // Cleanup when leaving the screen, pause the video
      return () => setIsVideoPlaying(false);
    }, [])
  );

  const renderMedia = source => {
    const videoId = getVideoIdFromUrl(source);
    if (videoId) {
      return (
        <View style={styles.videoContainer}>
          <YoutubeIframe
            height={200} // Set the height you need
            play={isVideoPlaying} // Use state to control play
            videoId={videoId}
            style={styles.youtubeIframe}
            webViewProps={{
              javaScriptEnabled: true,
              domStorageEnabled: true,
              allowsInlineMediaPlayback: true,
            }}
            onChangeState={event => {
              if (event === 'ended') {
                setIsVideoPlaying(false);
              }
            }}
            videoParams={{
              modestbranding: 1,
              showinfo: 0,
              controls: 0,
              rel: 0,
            }}
          />
        </View>
      );
    }

    // Return the image if it's not a video link
    return <Image source={{ uri: source }} style={styles.image} />;
  };

  return (
    <View style={styles.imageContainer}>
      {loading && (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={styles.imageLoader}
        />
      )}

      <Swiper
        showsPagination={true}
        loop={false}
        autoplay={false} // Autoplay can be enabled if needed
        activeDotColor={colors.main}
        dotStyle={styles.dot}
        activeDotStyle={styles.activeDot}
        containerStyle={styles.swiperContainer}
      >
        {images.map((source, index) => (
          <View key={index} style={styles.slide}>
            {renderMedia(source)}
          </View>
        ))}
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
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
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  videoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  youtubeIframe: {
    width: '90%',
    height: 200,
  },
  swiperContainer: {
    height: 250,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    backgroundColor: '#A7A7A7',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    backgroundColor: '#316487',
    width: 16,
  },
});

export default ImageCarousel;
