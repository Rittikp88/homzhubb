import React from 'react';
import { FlatList, PickerItemProps, View, StyleSheet } from 'react-native';
import { Dropdown } from '@homzhub/common/src/components/atoms/Dropdown';

interface IDropdownData {
  dropdownData: PickerItemProps[];
  selectedValue: string;
}

interface IProps {
  data: IDropdownData[];
  onDropdown: (selectedValues: string[]) => void;
}

interface IScreenState {
  data: IDropdownData[];
  selectedValues: string[];
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
    const { dropdownData, selectedValue } = item;

    return <Dropdown data={dropdownData} value={selectedValue} onDonePress={this.onDropdownSelect} />;
  };

  private onDropdownSelect = (value: string, index: number): void => {
    if (index < 0) {
      return;
    }

    this.setState(
      (oldState: IScreenState): IScreenState => {
        const { onDropdown } = this.props;

        const updatedData = [...oldState.data];
        updatedData[index].selectedValue = value;
        const updatedSelectedValues = [...oldState.selectedValues];
        updatedSelectedValues[index] = value;

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
});
