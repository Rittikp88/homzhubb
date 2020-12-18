import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import PropertyOverview from '@homzhub/web/src/screens/dashboard/components/PropertyOverview';
import PropertyVisualsEstimates from '@homzhub/web/src/screens/dashboard/components/PropertyVisualEstimates';
import DuesCard from '@homzhub/web/src/screens/Financials/DuesCard';
import Transactions from '@homzhub/web/src/screens/Financials/Transactions';

const Financials: FC = () => {
  return (
    <View style={styles.container}>
      <PropertyOverview />
      <PropertyVisualsEstimates />
      <DuesCard />
      <Transactions />
    </View>
  );
};

export default Financials;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
