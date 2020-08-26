import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label, PricePerUnit } from '@homzhub/common/src/components';
import { IGeneralLedgerGraphData } from '@homzhub/common/src/domain/models/GeneralLedgers';

interface IProps {
  data: IGeneralLedgerGraphData[];
  direction: 'row' | 'column';
}

const GraphLegends = (props: IProps): React.ReactElement => {
  const { direction, data } = props;
  let directionStyle = {};
  let directionLegendStyle: ViewStyle = styles.legendContainerColumn;

  if (direction === 'row') {
    directionStyle = styles.rowContainer;
    directionLegendStyle = styles.legendContainerRow;
  }

  directionStyle = { ...directionStyle, ...{ flexDirection: direction } };

  return (
    <View style={[styles.container, directionStyle]}>
      {data.map((legend: IGeneralLedgerGraphData, index: number) => (
        <View style={[styles.legendContainer, directionLegendStyle]} key={`legend-${index}`}>
          <View style={[styles.color, { backgroundColor: legend.svg.fill }]} />
          <View>
            <Label type="regular" textType="regular" style={styles.textColor}>
              {legend.title}
            </Label>
            <PricePerUnit price={legend.value} currency="INR" textSizeType="small" textFontWeight="regular" />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  legendContainer: {
    flexDirection: 'row',
  },
  rowContainer: {
    flexWrap: 'wrap',
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  legendContainerRow: {
    marginBottom: 16,
    marginHorizontal: 12,
  },
  legendContainerColumn: {
    marginVertical: 16,
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
