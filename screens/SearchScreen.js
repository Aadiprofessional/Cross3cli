import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DropDownPicker from 'react-native-dropdown-picker';
import { colors } from '../styles/color';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

const ProductComponent = ({ productName, imageSource, description, price }) => {
  const navigation = useNavigation(); // Access navigation object

  const navigateToProductDetail = () => {
    navigation.navigate('ProductDetailPage', {
      productName: productName, // Pass productName to ProductDetailPage
      imageSource: imageSource,
      description: description,
      price: price,
    });
  };

  return (
    <TouchableOpacity style={styles.productContainer} onPress={navigateToProductDetail}>
      <View style={styles.productContent}>
        <View style={styles.productImageContainer}>
          <View style={styles.productImage}>
            {/* Replace 'product.png' with actual image source */}
            <Icon name={imageSource} size={40} color="#484848" />
          </View>
        </View>
        <Text style={styles.productDescription} numberOfLines={2}>
          {description}
        </Text>
        <Text style={styles.productPrice}>{price}</Text>
      </View>
    </TouchableOpacity>
  );
};

const SearchScreen = () => {
  const [openSort, setOpenSort] = useState(false);
  const [sortValue, setSortValue] = useState(null);
  const [sortItems, setSortItems] = useState([
    { label: 'Low to High', value: 'low_to_high' },
    { label: 'High to Low', value: 'high_to_low' },
    { label: 'Newest', value: 'newest' },
  ]);

  const [openFilter, setOpenFilter] = useState(false);
  const [filterValue, setFilterValue] = useState(null);
  const [filterItems, setFilterItems] = useState([
    { label: 'Category 1', value: 'category1' },
    { label: 'Category 2', value: 'category2' },
    { label: 'Category 3', value: 'category3' },
  ]);

  // Dummy product data for demonstration
  const products = [
    { id: 1, productName: 'Product 1', imageSource: 'product.png', description: 'Product 1 Description', price: '$100' },
    { id: 2, productName: 'Product 2', imageSource: 'product.png', description: 'Product 2 Description', price: '$150' },
    { id: 3, productName: 'Product 3', imageSource: 'product.png', description: 'Product 3 Description', price: '$200' },
    // Add more products as needed
  ];

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Icon name="search" size={20} color={styles.icon.color} style={styles.icon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search your products"
          placeholderTextColor="#484848"
          cursorColor={styles.searchCursor.color}
        />
      </View>
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonWrapper}>
          <DropDownPicker
            open={openSort}
            value={sortValue}
            items={sortItems}
            setOpen={setOpenSort}
            setValue={setSortValue}
            setItems={setSortItems}
            placeholder="Sort By"
            style={styles.smallButton}
            dropDownContainerStyle={styles.smallDropDownContainer}
            textStyle={styles.buttonText}
            ArrowDownIconComponent={({ style }) => (
              <Icon name="chevron-down" size={16} color="#484848" style={style} />
            )}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <DropDownPicker
            open={openFilter}
            value={filterValue}
            items={filterItems}
            setOpen={setOpenFilter}
            setValue={setFilterValue}
            setItems={setFilterItems}
            placeholder="Filter"
            style={styles.smallButton}
            dropDownContainerStyle={styles.smallDropDownContainer}
            textStyle={styles.buttonText}
            ArrowDownIconComponent={({ style }) => (
              <Icon name="chevron-down" size={16} color="#484848" style={style} />
            )}
          />
        </View>
        <View style={[styles.buttonWrapper, styles.electronicsButtonWrapper]}>
          <TouchableOpacity style={styles.electronicsButton}>
            <Text style={styles.electronicsButtonText}>Electronics</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Product list */}
      <View style={styles.productList}>
        {products.map(product => (
          <ProductComponent
            key={product.id}
            productName={product.productName} // Pass productName to ProductComponent
            imageSource={product.imageSource}
            description={product.description}
            price={product.price}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    marginBottom: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECECEC',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginBottom: 20,
  },
  icon: {
    color: '#484848',
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#484848',
    textAlign: 'left',
  },
  searchCursor: {
    flex: 1,
    fontSize: 16,
    color: colors.main,
    textAlign: 'left',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  buttonWrapper: {
    marginBottom: 10,
  },
  smallButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 5,
    width: 130,
  },
  smallDropDownContainer: {
    width: 120,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
  },
  buttonText: {
    fontSize: 14,
    color: '#484848',
    marginRight: 5,
  },
  electronicsButtonWrapper: {
    marginLeft: 'auto',
  },
  electronicsButton: {
    backgroundColor: colors.main,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 90,
    height: 50,
  },
  electronicsButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  productList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  productContainer: {
    width: '48%', // Adjust based on your requirement for two products per row
    marginBottom: 20,
  },
  productContent: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  productImageContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  productImage: {
    width: 40,
    height: 40,
    // Adjust styling for product image as needed
  },
  productDescription: {
    fontSize: 12,
    color: colors.black,
    textAlign: 'center',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    color: colors.black,
    textAlign: 'center',
  },
});

export default SearchScreen;
