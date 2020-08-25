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
  testID?: string;
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

  private renderSheetItem = ({ item, index }: { item: PickerItemProps; index: number }): React.ReactElement => {
    const { selectedValue, onSelectItem, testID } = this.props;
    const onItemSelect = (): void => onSelectItem(item.value);
    const isCheck: boolean = selectedValue === item.value;
    return <ListItem listItem={item} isCheck={isCheck} onItemSelect={onItemSelect} key={index} testID={testID} />;
  };

  private renderKeyExtractor = (item: PickerItemProps, index: number): string => {
    const { value } = item;
    return `${value}-${index}`;
  };
}
