import React from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import AutoImageSlider from '../components/AutoImageSlider';
import HelpBox from '../components/HelpBox';
import Categories from '../components/Categories';
import AutoImageSlider2 from '../components/AutoImageSlider2';
import BestDeals from '../components/BestDeals';
import LatestProducts from '../components/LatestProducts';
import UpcomingProducts from '../components/UpcomingProducts';
import WhatsAppButton from '../components/WhatsAppButton';
import { colors } from '../styles/color';

const HomeContent = () => {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <AutoImageSlider />
        <View style={styles.backgroundContainer}>
          <View style={styles.topHalf} />
          <View style={styles.bottomHalf} />
          <HelpBox style={styles.helpBox} />
          <Categories style={styles.categories} />
          <Text style={styles.title}>Only For App Deals</Text>
          <AutoImageSlider2 />
          <BestDeals />
          <UpcomingProducts />
          <LatestProducts />
        </View>
        <View style={styles.endTextContainer}>
          <Text style={styles.endText}>India's best</Text>
          <Text style={styles.endText}>
            delivery app<Text style={styles.emoji}>❤️</Text>
          </Text>
          <View style={styles.line} />
          <Text style={styles.crossBee}>CrossBee</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backgroundContainer: {
    position: 'relative',
  },
  topHalf: {
    backgroundColor: colors.main,
    height: '2%',
  },
  bottomHalf: {
    backgroundColor: '#FFFFFF',
    height: '2%',
  },
  helpBox: {
    marginBottom: 0,
  },
  categories: {
    marginTop: 0,
    marginBottom: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 1,
    marginLeft: 15,
    color: colors.TextBlack,
  },
  endTextContainer: {
    alignItems: 'left',
    marginTop: 1,
    marginLeft: 10,
  },
  endText: {
    fontSize: 40,
    fontWeight: 'bold',
    opacity: 0.1,
    color: colors.TextBlack,
  },
  emoji: {
    fontSize: 40,
    opacity: 1,
  },
  line: {
    width: '90%',
    height: 1,
    backgroundColor: '#000',
    marginVertical: 10,
    opacity: 0.1,
  },
  crossBee: {
    fontSize: 24,
    fontWeight: '600',
    opacity: 0.1,
    marginBottom: 200,
    color: colors.TextBlack,
  },
});

export default HomeContent;
