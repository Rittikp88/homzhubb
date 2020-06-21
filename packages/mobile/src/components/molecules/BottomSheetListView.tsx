import React, { Component } from 'react';
import { FlatList, PickerItemProps } from 'react-native';
import { ListItem } from '@homzhub/common/src/components/atoms/ListItem';
import { BottomSheet } from '@homzhub/mobile/src/components/molecules/BottomSheet';

interface IProps {
  data: PickerItemProps[];
  selectedValue: string;
  listTitle: string;
  listHeight?: number;
  isBottomSheetVisible: boolean;
  onCloseDropDown: () => void;
  onSelectItem: (value: string) => void;
}

export class BottomSheetListView extends Component<IProps> {
  public render(): React.ReactNode {
    const { isBottomSheetVisible, onCloseDropDown, selectedValue, listTitle, data, listHeight = 750 } = this.props;
    return (
      <BottomSheet
        isShadowView
        sheetHeight={listHeight}
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
