import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import PropertyVisualsEstimates from '@homzhub/web/src/screens/dashboard/components/PropertyVisualEstimates';
import DuesCard from '@homzhub/web/src/screens/Financials/DuesCard';
import Transactions from '@homzhub/web/src/screens/Financials/Transactions';

const Financials: FC = () => {
  console.log('mai arha hu ki nahi haiohaii');
  return (
    <View style={styles.container}>
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
