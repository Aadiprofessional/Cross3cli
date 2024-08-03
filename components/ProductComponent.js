import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../styles/color';

const ProductComponent = ({
  id,
  productName,
  imageSource,
  price,
  categoryId,
  mainId,
}) => {
  const navigation = useNavigation();

  const handlePress = () => {
    console.log(`Navigating to ProductDetailPage with productId: ${id}`);
    navigation.navigate('ProductDetailPage', {
      mainId,
      categoryId,
      productId: id,
    });
  };

  return (
    <TouchableOpacity style={styles.productContainer} onPress={handlePress}>
      <View style={[styles.productContent, {borderColor: colors.primary}]}>
        <View style={styles.imageContainer}>
          <View style={styles.imageBox}>
            <Image source={{uri: imageSource}} style={styles.productImage} />
          </View>
        </View>
        <Text style={styles.productName} numberOfLines={1}>
          {productName}
        </Text>
        <Text style={styles.productPrice}>₹{price}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productContainer: {
    width: '48%',
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DCDCDC',
    elevation: 3,
    overflow: 'hidden',
  },
  productContent: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 10,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageBox: {
    width: '100%',
    height: 150,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#484848',
  },
  productPrice: {
    fontSize: 14,
    color: '#484848',
  },
});

export default ProductComponent;
