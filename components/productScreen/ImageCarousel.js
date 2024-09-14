import React, {useState} from 'react';
import {View, Image, ActivityIndicator, StyleSheet, Text} from 'react-native';
import YoutubeIframe from 'react-native-youtube-iframe';
import Swiper from 'react-native-swiper';
import {colors} from '../../styles/color';

const ImageCarousel = ({images, loading}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Function to extract YouTube video ID from URL
  const getVideoIdFromUrl = url => {
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
              webViewProps={{
                javaScriptEnabled: true,
                domStorageEnabled: true,
                allowsInlineMediaPlayback: true,
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
    }
    return <Image source={{uri: item}} style={styles.image} key={index} />;
  };

  const handleIndexChanged = index => {
    setCurrentIndex(index);
    setIsPlaying(false);
    setTimeout(() => {
      setIsPlaying(true); // Delay play to ensure smooth transition
    }, 100);
  };

  return (
    <View style={styles.imageContainer}>
      <Swiper
        loop={false}
        onIndexChanged={handleIndexChanged}
        showsPagination={true}
        dotStyle={styles.dot}
        activeDotStyle={styles.activeDot}
      >
        {images.map((item, index) => renderMedia(item, index))}
      </Swiper>
      {loading && (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={styles.imageLoader}
        />
      )}
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
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#A7A7A7',
    marginHorizontal: 5,
  },
  activeDot: {
    width: 16,
    backgroundColor: '#316487',
  },
});

export default ImageCarousel;
