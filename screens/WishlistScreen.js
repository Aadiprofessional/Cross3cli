import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Swipeable as ReanimatedSwipeable } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useWishlist } from '../components/WishlistContext';
import { useCart } from '../components/CartContext';  // Assuming you have a CartContext for cart operations
import { colors } from '../styles/color';

const WishlistScreen = ({ navigation }) => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart(); // Access addToCart from CartContext

  const handlePress = (product) => {
    navigation.navigate('ProductDetailPage', {
      mainId: product.mainId,
   
      productId: product.productId,
      attribute1D: product.attribute1,
      attribute2D: product.attribute2,
      attribute3D: product.attribute3,
    });
  };

  const renderItem = ({ item }) => {
    const discountPercentage = item.additionalDiscount;
    const cutPrice = (item.price * (1 - discountPercentage / 100)).toFixed(0);

    const handleAddToCart = (product) => {
      if (!product.outOfStock && product && product.minCartValue > 0) {
        const cartItem = {
          productName: product.product,
          productId: product.productId,
          price: product.price,
          quantity: product.minCartValue,
          image: product.image,
          bag: product.bag,
          colorminCartValue: product.minCartValue,
          attributeSelected1: product.attribute1,
          attributeSelected2: product.attribute2,
          attributeSelected3: product.attribute3,
          additionalDiscount: product.additionalDiscount || 0,
          mainId: product.mainId,
          discountedPrice: cutPrice,
    
          colormaxCartValue: product.inventory,
        };

        addToCart(cartItem); // Add product to cart
        console.log('Adding to cart:', cartItem);
      }
    };

    const renderRightActions = (product) => (
      <RectButton
        style={styles.deleteButton}
        onPress={() => removeFromWishlist(product)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </RectButton>
    );

    return (
      <ReanimatedSwipeable
        renderRightActions={() => renderRightActions(item)}
        onSwipeableRightOpen={() => removeFromWishlist(item)}
      >
        <TouchableOpacity style={styles.wishlistItem} onPress={() => handlePress(item)}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <View style={styles.details}>
            <Text style={styles.productName}>{item.displayName}</Text>

            <Text style={styles.cutPrice}>
              {Number(item.price).toLocaleString('en-IN', {
                maximumFractionDigits: 0,
                style: 'currency',
                currency: 'INR',
              })}
            </Text>

            <Text style={styles.discountedPrice}>
              {Number(cutPrice).toLocaleString('en-IN', {
                maximumFractionDigits: 0,
                style: 'currency',
                currency: 'INR',
              })}
            </Text>

            {/* Conditional Add to Cart or Out of Stock */}
            {item.outOfStock ? (
              <View style={styles.outOfStockButton}>
                <Text style={styles.outOfStockText}>Out of Stock</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.addToCartButton}
                onPress={() => handleAddToCart(item)}
              >
                <Icon name="shopping-cart" size={20} color="white" />
                <Text style={styles.addToCartText}>Add to Cart</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Remove from Wishlist icon */}
          <TouchableOpacity
            style={styles.heartIconContainer}
            onPress={() => removeFromWishlist(item)}
          >
            <Icon name="favorite" size={24} color="red" />
          </TouchableOpacity>
        </TouchableOpacity>
      </ReanimatedSwipeable>
    );
  };

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
  cutPrice: {
    color: 'gray',
    textDecorationLine: 'line-through',
    fontSize: 14,
    fontFamily: 'Outfit-Medium',
    marginTop: 5,
  },
  discountedPrice: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    marginTop: 5,
  },
  addToCartButton: {
    flexDirection: 'row',
    backgroundColor: colors.main,
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  addToCartText: {
    color: 'white',
    marginLeft: 5,
    fontFamily: 'Outfit-Medium',
  },
  outOfStockButton: {
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  outOfStockText: {
    color: 'red',
    fontFamily: 'Outfit-Bold',
    fontSize: 12,
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    width: 80,
    height: '100%',
  },
  deleteButtonText: {
    color: '#fff',
    fontFamily: 'Outfit-Medium',
    fontWeight: 'bold',
  },
  heartIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'Outfit-Medium',
    color: 'gray',
    fontSize: 16,
  },
});

export default WishlistScreen;
