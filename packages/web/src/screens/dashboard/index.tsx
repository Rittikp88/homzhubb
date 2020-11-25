import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import MarketTrendsCarousel from '@homzhub/web/src/screens/dashboard/components/MarketTrendsCarousel';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import PropertyOverview from '@homzhub/web/src/screens/dashboard/components/PropertyOverview';
import InvestmentsCarousel from '@homzhub/web/src/screens/dashboard/components/InvestmentsCaraousel';
// import PropertyVisualsEstimates from './components/PropertyVisualEstimates'; todos Lakshit

interface IProps {
  investmentDataArray: Asset[];
}
const Dashboard: FC<IProps> = (props: IProps) => {
  const { investmentDataArray } = props;
  return (
    <View style={styles.container}>
      {/* <PropertyVisualsEstimates /> */}
      <PropertyOverview />
      <InvestmentsCarousel investmentData={investmentDataArray} />
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
  },
});
