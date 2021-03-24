import React from 'react';
import { FlatList, PickerItemProps } from 'react-native';
import { Dropdown } from '@homzhub/common/src/components/atoms/Dropdown';

interface IDropdownData {
  dropdownData: PickerItemProps;
  selectedValue: string;
}

interface IProps {
  data: IDropdownData[];
}

interface IScreenState {
  data: IDropdownData[];
}
class ScrollableDropdownList extends React.PureComponent<IProps, IScreenState> {
  constructor(props: IProps) {
    super(props);

    const { data } = this.props;
    this.state = {
      data,
    };
  }

  public render(): React.ReactElement {
    const { data } = this.state;

    return <FlatList data={data} renderItem={this.renderDropdown} />;
  }

  private renderDropdown = ({ item, index }: { item: IDropdownData; index: number }): React.ReactElement => {
    const { dropdownData, selectedValue } = item;

    return <Dropdown data={dropdownData} value={selectedValue} onDonePress={this.onDropdownSelect} />;
  };

  private onDropdownSelect = (value: string, index: number): void => {
    if (index < 0) {
      return;
    }

    this.setState((oldState: IScreenState) => {
      const updatedData = [...oldState.data];
      updatedData[index].selectedValue = value;

      return { data: updatedData };
    });
  };
}

export default ScrollableDropdownList;
