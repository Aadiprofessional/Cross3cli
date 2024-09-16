import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Swipeable as ReanimatedSwipeable } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useWishlist } from '../components/WishlistContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../styles/color';
const WishlistScreen = ({ navigation }) => {
  const { wishlist, removeFromWishlist } = useWishlist();

  // Navigate to the product detail page
  const handlePress = (product) => {
    navigation.navigate('ProductDetailPage', {
      mainId: product.mainId,
      categoryId: product.categoryId,
      productId: product.productId,
      attribute1D: product.attribute1,
      attribute2D: product.attribute2,
      attribute3D: product.attribute3,
    });
  };

  // Function to render the delete action when swiping
  const renderRightActions = (product) => (
    <RectButton
      style={styles.deleteButton}
      onPress={() => removeFromWishlist(product)}
    >
      <Text style={styles.deleteButtonText}>Delete</Text>
    </RectButton>
  );

  const renderItem = ({ item }) => (
    <ReanimatedSwipeable
      renderRightActions={() => renderRightActions(item)}
      onSwipeableRightOpen={() => removeFromWishlist(item)}
    >
      <TouchableOpacity
        style={styles.wishlistItem}
        onPress={() => handlePress(item)}
      >
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.details}>
          <Text style={styles.productName}>{item.productName}</Text>
          <Text style={styles.price}>
            {Number(item.price).toLocaleString('en-IN', {
              maximumFractionDigits: 0,
              style: 'currency',
              currency: 'INR',
            })}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.heartIconContainer}
          onPress={() => removeFromWishlist(item)}
        >
          <Icon
            name='favorite'
            size={24}
            color='red'
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </ReanimatedSwipeable>
  );

  return (
    <FlatList
      data={wishlist}
      keyExtractor={(item) => item.productId.toString()}
      renderItem={renderItem}
      ListEmptyComponent={<Text style={styles.emptyText}>Your wishlist is empty.</Text>}
    />
  );
};

const styles = StyleSheet.create({
  wishlistItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
    fontFamily: 'Outfit-Medium',
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  details: {
    marginLeft: 10,
    justifyContent: 'center',
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.TextBlack,
    fontFamily: 'Outfit-Medium',
  },
  price: {
    color: 'green',
    marginTop: 5,
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Outfit-Medium',
    backgroundColor: 'red',
    width: 80,
    height: '100%',
  },
  deleteButtonText: {
    color: '#fff',
    fontFamily: 'Outfit-Medium',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'Outfit-Medium',
    fontSize: 16,
  },
  heartIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default WishlistScreen;
