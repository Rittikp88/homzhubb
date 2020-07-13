import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';

interface IProps {
  isColumn: boolean;
  icon: string;
  iconSize?: number;
  iconColor?: string;
  label: string;
}

const AmenitiesIcon = (props: IProps): React.ReactElement => {
  const { isColumn, icon, iconSize = 40, iconColor = theme.colors.darkTint3, label } = props;

  const renderText = (): React.ReactElement => {
    const labelStyle = isColumn ? styles.columnLabel : styles.rowLabel;
    return (
      <Text type="small" textType="regular" style={[styles.label, labelStyle]}>
        {label}
      </Text>
    );
  };

  const renderColumn = (): React.ReactElement => {
    return (
      <View style={styles.columnContainer}>
        <Icon name={icon} size={iconSize} color={iconColor} />
        {renderText()}
      </View>
    );
  };

  const renderRow = (): React.ReactElement => {
    return (
      <View style={styles.rowContainer}>
        <Icon name={icon} size={iconSize} color={iconColor} />
        {renderText()}
      </View>
    );
  };

  return isColumn ? renderColumn() : renderRow();
};

export { AmenitiesIcon };

const styles = StyleSheet.create({
  columnContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  label: {
    color: theme.colors.darkTint3,
  },
  columnLabel: {
    alignItems: 'center',
  },
  rowLabel: {
    marginStart: 10,
  },
});
