import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import MarketTrendsCarousel from '@homzhub/web/src/screens/dashboard/components/MarketTrendsCarousel';
import { PropertyInvestment } from '@homzhub/common/src/domain/models/PropertyInvestment';
import InvestmentsCarousel from './components/InvestmentsCaraousel';
// import PropertyVisualsEstimates from './components/PropertyVisualEstimates'; todos Lakshit

interface IProps {
  investmentDataArray: PropertyInvestment[];
}
class Dashboard extends React.PureComponent<IProps> {
  public render(): React.ReactNode {
    const { investmentDataArray } = this.props;
    return (
      <View style={styles.container}>
        {/* <PropertyVisualsEstimates /> */}
        <InvestmentsCarousel investmentData={investmentDataArray} />
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
