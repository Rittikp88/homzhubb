import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Icon from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';

interface IProps {
  direction: 'row' | 'column';
  icon: string;
  iconSize?: number;
  iconColor?: string;
  label: string;
  isLastIndex?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

const AmenitiesIcon = (props: IProps): React.ReactElement => {
  const {
    direction,
    icon,
    iconSize = 40,
    iconColor = theme.colors.darkTint3,
    label,
    isLastIndex = false,
    containerStyle,
  } = props;

  const renderText = (): React.ReactElement => {
    const labelStyle = direction === 'column' ? styles.columnLabel : styles.rowLabel;
    return (
      <Text type="small" textType="regular" style={[styles.label, labelStyle]}>
        {label}
      </Text>
    );
  };

  const renderColumn = (): React.ReactElement => {
    return (
      <>
        <View style={styles.columnContainer}>
          <Icon name={icon} size={iconSize} color={iconColor} />
          {renderText()}
        </View>
        {!isLastIndex && direction === 'column' && <Divider containerStyles={styles.divider} />}
      </>
    );
  };

  const renderRow = (): React.ReactElement => {
    return (
      <View style={[styles.rowContainer, containerStyle]}>
        <Icon name={icon} size={iconSize} color={iconColor} />
        {renderText()}
      </View>
    );
  };

  return direction === 'column' ? renderColumn() : renderRow();
};

export { AmenitiesIcon };

const styles = StyleSheet.create({
  columnContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    color: theme.colors.darkTint3,
  },
  columnLabel: {
    alignItems: 'center',
  },
  rowLabel: {
    marginStart: 6,
  },
  divider: {
    borderWidth: 1,
    borderColor: theme.colors.background,
    height: 25,
  },
});
