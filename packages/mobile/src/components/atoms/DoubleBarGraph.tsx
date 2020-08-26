import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { BarChart, XAxis, YAxis, Grid } from 'react-native-svg-charts';
import { PathProps } from 'react-native-svg';
import { sum } from 'lodash';
import { theme } from '@homzhub/common/src/styles/theme';
import { GraphLegends } from '@homzhub/mobile/src/components/atoms/GraphLegends';
import { BarGraphLegends, IGeneralLedgerGraphData } from '@homzhub/common/src/domain/models/GeneralLedgers';

interface IProps {
  data: {
    data1: number[];
    data2: number[];
    label: string[];
  };
}

// SVG OPTIONS
const SVG_FONT = { fontSize: 12, fill: theme.colors.darkTint6, fontWeight: '600' as '600' };
const SVG_GRID = { strokeDasharray: [5, 5], stroke: theme.colors.darkTint7 };
// INSET OPTIONS
const VERTICAL_INSET = { top: 8, bottom: 8 };
const HORIZONTAL_INSET = { left: 24, right: 24 };
// VIEWPORT CONSTANTS
const Y_GRID_WIDTH = 36;
const HEIGHT = theme.viewport.height * 0.5;
const WIDTH = theme.viewport.width * 1.5;

const DoubleBarGraph = (props: IProps): React.ReactElement => {
  const {
    data: { data1, data2, label },
  } = props;

  const barData = [
    {
      data: data1,
      svg: { fill: theme.colors.expense } as Partial<PathProps>,
    },
    {
      data: data2,
      svg: { fill: theme.colors.income } as Partial<PathProps>,
    },
  ];

  const barGraphLegends = (): IGeneralLedgerGraphData[] => {
    return [
      {
        key: 1,
        title: BarGraphLegends.expense,
        value: sum(data1),
        svg: { fill: theme.colors.expense },
      },
      {
        key: 1,
        title: BarGraphLegends.income,
        value: sum(data2),
        svg: { fill: theme.colors.income },
      },
    ];
  };

  return (
    <>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.barGraphContainer}>
          <View style={styles.yContainer}>
            <YAxis style={styles.yGrid} contentInset={VERTICAL_INSET} data={data1.concat(data2)} svg={SVG_FONT} />
            <BarChart contentInset={VERTICAL_INSET} style={styles.barGraph} data={barData}>
              <Grid direction={Grid.Direction.HORIZONTAL} svg={SVG_GRID} />
            </BarChart>
          </View>
          <XAxis
            style={styles.xAxis}
            data={label}
            contentInset={HORIZONTAL_INSET}
            svg={SVG_FONT}
            formatLabel={(value, index): string => label[index]}
          />
        </View>
      </ScrollView>
      <GraphLegends direction="row" data={barGraphLegends()} />
    </>
  );
};

const styles = StyleSheet.create({
  barGraphContainer: {
    flexDirection: 'column',
  },
  barGraph: {
    flex: 1,
    width: WIDTH,
    height: HEIGHT,
  },
  yContainer: {
    flexDirection: 'row',
  },
  yGrid: {
    width: Y_GRID_WIDTH,
    alignItems: 'flex-start',
  },
  xAxis: {
    marginStart: Y_GRID_WIDTH,
    width: WIDTH,
    padding: 10,
  },
});

const memoizedComponent = React.memo(DoubleBarGraph);
export { memoizedComponent as DoubleBarGraph };
