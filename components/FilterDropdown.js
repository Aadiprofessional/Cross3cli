import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import DropDownPicker from 'react-native-dropdown-picker';
import { colors } from '../styles/color'; // Adjust path as needed
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Modal } from 'react-native';
import axios from 'axios';

const FilterDropdown = ({ filterOptions, applyFilters }) => {
  const [minPrice, setMinPrice] = useState(filterOptions.minPrice || 0);
  const [maxPrice, setMaxPrice] = useState(filterOptions.maxPrice || 9999999);
  const [category, setCategory] = useState(filterOptions.category || null);
  const [discount, setDiscount] = useState(filterOptions.discount || null);
  const [excludeOutOfStock, setExcludeOutOfStock] = useState(filterOptions.excludeOutOfStock || false);
 
  const [categories, setCategories] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);



  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isDiscountModalVisible, setIsDiscountModalVisible] = useState(false);
  useEffect(() => {
    // Fetch categories from the API
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

    fetchCategories();
  }, []);

  const discounts = [
    { label: '10% and above', value: '10_above' },
    { label: '20% and above', value: '20_above' },
    { label: '30% and above', value: '30_above' },
  ];

  const handleCategoryChange = (value) => {
    setCategory(value);
    setSelectedFilters(prev => prev.filter(f => !f.startsWith('Category:')).concat(`Category: ${categories.find(cat => cat.value === value)?.label}`));
    setIsCategoryModalVisible(false); // Close modal after selection
  };
  const handleApplyFilters = () => {
    applyFilters({
      minPrice,
      maxPrice,
      category,
      discount,
      excludeOutOfStock,
    });
  };
  const handleDiscountChange = (value) => {
    setDiscount(value);
    setSelectedFilters(prev => prev.filter(f => !f.startsWith('Discount:')).concat(`Discount: ${discounts.find(disc => disc.value === value)?.label}`));
    setIsDiscountModalVisible(false); // Close modal after selection
  };


  const handleMinPriceChange = (value) => {
    setMinPrice(value);
    setSelectedFilters(prev => prev.filter(f => !f.startsWith('Min Price:')).concat(`Min Price: ₹${value}`));
  };

  const handleMaxPriceChange = (value) => {
    setMaxPrice(value);
    setSelectedFilters(prev => prev.filter(f => !f.startsWith('Max Price:')).concat(`Max Price: ₹${value}`));
  };


  const handleExcludeOutOfStockChange = () => {
    setExcludeOutOfStock(prev => !prev);
    setSelectedFilters(prev => prev.includes('Exclude Out of Stock') ? prev.filter(f => f !== 'Exclude Out of Stock') : [...prev, 'Exclude Out of Stock']);
  };

  const removeFilter = (filter) => {
    setSelectedFilters(prev => prev.filter(f => f !== filter));
    // Additional logic to update the corresponding state
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
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Price Range: ₹{minPrice} - ₹{maxPrice}</Text>
          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={9999999}
              step={100}
              value={minPrice}
              onValueChange={handleMinPriceChange}
              minimumTrackTintColor={colors.main}
              maximumTrackTintColor="#d3d3d3"
            />
            <Slider
              style={styles.slider}
              minimumValue={minPrice}
              maximumValue={9999999}
              step={100}
              value={maxPrice}
              onValueChange={handleMaxPriceChange}
              minimumTrackTintColor={colors.main}
              maximumTrackTintColor="#d3d3d3"
            />
          </View>
        </View>


        {/* Category Dropdown */}
        <TouchableOpacity onPress={() => setIsCategoryModalVisible(true)} style={styles.dropdown}>
          <Text  style={styles.priceLabel}>{category ? categories.find(cat => cat.value === category)?.label : "Select Category"}</Text>
        </TouchableOpacity>
        <Modal visible={isCategoryModalVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            {categories.map((cat) => (
              <TouchableOpacity key={cat.value} onPress={() => handleCategoryChange(cat.value)} style={styles.modalItem}>
                <Text  style={styles.priceLabel}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setIsCategoryModalVisible(false)} style={styles.modalCloseButton}>
              <Text  style={styles.priceLabel}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* Discount Dropdown */}
        <TouchableOpacity onPress={() => setIsDiscountModalVisible(true)} style={styles.dropdown}>
          <Text  style={styles.priceLabel}>{discount ? discounts.find(disc => disc.value === discount)?.label : "Select Discount"}</Text>
        </TouchableOpacity>
        <Modal visible={isDiscountModalVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            {discounts.map((disc) => (
              <TouchableOpacity key={disc.value} onPress={() => handleDiscountChange(disc.value)} style={styles.modalItem}>
                <Text  style={styles.priceLabel}>{disc.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setIsDiscountModalVisible(false)} style={styles.modalCloseButton}>
              <Text  style={styles.priceLabel}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>


        <View style={styles.excludeContainer}>
          <TouchableOpacity onPress={handleExcludeOutOfStockChange} style={styles.checkboxContainer}>
            <View style={[styles.checkbox, excludeOutOfStock && styles.checkboxChecked]}>
              {excludeOutOfStock && <MaterialCommunityIcons name="check" size={16} color="white" />}
            </View>
            <Text style={styles.excludeText}>Exclude Out of Stock</Text>
          </TouchableOpacity>
        </View>

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

  dropdownList: {
    zIndex: 3000, // Ensure dropdown appears above
    elevation: 5, // For Android shadow effect
  },
  scrollView: {
    maxHeight: 400,
  },
  priceContainer: {
    marginBottom: 10,
  },
  priceLabel: {
    fontSize: 16,
    color: colors.TextBlack,
 
    fontFamily: 'Outfit-Medium',
    marginBottom: 5,
  },
  sliderContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalItem: {
    backgroundColor: 'white',
    padding: 10,
    marginVertical: 5,
    width: '80%',
    borderRadius: 5,
    alignItems: 'center',
  },
  modalCloseButton: {
    backgroundColor: '#ccc',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  slider: {
    width: '100%',
    height: 40,
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
  },
  filterText: {
    fontSize: 14,

    color: '#333',
    fontFamily: 'Outfit-Medium',
  },
  removeFilterButton: {
    marginLeft: 10,
  },
  removeFilterText: {
    fontSize: 16,
  
    color: '#333',
    fontFamily: 'Outfit-Medium',
  },
});

export default FilterDropdown;
