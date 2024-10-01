import React from 'react';
import {View, ScrollView, StyleSheet, Text} from 'react-native';
import AutoImageSlider from '../components/AutoImageSlider';
import HelpBox from '../components/HelpBox';
import Categories from '../components/Categories';
import AutoImageSlider2 from '../components/AutoImageSlider2';
import BestDeals from '../components/BestDeals';
import LatestProducts from '../components/LatestProducts';
import UpcomingProducts from '../components/UpcomingProducts';
import WhatsAppButton from '../components/WhatsAppButton';
import {colors} from '../styles/color';
import CustomTabBar from '../components/CustomTabBar';
import CustomHeader from '../components/CustomHeader';

const HomeContent = () => {
  return (
    <View style={{flex: 1}}>
     
      <ScrollView style={styles.container}>
        <AutoImageSlider />

        <HelpBox style={styles.helpBox} />

        <Categories style={styles.categories} />
        <BestDeals />
        <Text style={styles.title}>Only For App Deals</Text>
        <AutoImageSlider2 />

        <UpcomingProducts />
        <LatestProducts />
        <View style={styles.endTextContainer}>
          <Text style={styles.crossBee}>CrossBee</Text>
          <Text style={styles.AppYard3}>nahi toh Koi nahi</Text>
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

  categories: {
    marginTop: 0,
    marginBottom: 0,
  },
  title: {
    fontSize: 20,

    fontFamily: 'Outfit-Medium',
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

    fontFamily: 'Outfit-Medium',
    opacity: 0.1,
    color: colors.TextBlack,
  },
  emoji: {
    fontSize: 40,
    fontFamily: 'Outfit-Medium',
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
    fontSize: 40,

    fontFamily: 'Outfit-Bold',
    opacity: 0.1,

    color: colors.TextBlack,
  },
  AppYard3: {
    fontSize: 20,

    fontFamily: 'Outfit-Bold',
    opacity: 0.1,

    color: colors.TextBlack,
  },
  AppYard: {
    fontSize: 14,

    fontFamily: 'Outfit-Regular',
    opacity: 0.1,

    color: colors.TextBlack,
  },
  AppYard2: {
    fontSize: 16,

    fontFamily: 'Outfit-Bold',
    opacity: 0.1,
    marginBottom: 10,
    color: colors.TextBlack,
  },
});

export default HomeContent;
