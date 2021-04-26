import React from 'react';
import { StyleSheet, TextStyle, View, ViewStyle, TouchableOpacity } from 'react-native';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon from '@homzhub/common/src/assets/icon';
import { Label } from '@homzhub/common/src/components/atoms/Text';

interface IIconWithCount {
  iconName: string;
  count: number;
  countColor?: string;
  circleBackgroundColor?: string;
  iconSize?: number;
  iconColor?: string;
  circleSize?: number;
  containerStyle?: ViewStyle;
  bottomOffset?: number;
  onPress?: () => void;
}

const CIRCLE_SIZE_DEFAULT = 60;
const ICON_SIZE_DEFAULT = 30;

const IconWithCount = (props: IIconWithCount): React.ReactElement => {
  const {
    iconName,
    count,
    countColor = theme.colors.white,
    iconColor = theme.colors.blue,
    iconSize = ICON_SIZE_DEFAULT,
    circleSize = CIRCLE_SIZE_DEFAULT,
    circleBackgroundColor = theme.colors.notificationRed,
    containerStyle,
    bottomOffset = 1.2 * iconSize,
    onPress = FunctionUtils.noop,
  } = props;

  const styles = getStyles(circleSize, iconSize, countColor, circleBackgroundColor, bottomOffset);
  return (
    <TouchableOpacity style={[styles.container, containerStyle && containerStyle]} onPress={onPress}>
      <Icon name={iconName} size={iconSize} color={iconColor} />
      <View style={styles.circleView}>
        <Label textType="semiBold" type="regular" style={styles.count}>
          {count}
        </Label>
      </View>
    </TouchableOpacity>
  );
};

export default IconWithCount;

interface IStyles {
  container: ViewStyle;
  circleView: ViewStyle;
  count: TextStyle;
}

const getStyles = (
  circleSize: number,
  iconSize: number,
  countColor: string,
  circleBackgroundColor: string,
  bottomOffset: number
): IStyles => {
  const circleDimensions = circleSize / 3;
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
    },
    circleView: {
      width: circleDimensions,
      height: circleDimensions,
      borderRadius: circleSize,
      justifyContent: 'center',
      alignItems: 'center',
      padding: circleSize / 10,
      position: 'absolute',
      left: iconSize / 1.5,
      bottom: bottomOffset,
      backgroundColor: circleBackgroundColor,
    },
    count: {
      color: countColor,
    },
  });
  return styles;
};
