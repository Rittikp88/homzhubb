import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import MarketTrendsCarousel from '@homzhub/web/src/screens/dashboard/components/MarketTrendsCarousel';
import PropertyOverview from '@homzhub/web/src/screens/dashboard/components/PropertyOverview';

const Dashboard: FC = () => {
  return (
    <View style={styles.container}>
      <PropertyOverview />
      <MarketTrendsCarousel />
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.background,
  },
});
