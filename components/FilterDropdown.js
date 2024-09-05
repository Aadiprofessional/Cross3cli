import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Slider from '@react-native-community/slider'; // Updated import
import { colors } from '../styles/color'; // Adjust path as needed

const FilterDropdown = ({ open, setOpen, setFilterOptions, applyFilters }) => {
  const [priceRange, setPriceRange] = useState([0, 9999999]);
  const [category, setCategory] = useState(null);
  const [discount, setDiscount] = useState(null);
  const [excludeOutOfStock, setExcludeOutOfStock] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const priceRanges = [
    { label: 'Below ₹500', value: 'below_500' },
    { label: '₹500 - ₹1000', value: '500_1000' },
    { label: 'Above ₹1000', value: 'above_1000' },
  ];

  const categories = [
    { label: 'Electronics', value: 'electronics' },
    { label: 'Clothing', value: 'clothing' },
    { label: 'Home Appliances', value: 'home_appliances' },
  ];

  const discounts = [
    { label: '10% and above', value: '10_above' },
    { label: '20% and above', value: '20_above' },
    { label: '30% and above', value: '30_above' },
  ];

  const handlePriceRangeChange = (value) => {
    setPriceRange(value);
    setSelectedFilters((prev) => [...prev, `Price: ₹${value[0]} - ₹${value[1]}`]);
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
    setSelectedFilters((prev) => [...prev, `Category: ${categories.find(cat => cat.value === value)?.label}`]);
  };

  const handleDiscountChange = (value) => {
    setDiscount(value);
    setSelectedFilters((prev) => [...prev, `Discount: ${discounts.find(disc => disc.value === value)?.label}`]);
  };

  const handleExcludeOutOfStockChange = () => {
    setExcludeOutOfStock(prev => !prev);
    setSelectedFilters((prev) => [...prev, 'Exclude Out of Stock']);
  };

  const removeFilter = (filter) => {
    setSelectedFilters((prev) => prev.filter(f => f !== filter));
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
          <Text style={styles.priceLabel}>Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={9999999}
            step={100}
            value={priceRange}
            onValueChange={handlePriceRangeChange}
            minimumTrackTintColor={colors.main}
            maximumTrackTintColor="#d3d3d3"
          />
        </View>

        <DropDownPicker
          open={open}
          value={category}
          items={categories}
          setOpen={setOpen}
          setValue={handleCategoryChange}
          placeholder="Category"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
        />

        <DropDownPicker
          open={open}
          value={discount}
          items={discounts}
          setOpen={setOpen}
          setValue={handleDiscountChange}
          placeholder="Discount"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
        />

        <View style={styles.excludeContainer}>
          <TouchableOpacity onPress={handleExcludeOutOfStockChange} style={styles.checkboxContainer}>
            <View style={[styles.checkbox, excludeOutOfStock && styles.checkboxChecked]} />
            <Text style={styles.excludeText}>Exclude Out of Stock</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => applyFilters({ priceRange, category, discount, excludeOutOfStock })} style={styles.applyButton}>
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
  dropdown: {
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  scrollView: {
    maxHeight: 400,
  },
  priceContainer: {
    marginBottom: 10,
  },
  priceLabel: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 5,
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
  },
  checkboxChecked: {
    backgroundColor: colors.main,
  },
  excludeText: {
    fontSize: 16,
    color: colors.text,
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
    backgroundColor: colors.tagBackground,
    borderRadius: 15,
    padding: 5,
    margin: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterText: {
    fontSize: 14,
    color: colors.text,
  },
  removeFilterButton: {
    marginLeft: 10,
  },
  removeFilterText: {
    fontSize: 16,
    color: colors.remove,
  },
});

export default FilterDropdown;
