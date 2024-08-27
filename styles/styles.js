import {StyleSheet} from 'react-native';
import {colors} from '../styles/color';
import {sizes} from './size';

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    paddingVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Outfit-Medium',
    marginBottom: 10,
    marginLeft: 10,
    color: colors.TextBlack,
  },
  productList: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productWrapper: {
    width: 180, // Adjust width to control the size of the product container
    marginRight: 10, // Space between product containers
  },
  productContainer: {
    width: '100%',
    aspectRatio: 1, // Ensure a square aspect ratio
    backgroundColor: colors.primary,
    borderRadius: 10,
    overflow: 'hidden', // Ensure contents don't overflow the rounded corners
  },
  productContent: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 2,
    alignItems: 'center',
    borderWidth: 1,
  },
  imageContainer: {
    width: '100%',
    height: '70%', // 60% of the productContent height
    aspectRatio: 1, // Ensure a square aspect ratio for the image container
    marginBottom: 1,
    marginTop: 3,
    alignItems: 'center',
  },
  imageBox: {
    width: '130%', // Adjust as needed for the size of the white box
    height: '100%', // Take full height of the image container
    backgroundColor: 'white',
    borderRadius: 5,
    overflow: 'hidden',
    alignItems: 'center', // Center the image inside the white box
    justifyContent: 'center', // Center the image inside the white box
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain', // Ensure image fits inside without cropping
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold', // Bold font for product name
    color: colors.TextBlack,
    fontFamily: 'Outfit-Bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontFamily: 'Outfit-Bold',
    color: colors.TextBlack,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  //Auto Image Slider
  containerImageSlider: {
    position: 'relative',
    width: '100%',
    height: 250,
    backgroundColor: colors.main,
    justifyContent: 'center', // Center the image vertically
    alignItems: 'center', // Center the image horizontally
    overflow: 'hidden',
  },
  scrollViewContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainerAutoImageSlider: {
    width: '100%', // Adjust the width to make the image smaller
    height: '80%', // Adjust the height proportionally
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center', // Ensure the image is centered
    alignItems: 'center', // Ensure the image is centered
  },
  imageAutoImageSlider: {
    width: '95%',
    height: '100%',
    borderRadius: 10,
  },
  pagination: {
    position: 'absolute',
    bottom: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 5,
  },
  dotAutoImageSlider: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    marginHorizontal: sizes.marginVertical,
  },
  activeDotAutoImageSlider: {
    width: 16,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#316487',
  },
});

export default styles;
