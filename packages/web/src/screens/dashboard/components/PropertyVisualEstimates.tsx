import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import DonutChart from '@homzhub/web/src/components/atoms/DonutChart';
import ColumnChart from '@homzhub/web/src/components/atoms/ColumnChart';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';

const PropertyVisualsEstimates = (): React.ReactElement => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.donutChart}>
        <Typography variant="label" size="large" fontWeight="bold">
          Cost Breakdown
        </Typography>
        <DonutChart />
      </View>
      <View style={styles.ColumnChart}>
        <Typography variant="label" size="large" fontWeight="bold">
          Cash Flow
        </Typography>
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
