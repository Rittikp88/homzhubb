import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import DonutChart from '@homzhub/web/src/components/atoms/DonutChart';
import ColumnChart from '@homzhub/web/src/components/atoms/ColumnChart';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

const PropertyVisualsEstimates = (): React.ReactElement => {
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const styles = propertyVisualEstimatesStyle(isMobile);
  return (
    <View style={styles.container}>
      <View style={styles.donutChart}>
        <Typography variant="label" size="large" fontWeight="bold">
          Cost Breakdown
        </Typography>
        <DonutChart />
      </View>
      <View style={styles.columnChart}>
        <Typography variant="label" size="large" fontWeight="bold">
          Cash Flow
        </Typography>
        <ColumnChart />
      </View>
    </View>
  );
};

export default PropertyVisualsEstimates;

interface IStyle {
  container: ViewStyle;
  donutChart: ViewStyle;
  columnChart: ViewStyle;
}

const propertyVisualEstimatesStyle = (isMobile: boolean): StyleSheet.NamedStyles<IStyle> =>
  StyleSheet.create<IStyle>({
    container: {
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: isMobile ? undefined : 'space-around',
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
    columnChart: {
      flex: 0.5,
    },
  });
