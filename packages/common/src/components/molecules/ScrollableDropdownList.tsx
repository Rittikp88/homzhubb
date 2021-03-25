import React from 'react';
import { FlatList, PickerItemProps, View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Dropdown } from '@homzhub/common/src/components/atoms/Dropdown';

export interface IDropdownData {
  key: string;
  dropdownData: PickerItemProps[];
  selectedValue: string;
  placeholder: string;
}

interface IProps {
  data: IDropdownData[];
  onDropdown: (selectedValues: ISelectedValue[]) => void;
  containerStyle?: StyleProp<ViewStyle>;
}

export interface ISelectedValue {
  key: string;
  value: string;
}

interface IScreenState {
  data: IDropdownData[];
  selectedValues: ISelectedValue[];
}
class ScrollableDropdownList extends React.PureComponent<IProps, IScreenState> {
  constructor(props: IProps) {
    super(props);

    const { data } = this.props;
    this.state = {
      data,
      selectedValues: [],
    };
  }

  public render(): React.ReactElement {
    const { data } = this.state;

    return (
      <FlatList
        horizontal
        data={data}
        renderItem={this.renderDropdown}
        ItemSeparatorComponent={this.renderItemSeparator}
        keyExtractor={this.renderKeyExtractor}
      />
    );
  }

  private renderItemSeparator = (): React.ReactElement => <View style={styles.separator} />;

  private renderKeyExtractor = (item: IDropdownData, index: number): string => `${index}`;

  private renderDropdown = ({ item, index }: { item: IDropdownData; index: number }): React.ReactElement => {
    const { dropdownData, selectedValue, placeholder } = item;
    const { containerStyle } = this.props;

    return (
      <Dropdown
        data={dropdownData}
        value={selectedValue}
        onDonePress={this.onDropdownSelect}
        dropdownIndex={index}
        placeholder={placeholder}
        containerStyle={[styles.dropdownContainer, containerStyle]}
        textStyle={styles.placeholder}
        iconColor={theme.colors.blue}
        icon={icons.downArrow}
        fontSize="large"
        fontWeight="semiBold"
        iconStyle={styles.drodownIcon}
      />
    );
  };

  private onDropdownSelect = (value: string, index: number): void => {
    if (index < 0) {
      return;
    }

    this.setState(
      (oldState: IScreenState): IScreenState => {
        const { onDropdown, data } = this.props;

        const updatedData = [...oldState.data];
        const updatedSelectedValues = [...oldState.selectedValues];

        updatedData[index].selectedValue = value;

        const { key } = data[index];
        updatedSelectedValues[index] = { key, value };

        onDropdown(updatedSelectedValues);
        return { data: updatedData, selectedValues: updatedSelectedValues };
      }
    );
  };
}

export default React.memo(ScrollableDropdownList);

const styles = StyleSheet.create({
  separator: {
    width: 12,
    height: 12,
  },
  dropdownContainer: {
    backgroundColor: theme.colors.white,
    borderWidth: 0,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  placeholder: {
    color: theme.colors.blue,
  },
  drodownIcon: {
    marginStart: 12,
  },
});
