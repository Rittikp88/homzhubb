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

export interface IProps {
  data: PickerItemProps[];
  value: number | string;
  onDonePress: (value: string | number) => void;
  icon?: string;
  listTitle?: string;
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
}

interface IState {
  dropdownVisible: boolean;
}

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
      disable = false,
      placeholder = '',
      containerStyle = {},
      textStyle = {},
      icon = icons.downArrowFilled,
    } = this.props;
    const { dropdownVisible } = this.state;
    const selectedItem = data.find((d: PickerItemProps) => d.value === value);
    return (
      <View pointerEvents={disable ? 'none' : 'auto'}>
        <TouchableOpacity onPress={this.openDropdown} style={[styles.container, containerStyle]}>
          <Label type="large" textType="regular" style={textStyle}>
            {selectedItem?.label ?? placeholder}
          </Label>
          <Icon name={icon} size={iconSize ?? 16} color={iconColor ?? theme.colors.disabled} style={iconStyle} />
        </TouchableOpacity>
        <BottomSheetListView
          data={data}
          selectedValue={selectedItem?.value ?? ''}
          listTitle={listTitle ?? 'Select From here'}
          isBottomSheetVisible={dropdownVisible}
          onCloseDropDown={this.onCancel}
          onSelectItem={this.onValueChange}
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
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: theme.colors.disabled,
  },
});
