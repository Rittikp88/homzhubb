import React from 'react';
import {
  GestureResponderEvent,
  ImageStyle,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon from '@homzhub/common/src/assets/icon';
import { FontWeightType, Label, Text, TextFieldType, TextSizeType } from '@homzhub/common/src/components/atoms/Text';

export type ButtonType = 'primary' | 'secondary' | 'secondaryOutline';

export interface IButtonProps {
  type: ButtonType;
  node?: React.ReactNode;
  children?: React.ReactNode;
  title?: string;
  onPress?: (event?: GestureResponderEvent) => void;
  disabled?: boolean;
  activeOpacity?: number;
  titleStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  textType?: TextFieldType;
  textSize?: TextSizeType;
  fontType?: FontWeightType;
  icon?: string;
  iconSize?: number;
  iconColor?: string;
  iconStyle?: StyleProp<ImageStyle>;
  testID?: string;
}

export class Button extends React.PureComponent<IButtonProps> {
  public render = (): React.ReactElement => {
    const {
      onPress,
      disabled = false,
      activeOpacity = 0.5,
      title,
      icon,
      iconSize,
      iconColor,
      iconStyle,
      testID,
      node,
      children,
    } = this.props;
    return (
      <TouchableOpacity
        activeOpacity={activeOpacity}
        onPress={onPress}
        disabled={disabled}
        style={this.getContainerStyle()}
        testID={testID}
      >
        {title && this.getTextField()}
        {!!icon && <Icon name={icon} size={iconSize} color={iconColor} style={iconStyle} />}
        {node && node}
        {children && children}
      </TouchableOpacity>
    );
  };

  private getTextField = (): React.ReactElement => {
    const { textType, title, textSize = 'small', fontType = 'semiBold' } = this.props;
    let TextField = Text;

    if (textType === 'label') {
      TextField = Label;
    }

    return (
      <TextField type={textSize} textType={fontType} style={this.getTextStyle()}>
        {title}
      </TextField>
    );
  };

  private getContainerStyle = (): ViewStyle => {
    const { disabled, type, containerStyle = {} } = this.props;
    let themedStyle: StyleProp<ViewStyle> = styles.primary;
    if (disabled) {
      themedStyle = styles.disabled;
    }

    if (type === 'secondary' && !disabled) {
      themedStyle = styles.secondary;
    }

    if (type === 'secondaryOutline' && !disabled) {
      themedStyle = styles.secondaryOutline;
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
    ...theme.globalStyles.center,
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
  secondaryOutline: {
    borderWidth: 0.5,
    borderColor: theme.colors.white,
  },
});
