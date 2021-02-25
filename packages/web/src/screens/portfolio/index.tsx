import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import PortfolioHeader from '@homzhub/web/src/screens/portfolio/components/PortfolioHeader';
import PortfolioCardGroup from '@homzhub/web/src/screens/portfolio/components/PortfolioCardGroup';

const Portfolio: FC = () => {
  return (
    <View style={styles.container}>
      <PortfolioHeader />
      <PortfolioCardGroup />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default Portfolio;
