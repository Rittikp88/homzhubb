import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { BarChart, Grid, XAxis } from 'react-native-svg-charts';
import { PathProps } from 'react-native-svg';
import { sum } from 'lodash';
import { theme } from '@homzhub/common/src/styles/theme';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { GraphLegends } from '@homzhub/mobile/src/components/atoms/GraphLegends';
import { BarGraphLegends, IGeneralLedgerGraphData } from '@homzhub/common/src/domain/models/GeneralLedgers';
import { DateRangeType } from '@homzhub/common/src/constants/FinanceOverview';

export interface IGraphProps {
  data1: number[];
  data2: number[];
  label: string[];
  type: DateRangeType;
}

interface IProps {
  data: IGraphProps;
}

// SVG OPTIONS
const SVG_FONT = { fontSize: 12, fill: theme.colors.darkTint6, fontWeight: '600' as '600' };
const SVG_GRID = { strokeDasharray: [5, 5], stroke: theme.colors.darkTint7, width: '100%' };
// INSET OPTIONS
const VERTICAL_INSET = { top: 8, bottom: 8 };
// VIEWPORT CONSTANTS
const HEIGHT = theme.viewport.height * 0.5;

const DoubleBarGraph = (props: IProps): React.ReactElement => {
  const {
    data: { data1, data2, label, type },
  } = props;

  let HORIZONTAL_INSET = { left: 12, right: 12 };
  let WIDTH = theme.viewport.width * 1.3;
  if (type === DateRangeType.Month) {
    WIDTH = label.length <= 4 ? theme.viewport.width - 64 : theme.viewport.width;
    HORIZONTAL_INSET = { left: 24, right: 24 };
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
  const currency = useSelector(UserSelector.getCurrency);

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

  const isData1Empty = data1.every((value) => value === 0);
  const isData2Empty = data2.every((value) => value === 0);
  if (isData1Empty && isData2Empty) {
    return <EmptyState />;
  }

  return (
    <>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.barGraphContainer}>
          <BarChart
            contentInset={VERTICAL_INSET}
            spacingInner={0.35}
            style={{ width: WIDTH, height: HEIGHT }}
            data={barData}
          >
            <Grid direction={Grid.Direction.HORIZONTAL} svg={SVG_GRID} />
          </BarChart>
          <XAxis
            spacingInner={0.35}
            style={[styles.xAxis, { width: WIDTH }]}
            data={label}
            contentInset={HORIZONTAL_INSET}
            svg={SVG_FONT}
            formatLabel={(value, index: number): string => label[index]}
          />
        </View>
      </ScrollView>
      <GraphLegends data={barGraphLegends()} />
    </>
  );
};

const memoizedComponent = React.memo(DoubleBarGraph);
export { memoizedComponent as DoubleBarGraph };

const styles = StyleSheet.create({
  barGraphContainer: {
    flexDirection: 'column',
  },
  xAxis: {
    paddingVertical: 12,
  },
});
