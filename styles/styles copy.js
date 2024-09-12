import { StyleSheet } from 'react-native';
import { colors } from '../styles/color';
import { sizes } from './size';

const styles2 = StyleSheet.create({
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
    textAlign: 'left',
  },
  productList: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productWrapper: {
    width: 180,
    marginRight: 10,
  },
  productContainer: {
    width: 180, // Set fixed width for consistency
    height: 300, // Set fixed height for consistency
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
    position: 'relative', // Enable absolute positioning for child elements
  },
  productContent: {
    flex: 1,
    padding: 10,
    alignItems: 'flex-start',
  },
  imageContainer: {
    width: '100%',
    height: 150,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  productName: {
    fontSize: 12,
    color: colors.TextBlack,
    fontFamily: 'Outfit-Bold',
    textAlign: 'left',
    marginVertical: 5,
    paddingHorizontal: 10,
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
    marginLeft: 4,
  },
  hotDealsContainer: {
    alignItems: 'center',
  },
  actionButtonContainer: {
    position: 'absolute',
    bottom: 10,
    left: 4,
    right: 10,
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
  },
  addToCartText: {
    color: '#333',
    fontFamily: 'Outfit-Medium',
    fontSize: 12,
  },
  productDetailButton: {
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    marginLeft: 10,

  },
  productDetailText: {
    color: '#333',
    fontFamily: 'Outfit-Medium',
    fontSize: 12,
  },
  lowestPriceLabel: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: colors.second,
    padding: 5,
    borderRadius: 5,
  },
  lowestPriceText: {
    color: 'white',
    fontFamily: 'Outfit-Medium',
  },
  outOfStockText: {
    position: 'absolute',
    top: 4,
    left: -1,
    color: 'red',
    fontFamily: 'Outfit-Bold',
  },
});

export default styles2;
