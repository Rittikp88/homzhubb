import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import MarketTrendsCarousel from '@homzhub/web/src/screens/dashboard/components/MarketTrendsCarousel';

class Dashboard extends React.PureComponent {
  public render(): React.ReactNode {
    return (
      <View style={styles.container}>
        <MarketTrendsCarousel />
      </View>
    );
  }
}

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.background,
  },
});
