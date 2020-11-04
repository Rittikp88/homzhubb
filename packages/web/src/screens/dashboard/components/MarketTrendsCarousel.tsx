import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import MultiCarousel from '@homzhub/web/src/components/molecules/MultiCarousel';
import MarketTrendsCard from '@homzhub/web/src/screens/dashboard/components/MarketTrendsCard';
import { Text } from '@homzhub/common/src/components';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';

// TODO (BISHAL) - change dummy data with actual api data
const MarketTrendsCarousel: FC<{}> = (props) => {
  return (
    <View style={styles.carousel_container}>
      <View style={styles.title_container}>
        <Icon name={icons.increase} color={theme.colors.dark} size={24} style={styles.icon} />
        <Text type="regular" textType="semiBold" style={styles.title}>
          Market Trends
        </Text>
      </View>
      <MultiCarousel>
        <MarketTrendsCard data="saf" />
        <MarketTrendsCard data="saf" />
        <MarketTrendsCard data="saf" />
        <MarketTrendsCard data="saf" />
        <MarketTrendsCard data="saf" />
        <MarketTrendsCard data="saf" />
        <MarketTrendsCard data="saf" />
        <MarketTrendsCard data="saf" />
        <MarketTrendsCard data="saf" />
        <MarketTrendsCard data="saf" />
        <MarketTrendsCard data="saf" />
        <MarketTrendsCard data="saf" />
      </MultiCarousel>
    </View>
  );
};

const styles = StyleSheet.create({
  carousel_container: {
    flexDirection: 'column',
    backgroundColor: theme.colors.background,
    marginVertical: 10,
  },
  title_container: {
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
