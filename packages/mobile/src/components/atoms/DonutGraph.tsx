import React from 'react';
import { StyleSheet, View } from 'react-native';
import { PieChart } from 'react-native-svg-charts';
import { theme } from '@homzhub/common/src/styles/theme';
import { GraphLegends } from '@homzhub/mobile/src/components/atoms/GraphLegends';

const INNER_RADIUS = '45%';
const DonutGraph = (): React.ReactElement => {
  const data = [
    {
      key: 1,
      value: 40,
      svg: { fill: '#85DACF' },
    },
    {
      key: 2,
      value: 40,
      svg: { fill: '#FFC5BE' },
    },
    {
      key: 3,
      value: 20,
      svg: { fill: '#A2D2FD' },
    },
  ];

  return (
    <View style={styles.container}>
      <PieChart style={styles.pieChart} data={data} innerRadius={INNER_RADIUS} />
      <GraphLegends direction="column" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pieChart: {
    flex: 1,
    marginEnd: 16,
    height: theme.viewport.height * 0.25,
  },
});

const memoizedComponent = React.memo(DonutGraph);
export { memoizedComponent as DonutGraph };
