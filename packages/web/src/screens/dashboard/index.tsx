import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import MarketTrendsCarousel from '@homzhub/web/src/screens/dashboard/components/MarketTrendsCarousel';
import InvestmentsCarousel from './components/InvestmentsCaraousel';

interface IProps {
  investmentData: IInvestmentData;
}
interface IInvestmentData {
  investType: string;
}
class Dashboard extends React.PureComponent<IProps> {
  public render(): React.ReactNode {
    // const { investmentData } = this.props;
    return (
      <View style={styles.container}>
        <MarketTrendsCarousel />
        <InvestmentsCarousel
          // investType={investmentData.investType}
          investType="Hello"
        />
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
