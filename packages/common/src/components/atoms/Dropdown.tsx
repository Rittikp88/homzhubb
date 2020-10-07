import React, { useState } from 'react';
import {
  StyleSheet,
  StyleProp,
  ViewStyle,
  PickerItemProps,
  View,
  ImageStyle,
  TouchableOpacity,
  TextStyle,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { BottomSheetListView } from '@homzhub/mobile/src/components/molecules/BottomSheetListView';

const MAX_LABEL_COUNT = 12;

export interface IProps {
  data: PickerItemProps[];
  value: number | string;
  onDonePress: (value: string | number) => void;
  icon?: string;
  listTitle?: string;
  listHeight?: number;
  disable?: boolean;
  placeholder?: string;
  iosDropdownStyle?: object;
  androidDropdownStyle?: object;
  androidContainerStyle?: StyleProp<ViewStyle>;
  iconColor?: string;
  iconSize?: number;
  iconStyle?: StyleProp<ImageStyle>;
  itemStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
  maxLabelLength?: number;
  numColumns?: number;
}

export const Dropdown = (props: IProps): React.ReactElement => {
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const { t } = useTranslation();
  const {
    value,
    data,
    iconColor,
    iconSize,
    iconStyle,
    listTitle,
    listHeight,
    disable = false,
    placeholder = '',
    onDonePress,
    containerStyle = {},
    textStyle = {},
    icon = icons.downArrowFilled,
    testID,
    maxLabelLength = MAX_LABEL_COUNT,
    numColumns = 1,
  } = props;

  const onValueChange = (changedValue: string | number): void => {
    const selectedValue = changedValue === placeholder ? '' : changedValue;
    if (onDonePress) {
      onDonePress(selectedValue);
      closeDropdown();
    }
  };

  const openDropdown = (): void => setDropdownVisible(true);
  const closeDropdown = (): void => setDropdownVisible(false);

  const selectedItem = data.find((d: PickerItemProps) => d.value === value);
  const label =
    selectedItem?.label && selectedItem?.label.length > maxLabelLength
      ? `${(selectedItem?.label).substring(0, maxLabelLength)}...`
      : selectedItem?.label;
  const placeholderColor = !label ? styles.placeholderColor : {};

  const disabledStyles = StyleSheet.flatten([disable && styles.disabled]);

  return (
    <View pointerEvents={disable ? 'none' : 'auto'} style={disabledStyles}>
      <TouchableOpacity onPress={openDropdown} style={[styles.container, containerStyle]}>
        <Label type="large" textType="regular" style={[placeholderColor, textStyle]}>
          {label ?? placeholder}
        </Label>
        <Icon
          name={icon}
          size={iconSize ?? 16}
          color={iconColor ?? theme.colors.disabled}
          style={[styles.iconStyle, iconStyle]}
        />
      </TouchableOpacity>
      <BottomSheetListView
        data={data}
        selectedValue={selectedItem?.value ?? ''}
        listTitle={listTitle ?? t('common:selectFromHere')}
        listHeight={listHeight}
        isBottomSheetVisible={dropdownVisible}
        onCloseDropDown={closeDropdown}
        onSelectItem={onValueChange}
        testID={testID}
        numColumns={numColumns}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: theme.colors.disabled,
  },
  iconStyle: {
    marginStart: 8,
  },
  placeholderColor: {
    color: theme.colors.darkTint8,
  },
  disabled: {
    opacity: 0.5,
  },
});
