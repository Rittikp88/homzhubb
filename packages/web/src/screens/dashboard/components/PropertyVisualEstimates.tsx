import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import DonutChart from 'components/atoms/DonutChart';
import ColumnChart from 'components/atoms/ColumnChart';

const PropertyVisualsEstimates = (): React.ReactElement => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.donutChart}>
        <DonutChart />
      </View>
      <View style={styles.ColumnChart}>
        <ColumnChart />
      </View>
    </View>
  );
};

export default PropertyVisualsEstimates;

const styles = StyleSheet.create({
  mainContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: theme.colors.white,
    marginHorizontal: 4,
    borderTopColor: theme.colors.background,
    borderTopWidth: 1,
    paddingBottom: 15,
    paddingTop: 12,
    paddingHorizontal: 16,
  },
  donutChart: {
    flex: 0.3,
  },
  ColumnChart: {
    flex: 0.5,
  },
});
