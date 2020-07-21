import React from 'react';
import { StyleProp, StyleSheet, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Label, TextSizeType } from '@homzhub/common/src/components/atoms/Text';

interface ICheckboxOptions {
  selected: boolean;
  label: string;
  onToggle: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  iconSize?: number;
  iconStyle?: object;
  iconSelectedStyle?: object;
  labelType?: TextSizeType;
}

const RNCheckbox = (props: ICheckboxOptions): React.ReactElement => {
  const {
    label = '',
    selected = false,
    containerStyle = {},
    labelStyle = {},
    iconSize = 22,
    iconStyle = {},
    iconSelectedStyle = {},
    labelType = 'large',
    onToggle,
  } = props;
  return (
    <TouchableOpacity style={[styles.container, containerStyle]} onPress={onToggle}>
      <Icon
        name={selected ? icons.checkboxOn : icons.checkboxOff}
        size={iconSize}
        color={selected ? theme.colors.primaryColor : theme.colors.disabled}
        style={selected ? iconSelectedStyle : iconStyle}
      />
      <Label type={labelType} textType="regular" style={[styles.label, labelStyle]}>
        {label}
      </Label>
    </TouchableOpacity>
  );
};

export { RNCheckbox };

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    marginStart: 12,
    width: 135, // TODO: Remove the rigid width
  },
});
