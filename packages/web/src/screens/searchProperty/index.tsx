import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import PropertySearchCard from '@homzhub/web/src/screens/searchProperty/components/PropertySearchCard';
import {
  InvestmentMockData,
  IInvestmentMockData,
} from '@homzhub/web/src/screens/dashboard/components/InvestmentMockDetails';

// TODO : Replace Dummy Data with Api Data;
const SearchProperty: FC = () => {
  return (
    <View style={styles.mainContainer}>
      <GridView />
    </View>
  );
};

const GridView = (): React.ReactElement => {
  const investmentDataArray = InvestmentMockData;

  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        {investmentDataArray.map((item: IInvestmentMockData) => (
          <View key={item.id} style={styles.card}>
            <PropertySearchCard key={item.id} investmentData={item} />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
  },
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
  },
  subContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    maxWidth: '100%',
  },
  card: {
    width: '31%',
    marginLeft: 18,
  },
});

export default SearchProperty;
