import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BarChart, XAxis, YAxis, Grid } from 'react-native-svg-charts';
import { PathProps } from 'react-native-svg';
import { theme } from '@homzhub/common/src/styles/theme';
import { GraphLegends } from '@homzhub/mobile/src/components/atoms/GraphLegends';

// SVG OPTIONS
const SVG_FONT = { fontSize: 12, fill: theme.colors.darkTint6, fontWeight: '600' as '600' };
const SVG_GRID = { strokeDasharray: [5, 5], stroke: theme.colors.darkTint7 };
// INSET OPTIONS
const VERTICAL_INSET = { top: 8, bottom: 8 };
const HORIZONTAL_INSET = { left: 48, right: 16 };

const DoubleBarGraph = (): React.ReactElement => {
  const data1 = [10, 20, 0, 77, 43, 100, 54, 23, 11, 87, 34, 99];
  const data2 = [24, 28, 93, 77, 52, 21, 200, 76, 12, 43, 59, 300];

  const barData = [
    {
      data: data1,
      svg: { fill: '#FFC5BE' } as Partial<PathProps>,
    },
    {
      data: data2,
      svg: { fill: '#85DACF' } as Partial<PathProps>,
    },
  ];
  const label = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <>
      <View style={styles.yContainer}>
        <YAxis style={styles.yGrid} contentInset={VERTICAL_INSET} data={data1.concat(data2)} svg={SVG_FONT} />
        <BarChart contentInset={VERTICAL_INSET} style={styles.barGraph} data={barData}>
          <Grid direction={Grid.Direction.HORIZONTAL} svg={SVG_GRID} />
        </BarChart>
      </View>
      <XAxis
        data={label}
        contentInset={HORIZONTAL_INSET}
        svg={SVG_FONT}
        formatLabel={(value, index): string => label[index]}
      />
      <GraphLegends direction="row" />
    </>
  );
};

const styles = StyleSheet.create({
  barGraph: {
    flex: 1,
    height: theme.viewport.height * 0.5,
  },
  yContainer: {
    flexDirection: 'row',
  },
  yGrid: {
    marginEnd: 12,
  },
});

const memoizedComponent = React.memo(DoubleBarGraph);
export { memoizedComponent as DoubleBarGraph };
