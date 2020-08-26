import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PieChart } from 'react-native-svg-charts';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Text } from '@homzhub/common/src/components';
import { GraphLegends } from '@homzhub/mobile/src/components/atoms/GraphLegends';
import { GeneralLedgers, IGeneralLedgerGraphData } from '@homzhub/common/src/domain/models/GeneralLedgers';

const INNER_RADIUS = '45%';
const HEIGHT = theme.viewport.height * 0.25;

interface IProps {
  data: GeneralLedgers[];
}

const COLOR_BAND = [
  theme.colors.income,
  theme.colors.expense,
  theme.colors.blueDonut,
  theme.colors.darkTint1,
  theme.colors.darkTint2,
  theme.colors.darkTint3,
  theme.colors.darkTint4,
  theme.colors.darkTint5,
];

const DonutGraph = (props: IProps): React.ReactElement => {
  const { data } = props;
  const { t } = useTranslation();

  const transformDonutData = (): IGeneralLedgerGraphData[] => {
    const transformedData: IGeneralLedgerGraphData[] = [];
    data.forEach((ledger: GeneralLedgers, index: number) => {
      const { category, amount } = ledger;
      transformedData.push({
        key: index,
        title: category,
        value: amount,
        svg: { fill: COLOR_BAND[index] },
      });
    });
    return transformedData;
  };

  const render = (): React.ReactElement => {
    if (data.length === 0) {
      return (
        <View style={styles.noDataContainer}>
          <Icon name={icons.search} size={30} color={theme.colors.disabledSearch} />
          <Text type="small" textType="semiBold" style={styles.noResultsFound}>
            {t('common:noResultsFound')}
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <PieChart style={styles.pieChart} data={transformDonutData()} innerRadius={INNER_RADIUS} />
        <GraphLegends direction="column" data={transformDonutData()} />
      </View>
    );
  };

  return render();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pieChart: {
    flex: 1,
    marginEnd: 16,
    height: HEIGHT,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 150,
  },
  noResultsFound: {
    marginVertical: 15,
    color: theme.colors.darkTint6,
  },
});

const memoizedComponent = React.memo(DonutGraph);
export { memoizedComponent as DonutGraph };
