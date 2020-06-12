import React from 'react';
import { StyleSheet, StyleProp, ViewStyle, PickerItemProps, View, ImageStyle } from 'react-native';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { BottomSheetListView } from '@homzhub/mobile/src/components/molecules/BottomSheetListView';

export interface IProps {
  data: PickerItemProps[];
  value: number | string;
  listTitle?: string;
  onDonePress: (value: string | number) => void;
  disable?: boolean;
  placeholder?: string;
  iosDropdownStyle?: object;
  androidDropdownStyle?: object;
  androidContainerStyle?: StyleProp<ViewStyle>;
  iconColor?: string;
  iconSize?: number;
  placeholderStyle?: object;
  iconStyle?: StyleProp<ImageStyle>;
  itemStyle?: StyleProp<ViewStyle>;
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
      placeholder = '',
      disable = false,
      placeholderStyle = {},
      iconColor,
      iconSize,
      iconStyle,
      listTitle,
    } = this.props;
    const { dropdownVisible } = this.state;
    const selectedItem = data.find((d: PickerItemProps) => d.value === value);
    const placeHolderTextColor = theme.colors.disabled;
    let textColor = theme.colors.darkTint1;
    if (!selectedItem) {
      textColor = placeHolderTextColor;
    }
    return (
      <View pointerEvents={disable ? 'none' : 'auto'}>
        <Button
          containerStyle={styles.container}
          onPress={this.openDropdown}
          type="secondary"
          textType="text"
          textSize="small"
          title={selectedItem ? selectedItem.label : placeholder}
          titleStyle={[styles.titleText, placeholderStyle, { color: textColor }]}
          icon={icons.downArrowFilled}
          iconSize={iconSize || 16}
          iconColor={iconColor || theme.colors.disabled}
          iconStyle={[styles.iconStyle, iconStyle]}
        />
        <BottomSheetListView
          // @ts-ignore
          data={data}
          selectedValue={selectedItem ? selectedItem.value : ''}
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
    flex: 1,
    flexDirection: 'row',
    borderColor: theme.colors.disabled,
    borderWidth: 1,
    backgroundColor: theme.colors.white,
    justifyContent: 'space-between',
    height: PlatformUtils.isIOS() ? 43 : 53,
  },
  titleText: {
    flex: 1,
    textAlign: 'left',
    marginTop: 7,
    marginLeft: 16,
  },
  iconStyle: {
    marginRight: 10,
  },
});
