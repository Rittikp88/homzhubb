import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { theme } from '@homzhub/common/src/styles/theme';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { PricePerUnit } from '@homzhub/common/src/components/atoms/PricePerUnit';
import { IGeneralLedgerGraphData } from '@homzhub/common/src/domain/models/GeneralLedgers';

interface IProps {
  data: IGeneralLedgerGraphData[];
}

const GraphLegends = (props: IProps): React.ReactElement => {
  const { data } = props;
  const currency = useSelector(UserSelector.getCurrency);

  return (
    <View style={styles.container}>
      {data.map((legend: IGeneralLedgerGraphData, index: number) => (
        <View style={styles.legendContainer} key={`legend-${index}`}>
          <View style={[styles.color, { backgroundColor: legend.svg.fill }]} />
          <View>
            <Label type="regular" textType="regular" style={styles.textColor}>
              {legend.title}
            </Label>
            <PricePerUnit price={legend.value} currency={currency} textSizeType="small" textFontWeight="regular" />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  legendContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    marginHorizontal: 12,
  },
  color: {
    marginEnd: 6,
    marginTop: 4,
    ...(theme.circleCSS(12) as object),
  },
  textColor: {
    color: theme.colors.darkTint4,
  },
});

const memoizedComponent = React.memo(GraphLegends);
export { memoizedComponent as GraphLegends };
