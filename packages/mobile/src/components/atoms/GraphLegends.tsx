import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label } from '@homzhub/common/src/components';

const mockData = [
  {
    title: 'Total Income',
    cost: '₹30,00,000/-',
    color: '#85DACF',
  },
  {
    title: 'Total Income',
    cost: '₹30,00,000/-',
    color: '#FFC5BE',
  },
  {
    title: 'Total Income',
    cost: '₹30,00,000/-',
    color: '#A2D2FD',
  },
];

interface IProps {
  direction: 'row' | 'column';
}

const GraphLegends = (props: IProps): React.ReactElement => {
  const { direction } = props;
  let directionStyle = {};
  let directionLegendStyle: ViewStyle = styles.legendContainerColumn;

  if (direction === 'row') {
    directionStyle = styles.rowContainer;
    directionLegendStyle = styles.legendContainerRow;
  }

  directionStyle = { ...directionStyle, ...{ flexDirection: direction } };

  return (
    <View style={[styles.container, directionStyle]}>
      {mockData.map((legend) => (
        <View style={[styles.legendContainer, directionLegendStyle]} key={`legend-${legend.title}`}>
          <View style={[styles.color, { backgroundColor: legend.color }]} />
          <View>
            <Label type="regular" textType="regular" style={styles.textColor}>
              {legend.title}
            </Label>
            <Label type="regular" textType="semiBold" style={styles.textColor}>
              {legend.cost}
            </Label>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  legendContainer: {
    flexDirection: 'row',
  },
  rowContainer: {
    flexWrap: 'wrap',
    marginTop: 16,
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
