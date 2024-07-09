import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';

const CategoryItem = ({name, image}) => {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.circle}>
        <Image source={image} style={styles.image} />
      </View>
      <Text style={styles.text}>{name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 35,
    backgroundColor: '#FFE8C4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 25,
  },
  text: {
    marginTop: 5,
    fontSize: 14,
  },
});

export default CategoryItem;
