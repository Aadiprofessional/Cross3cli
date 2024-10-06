import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {colors} from '../../styles/color'; // Adjust the path accordingly

const AttributesSelector = ({
  attributeData,
  selectedValue,
  onSelect,
  attributeName,
}) => {
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
    width: '100%',
    marginTop: 1,
  },
  Head: {
    fontSize: 20,
    color: colors.TextBlack,
    fontFamily: 'Outfit-Medium',
  },
  colorScrollContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  colorButton: {
    backgroundColor: '#F1F1F1',
    borderWidth: 1,
    borderColor: '#484848A1',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 5,
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    // Shadows for Android
    elevation: 4,
  },
  selectedButton: {
    backgroundColor: colors.main,
    borderWidth: 1,
    borderColor: colors.main,
    // Shadows for iOS
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    // Shadows for Android
    elevation: 4,
  },
  colorButtonText: {
    fontSize: 12,
    fontFamily: 'Outfit-Regular',
    color: '#4848485C',
    
  },
  selectedText: {
    color: '#fff',
  },
});

export default AttributesSelector;
