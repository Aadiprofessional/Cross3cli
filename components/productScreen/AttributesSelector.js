import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../styles/color'; // Adjust the path accordingly

const AttributesSelector = ({ attributeData, selectedValue, onSelect, attributeName }) => {
  return (
    <View style={styles.productDetails}>
      <Text style={styles.Head}>{attributeName}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.colorScrollContainer}>
          {attributeData.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.colorButton,
                selectedValue === item.id && styles.selectedButton,
              ]}
              onPress={() => onSelect(item.id)}>
              <Text
                style={[
                  styles.colorButtonText,
                  selectedValue === item.id && styles.selectedText,
                ]}>
                {item.value}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  productDetails: {
    width: '90%',
    marginTop: 1,
  },
  Head: {
    fontSize: 20,
    color: colors.TextBlack,
    fontWeight: 'bold',
    fontFamily: 'Outfit-Bold',
  },
  colorScrollContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  colorButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.main,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  selectedButton: {
    backgroundColor: colors.main,
    borderWidth: 1,
    borderColor: colors.main,
  },
  colorButtonText: {
    fontSize: 16,
    fontFamily: 'Outfit-Bold',
    color: colors.main,
    fontWeight: 'bold',
  },
  selectedText: {
    color: '#fff',
  },
});

export default AttributesSelector;
