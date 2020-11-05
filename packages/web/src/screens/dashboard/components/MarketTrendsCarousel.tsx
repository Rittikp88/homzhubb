import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@homzhub/common/src/components';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import MultiCarousel from '@homzhub/web/src/components/molecules/MultiCarousel';
import MarketTrendsCard from '@homzhub/web/src/screens/dashboard/components/MarketTrendsCard';

// TODO (BISHAL) - change dummy data with actual api data
const MarketTrendsCarousel: FC = () => {
  return (
    <View style={styles.carouselContainer}>
      <View style={styles.titleContainer}>
        <Icon name={icons.increase} color={theme.colors.dark} size={24} style={styles.icon} />
        <Text type="regular" textType="semiBold" style={styles.title}>
          Market Trends
        </Text>
      </View>
      <MultiCarousel>
        <MarketTrendsCard />
        <MarketTrendsCard />
        <MarketTrendsCard />
        <MarketTrendsCard />
        <MarketTrendsCard />
        <MarketTrendsCard />
        <MarketTrendsCard />
        <MarketTrendsCard />
        <MarketTrendsCard />
        <MarketTrendsCard />
        <MarketTrendsCard />
        <MarketTrendsCard />
      </MultiCarousel>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    backgroundColor: theme.colors.background,
    marginVertical: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: theme.colors.dark,
  },
  icon: {
    margin: 12,
  },
});

export default MarketTrendsCarousel;
