import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { BottomSheet } from '@homzhub/mobile/src/components/molecules/BottomSheet';
import { ListItem } from '@homzhub/common/src/components/atoms/ListItem';
import { IDropdownOption } from '@homzhub/common/dist/components/molecules/FormDropdown';

interface IProps {
  data: IDropdownOption[];
  selectedValue: string;
  listTitle: string;
  isBottomSheetVisible: boolean;
  onCloseDropDown: () => void;
  onSelectItem: (value: string) => void;
}

export class BottomSheetListView extends Component<IProps> {
  public render(): React.ReactNode {
    const { isBottomSheetVisible, onCloseDropDown, selectedValue, listTitle, data } = this.props;
    return (
      <BottomSheet
        isShadowView
        sheetHeight={750}
        headerTitle={listTitle}
        visible={isBottomSheetVisible}
        onCloseSheet={onCloseDropDown}
      >
        <FlatList
          data={data}
          renderItem={this.renderSheetItem}
          keyExtractor={this.renderKeyExtractor}
          extraData={selectedValue}
        />
      </BottomSheet>
    );
  }

  private renderSheetItem = (data: any): React.ReactElement => {
    const { item, index } = data;
    const { selectedValue, onSelectItem } = this.props;
    const onItemSelect = (): void => onSelectItem(item.value);
    const isCheck: boolean = selectedValue === item.value;
    return <ListItem listItem={item} isCheck={isCheck} onItemSelect={onItemSelect} key={index} />;
  };

  private renderKeyExtractor = (item: any, index: number): string => {
    const { value } = item;
    return `${value}-${index}`;
  };
}
