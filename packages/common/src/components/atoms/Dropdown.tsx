import React from 'react';
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

interface IState {
  dropdownVisible: boolean;
}
// TODO: Add Translation for default list title
export class Dropdown extends React.PureComponent<IProps, IState> {
  public state = {
    dropdownVisible: false,
  };

  public render(): React.ReactNode {
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
      containerStyle = {},
      textStyle = {},
      icon = icons.downArrowFilled,
      testID,
      maxLabelLength = MAX_LABEL_COUNT,
      numColumns = 1,
    } = this.props;
    const { dropdownVisible } = this.state;
    const selectedItem = data.find((d: PickerItemProps) => d.value === value);
    const label =
      selectedItem?.label && selectedItem?.label.length > maxLabelLength
        ? `${(selectedItem?.label).substring(0, maxLabelLength)}...`
        : selectedItem?.label;

    return (
      <View pointerEvents={disable ? 'none' : 'auto'}>
        <TouchableOpacity onPress={this.openDropdown} style={[styles.container, containerStyle]}>
          <Label type="large" textType="regular" style={textStyle}>
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
          listTitle={listTitle ?? 'Select From here'}
          listHeight={listHeight}
          isBottomSheetVisible={dropdownVisible}
          onCloseDropDown={this.onCancel}
          onSelectItem={this.onValueChange}
          testID={testID}
          numColumns={numColumns}
        />
      </View>
    );
  }

  public onValueChange = (value: string | number): void => {
    const { placeholder, onDonePress } = this.props;
    const selectedValue = value === placeholder ? '' : value;
    if (onDonePress) {
      onDonePress(selectedValue);
      this.closeDropdown();
    }
  };

  public onCancel = (): void => this.closeDropdown();

  public openDropdown = (): void => this.setState({ dropdownVisible: true });

  public closeDropdown = (): void => this.setState({ dropdownVisible: false });
}

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
});
