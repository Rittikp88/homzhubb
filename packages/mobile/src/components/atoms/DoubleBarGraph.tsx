import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { BarChart, Grid, XAxis, YAxis } from 'react-native-svg-charts';
import { PathProps } from 'react-native-svg';
import { sum, isEqual } from 'lodash';
import { theme } from '@homzhub/common/src/styles/theme';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { GraphLegends } from '@homzhub/mobile/src/components/atoms/GraphLegends';
import { BarGraphLegends, IGeneralLedgerGraphData } from '@homzhub/common/src/domain/models/GeneralLedgers';
import { DateRangeType } from '@homzhub/common/src/constants/FinanceOverview';
import { IGraphProps } from '@homzhub/common/src/utils/FinanceUtil';

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
const Y_AXIS_WIDTH = 55;

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
        <View>
          <View style={styles.rowContainer}>
            <YAxis
              contentInset={VERTICAL_INSET}
              data={data1.concat(data2)}
              svg={SVG_FONT}
              formatLabel={(value: number): string => `${currency.currencySymbol} ${value}`}
              style={styles.yAxis}
            />
            <BarChart
              contentInset={VERTICAL_INSET}
              spacingInner={0.35}
              style={{ width: WIDTH, height: HEIGHT }}
              data={barData}
            >
              <Grid direction={Grid.Direction.HORIZONTAL} svg={SVG_GRID} />
            </BarChart>
          </View>
          <XAxis
            spacingInner={0.35}
            style={[styles.xAxis, { width: WIDTH }]}
            data={label}
            contentInset={HORIZONTAL_INSET}
            svg={SVG_FONT}
            formatLabel={(_, index: number): string => label[index]}
          />
        </View>
      </ScrollView>
      <GraphLegends data={barGraphLegends()} />
    </>
  );
};

const memoizedComponent = React.memo(DoubleBarGraph, isEqual);
export { memoizedComponent as DoubleBarGraph };

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
  },
  xAxis: {
    marginStart: Y_AXIS_WIDTH,
    paddingVertical: 12,
  },
  yAxis: {
    alignItems: 'flex-start',
    width: Y_AXIS_WIDTH,
  },
});
