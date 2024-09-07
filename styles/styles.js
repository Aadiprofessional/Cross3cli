import {StyleSheet} from 'react-native';
import {colors} from '../styles/color';
import {sizes} from './size';

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 5,
    backgroundColor: '#fff',
    paddingVertical: 10,
  },
  title: {
    fontSize: 20,

    fontFamily: 'Outfit-Medium',
    marginBottom: 10,
    marginLeft: 10,
    color: colors.TextBlack,
    textAlign: 'left', // Align title text to the left
  },
  productList: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productWrapper: {
    width: 180, // Adjust width to control the size of the product container
    marginRight: 10, // Space between product containers
  },
  productImage: {
    width: 100, // Set your desired width
    height: 100, // Set your desired height
  },
  productContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden', // Ensure contents don't overflow the rounded corners
    borderWidth: 1, // Add border width
    borderColor: '#ddd', // Border color
  },
  productList2: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 8, // Adjust horizontal padding for equal margins
  },
 productContainer2: {
  width: '48%', // Ensures two products per row with space in between
  marginBottom: 16, // Space between rows
  marginLeft: '1%', // Space on the left of each product
  marginRight: '1%', // Space on the right of each product
  backgroundColor: '#fff',
  borderRadius: 10,
  padding: 10,
  borderWidth: 1,
  borderColor: '#ECECEC',
},
  productContent: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10, // Add padding for better spacing
    alignItems: 'flex-start', // Align items to the left
  },

  outOfStockText: {color: '#FF0000', fontFamily: 'Outfit-Medium', fontSize: 14},

  imageContainer: {
    width: '100%',
    height: 100, // Adjust height for the image
    alignItems: 'center',
    borderBottomWidth: 1, // Add border to the bottom of the image container
    borderBottomColor: '#ddd', // Border color
  },
  imageBox: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain', // Ensure image fits inside without stretching
  },
  productName: {
    fontSize: 12,

    color: colors.TextBlack,
    fontFamily: 'Outfit-Bold',
    textAlign: 'left',
    marginVertical: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  wishlistIcon: {
    marginLeft: 'auto', // Push the icon to the right end
  },
  discountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  discountText: {
    fontSize: 10,
    color: 'green',

    marginRight: 5,
    fontFamily: 'Outfit-Bold',
  },
  cutPriceText: {
    fontSize: 10,
    textDecorationLine: 'line-through',
    color: colors.TextBlack,
    fontFamily: 'Outfit-Medium',
    marginRight: 5,
  },
  originalPriceText: {
    fontSize: 15,
    color: colors.TextBlack,
    fontFamily: 'Outfit-Bold',
  },

  hotDealsContainer: {
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  hotDealsText: {
    fontSize: 8,
    color: '#333',
  },
  actionButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  addToCartButton: {
    backgroundColor: '#FCCC51',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginLeft: -9,
  },
  addToCartText: {
    color: '#333',
    fontFamily: 'Outfit-Medium',
    fontSize: 12,
  },
  productDetailButton: {
    borderColor: '#333', // Use borderColor instead of border for correct application
    borderWidth: 1, // Ensure border width is set for visibility
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginLeft: 15,
    backgroundColor: '#fff', // Example background color
    color: '#333', // Example text color, if you are using text-based components
  },
  productDetailText: {
    color: '#333',
    fontFamily: 'Outfit-Medium',
    fontSize: 12,
  },
  addToCartButton2: {
    backgroundColor: '#FCCC51',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginLeft: -14,
  },
  addToCartText2: {
    color: '#333',
    fontFamily: 'Outfit-Medium',
    fontSize: 12,
  },
  productDetailButton2: {
    borderColor: '#333', // Use borderColor instead of border for correct application
    borderWidth: 1, // Ensure border width is set for visibility
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginLeft: 5,
    backgroundColor: '#fff', // Example background color
    color: '#333', // Example text color, if you are using text-based components
  },
  productDetailText2: {
    color: '#333',
    fontFamily: 'Outfit-Medium',
    fontSize:8,
  },
  addToCartButton3: {
    backgroundColor: '#FCCC51',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginLeft: -14,
  },
  addToCartText3: {
    color: '#333',
    fontFamily: 'Outfit-Medium',
    fontSize: 8,
  },
  productDetailButton3: {
    borderColor: '#333', // Use borderColor instead of border for correct application
    borderWidth: 1, // Ensure border width is set for visibility
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginLeft: 5,
    backgroundColor: '#fff', // Example background color
    color: '#333', // Example text color, if you are using text-based components
  },
  productDetailText3: {
    color: '#333',
    fontFamily: 'Outfit-Medium',
    fontSize: 12,
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
