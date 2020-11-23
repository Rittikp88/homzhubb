import React, { FC } from 'react';
import { TouchableWithoutFeedback, StyleSheet, View } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import MultiCarousel from '@homzhub/web/src/components/molecules/MultiCarousel';
import MarketTrendsCard from '@homzhub/web/src/screens/dashboard/components/MarketTrendsCard';

// TODO (BISHAL) - change dummy data with actual api data
const MarketTrendsCarousel: FC = () => {
  return (
    <View style={styles.carouselContainer}>
      <View style={styles.titleContainer}>
        <Icon name={icons.increase} color={theme.colors.dark} size={24} style={styles.icon} />
        <Typography variant="text" size="regular" fontWeight="semiBold" style={styles.title}>
          Market Trends
        </Typography>
        <TouchableWithoutFeedback>
          <Typography variant="text" size="small" fontWeight="regular" style={styles.viewAll}>
            View all
          </Typography>
        </TouchableWithoutFeedback>
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
    marginRight: -16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    color: theme.colors.dark,
  },
  viewAll: {
    color: theme.colors.primaryColor,
    margin: 16,
  },
  icon: {
    margin: 12,
  },
});

export default MarketTrendsCarousel;
