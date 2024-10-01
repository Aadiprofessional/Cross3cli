import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import axios from 'axios';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../styles/color'; // Adjust path as needed

const FilterDropdown = ({ filterOptions, applyFilters }) => {
  const [minPrice, setMinPrice] = useState(filterOptions.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(filterOptions.maxPrice || '');
  const [category, setCategory] = useState(filterOptions.category || null);
  const [discount, setDiscount] = useState(filterOptions.discount || null);
  const [brand, setBrand] = useState(filterOptions.brand || null);
  const [excludeOutOfStock, setExcludeOutOfStock] = useState(filterOptions.excludeOutOfStock || false);

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]); // State for brands
  const [selectedFilters, setSelectedFilters] = useState([]);

  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isDiscountModalVisible, setIsDiscountModalVisible] = useState(false);
  const [isBrandModalVisible, setIsBrandModalVisible] = useState(false); // State for brand modal

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://crossbee-server-1036279390366.asia-south1.run.app/drawer');
        const categoryData = response.data.map((cat) => ({
          label: cat.name,
          value: cat.id,
        }));
        setCategories(categoryData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchBrands = async () => {
      try {
        const response = await axios.get('https://crossbee-server-1036279390366.asia-south1.run.app/brands'); // Replace with your brands API URL
        const brandData = response.data.map((brand) => ({
          label: brand.name,
          value: brand.id,
        }));
        setBrands(brandData);
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };

    fetchCategories();
    fetchBrands();
  }, []);

  const discounts = [
    { label: '10% and above', value: '10_above' },
    { label: '20% and above', value: '20_above' },
    { label: '30% and above', value: '30_above' },
    { label: '40% and above', value: '40_above' },
    { label: '50% and above', value: '50_above' },
    { label: '60% and above', value: '60_above' },
    { label: '70% and above', value: '70_above' },
    { label: '80% and above', value: '80_above' },
    { label: '90% and above', value: '90_above' },
  ];

  const handleCategoryChange = (value) => {
    setCategory(value);
    setSelectedFilters(prev => prev.filter(f => !f.startsWith('Category:')).concat(`Category: ${categories.find(cat => cat.value === value)?.label}`));
    setIsCategoryModalVisible(false);
  };

  const handleBrandChange = (value) => { // Handle brand selection
    setBrand(value);
    setSelectedFilters(prev => prev.filter(f => !f.startsWith('Brand:')).concat(`Brand: ${brands.find(b => b.value === value)?.label}`));
    setIsBrandModalVisible(false);
  };

  const handleApplyFilters = () => {
    applyFilters({
      minPrice,
      maxPrice,
      category,
      discount,
      brand,
      excludeOutOfStock,
    });
  };

  const handleDiscountChange = (value) => {
    setDiscount(value);
    setSelectedFilters(prev => prev.filter(f => !f.startsWith('Discount:')).concat(`Discount: ${discounts.find(disc => disc.value === value)?.label}`));
    setIsDiscountModalVisible(false);
  };

  const handleExcludeOutOfStockChange = () => {
    setExcludeOutOfStock(prev => !prev);
    setSelectedFilters(prev => prev.includes('Exclude Out of Stock') ? prev.filter(f => f !== 'Exclude Out of Stock') : [...prev, 'Exclude Out of Stock']);
  };

  const handlePriceChange = (text, isMaxPrice) => {
    const cleanedText = text.replace(/[^0-9]/g, '');
    if (cleanedText.length <= 9) {
      if (isMaxPrice) {
        setMaxPrice(cleanedText);
      } else {
        setMinPrice(cleanedText);
      }
    }
  };

  const removeFilter = (filter) => {
    setSelectedFilters(prev => prev.filter(f => f !== filter));
  };

  return (
    <View style={styles.dropdownContainer}>
      <View style={styles.selectedFiltersContainer}>
        {selectedFilters.map((filter, index) => (
          <View key={index} style={styles.filterTag}>
            <Text style={styles.filterText}>{filter}</Text>
            <TouchableOpacity onPress={() => removeFilter(filter)} style={styles.removeFilterButton}>
              <Text style={styles.removeFilterText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Min and Max Price Input */}
        <View style={styles.priceInputContainer}>
          <Text style={styles.priceLabel}>Min Price:</Text>
          <TextInput
            style={styles.priceInput}
            keyboardType='numeric'
            value={minPrice}
            onChangeText={(text) => handlePriceChange(text, false)}
          />
        </View>
        <View style={styles.priceInputContainer}>
          <Text style={styles.priceLabel}>Max Price:</Text>
          <TextInput
            style={styles.priceInput}
            keyboardType='numeric'
            value={maxPrice}
            onChangeText={(text) => handlePriceChange(text, true)}
          />
        </View>

        {/* Category Dropdown */}
        <TouchableOpacity onPress={() => setIsCategoryModalVisible(true)} style={styles.dropdown}>
          <Text style={styles.priceLabel}>{category ? categories.find(cat => cat.value === category)?.label : "Select Category"}</Text>
        </TouchableOpacity>
        <Modal visible={isCategoryModalVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            {categories.map((cat) => (
              <TouchableOpacity key={cat.value} onPress={() => handleCategoryChange(cat.value)} style={styles.modalItem}>
                <Text style={styles.priceLabel}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setIsCategoryModalVisible(false)} style={styles.modalCloseButton}>
              <Text style={styles.priceLabel}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* Brand Dropdown */}
        <TouchableOpacity onPress={() => setIsBrandModalVisible(true)} style={styles.dropdown}>
          <Text style={styles.priceLabel}>{brand ? brands.find(b => b.value === brand)?.label : "Select Brand"}</Text>
        </TouchableOpacity>
        <Modal visible={isBrandModalVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            {brands.map((b) => (
              <TouchableOpacity key={b.value} onPress={() => handleBrandChange(b.value)} style={styles.modalItem}>
                <Text style={styles.priceLabel}>{b.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setIsBrandModalVisible(false)} style={styles.modalCloseButton}>
              <Text style={styles.priceLabel}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* Discount Dropdown */}
        <TouchableOpacity onPress={() => setIsDiscountModalVisible(true)} style={styles.dropdown}>
          <Text style={styles.priceLabel}>{discount ? discounts.find(disc => disc.value === discount)?.label : "Select Discount"}</Text>
        </TouchableOpacity>
        <Modal visible={isDiscountModalVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            {discounts.map((disc) => (
              <TouchableOpacity key={disc.value} onPress={() => handleDiscountChange(disc.value)} style={styles.modalItem}>
                <Text style={styles.priceLabel}>{disc.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setIsDiscountModalVisible(false)} style={styles.modalCloseButton}>
              <Text style={styles.priceLabel}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* Exclude Out of Stock Checkbox (optional) */}
        {/* <TouchableOpacity onPress={handleExcludeOutOfStockChange} style={styles.checkboxContainer}>
          <Text style={styles.priceLabel}>Exclude Out of Stock</Text>
          <MaterialCommunityIcons name={excludeOutOfStock ? "checkbox-marked" : "checkbox-blank-outline"} size={24} color={colors.black} />
        </TouchableOpacity> */}

        <TouchableOpacity onPress={handleApplyFilters} style={styles.applyButton}>
          <Text style={styles.applyButtonText}>Apply Filters</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};



const styles = StyleSheet.create({
  dropdownContainer: {
    borderRadius: 10,
    backgroundColor: colors.background,
    borderWidth: 0,
    padding: 10,
  },
  scrollView: {
    maxHeight: 400,
  },
  priceInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  priceLabel: {
    fontSize: 16,
    color: colors.TextBlack,
    fontFamily: 'Outfit-Medium',
    marginBottom: 5,
  },
  priceInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontFamily: 'Outfit-Medium',
    color: '#333',
    width: '45%',
  },
  excludeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.main,
  },
  excludeText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontFamily: 'Outfit-Medium',
  },
  applyButton: {
    backgroundColor: colors.main,
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
  },
  selectedFiltersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  
  },
  filterTag: {
    borderRadius: 15,
    padding: 5,
    margin: 5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.second,
  },
  filterText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginRight: 5,
    fontFamily: 'Outfit-Medium',
  },
  removeFilterButton: {
    backgroundColor: colors.danger,
    borderRadius: 10,
    padding: 2,
  },
  removeFilterText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Outfit-Medium',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    margin: 20,
  },
  modalItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalCloseButton: {
    padding: 10,
    backgroundColor: colors.main,
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default FilterDropdown;
