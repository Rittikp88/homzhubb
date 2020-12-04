import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { PieChart } from 'react-native-svg-charts';
import { theme } from '@homzhub/common/src/styles/theme';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { GraphLegends } from '@homzhub/mobile/src/components/atoms/GraphLegends';
import { GeneralLedgers, IGeneralLedgerGraphData } from '@homzhub/common/src/domain/models/GeneralLedgers';

const INNER_RADIUS = '70%';
const HEIGHT = 225;
interface IProps {
  data: GeneralLedgers[];
}

const DonutGraph = (props: IProps): React.ReactElement => {
  const { data } = props;
  const [donutData, setDonutData] = useState<IGeneralLedgerGraphData[]>([]);

  useEffect(() => {
    const transformedData: IGeneralLedgerGraphData[] = [];

    data.forEach((ledger: GeneralLedgers, index: number) => {
      const { category, amount } = ledger;
      transformedData.push({
        key: index,
        title: category,
        value: amount,
        svg: { fill: theme.randomHex() },
      });
    });

    setDonutData(transformedData);
  }, [data]);

  const render = (): React.ReactElement => {
    if (data.length === 0) return <EmptyState />;

    return (
      <>
        <PieChart style={styles.pieChart} data={donutData} innerRadius={INNER_RADIUS} />
        <GraphLegends data={donutData} />
      </>
    );
  };
  return render();
};

const styles = StyleSheet.create({
  pieChart: {
    flex: 1,
    marginBottom: 16,
    height: HEIGHT,
  },
});
const memoizedComponent = React.memo(DonutGraph);
export { memoizedComponent as DonutGraph };
