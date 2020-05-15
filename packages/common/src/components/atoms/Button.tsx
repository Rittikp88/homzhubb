import React from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  StyleProp,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon from '@homzhub/common/src/assets/icon';

export type ButtonType = 'primary' | 'secondary';

export interface IButtonProps {
  type: ButtonType;
  title?: string;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  titleStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  icon?: string;
  iconSize?: number;
  iconColor?: string;
  iconStyle?: StyleProp<ImageStyle>;
}

export class Button extends React.PureComponent<IButtonProps> {
  public render = (): React.ReactElement => {
    const { onPress, title, disabled = false, icon, iconSize, iconColor, iconStyle } = this.props;
    return (
      <TouchableOpacity onPress={onPress} disabled={disabled} style={this.getContainerStyle()}>
        {title && (
          <Text type="small" textType="semiBold" style={this.getTextStyle()}>
            {title}
          </Text>
        )}
        {icon && <Icon name={icon} size={iconSize} color={iconColor} style={iconStyle} />}
      </TouchableOpacity>
    );
  };

  private getContainerStyle = (): ViewStyle => {
    const { disabled, type, containerStyle = {} } = this.props;
    let themedStyle = styles.primary;
    if (disabled) {
      themedStyle = styles.disabled;
    }

    if (type === 'secondary' && !disabled) {
      themedStyle = styles.secondary;
    }
    return StyleSheet.flatten([styles.container, themedStyle, containerStyle]);
  };

  private getTextStyle = (): TextStyle => {
    const { type, disabled = false, titleStyle = {} } = this.props;
    let themedStyle = {};
    if (type === 'secondary' && !disabled) {
      themedStyle = { color: theme.colors.active };
    }
    return StyleSheet.flatten([styles.textStyle, themedStyle, titleStyle]);
  };
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
  },
  textStyle: {
    textAlign: 'center',
    color: theme.colors.white,
    marginVertical: 12,
    marginHorizontal: 36,
  },
  disabled: {
    backgroundColor: theme.colors.disabled,
  },
  primary: {
    backgroundColor: theme.colors.primaryColor,
  },
  secondary: {
    borderWidth: 1,
    borderColor: theme.colors.active,
    backgroundColor: theme.colors.white,
  },
});
