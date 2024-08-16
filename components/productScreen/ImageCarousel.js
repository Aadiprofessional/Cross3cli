import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Text,
} from 'react-native';
import { colors } from '../../styles/color';

const ImageCarousel = ({ images, onPrevious, onNext, imageIndex, loading, colorDeliveryTime }) => {
  return (
    <View style={styles.imageContainer}>
      {images.length > 0 && (
        <Image
          source={{ uri: images[imageIndex] }}
          style={styles.image}
        />
      )}
      {loading && (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={styles.imageLoader}
        />
      )}
      <TouchableOpacity
        style={[styles.arrowButton, { left: 10 }]}
        onPress={onPrevious}
      >
        <Text style={styles.arrowText}>{'<'}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.arrowButton, { right: 10 }]}
        onPress={onNext}
      >
        <Text style={styles.arrowText}>{'>'}</Text>
      </TouchableOpacity>
      <View style={styles.pagination}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, index === imageIndex && styles.activeDot]}
          />
        ))}
      </View>
      <View style={styles.truckIcon}>
        <Image
          source={require('../../assets/truck.png')}
          style={styles.truckImage}
        />
      </View>
      <View style={styles.truckTextContainer}>
        <Text style={styles.truckText}>{colorDeliveryTime} Days</Text>
      </View>
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
    fontFamily: 'Outfit-Bold',
  },
  pagination: {
    position: 'absolute',
    bottom: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 5,
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
  truckTextContainer: {
    position: 'absolute',
    top: 15,
    left: 50,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  truckText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Outfit-Bold',
  },
  truckIcon: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: colors.second,
    borderRadius: 20,
    padding: 10,
    zIndex: 1000,
  },
  truckImage: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
});

export default ImageCarousel;
