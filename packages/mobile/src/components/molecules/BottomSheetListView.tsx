import React, { Component } from 'react';
import { FlatList, PickerItemProps } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { ListItem } from '@homzhub/common/src/components/atoms/ListItem';
import { BottomSheet } from '@homzhub/mobile/src/components/molecules/BottomSheet';

interface IProps<T> {
  data: PickerItemProps[];
  selectedValue: string;
  listTitle: string;
  listHeight?: number;
  isBottomSheetVisible: boolean;
  onCloseDropDown: () => void;
  onSelectItem: (value: T) => void;
  testID?: string;
  numColumns?: number;
}

export class BottomSheetListView<T> extends Component<IProps<T>> {
  public render(): React.ReactNode {
    const {
      isBottomSheetVisible,
      onCloseDropDown,
      selectedValue,
      listTitle,
      data,
      listHeight = 750,
      numColumns = 1,
    } = this.props;
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
          numColumns={numColumns}
          // @ts-ignore
          ItemSeparatorComponent={this.itemSeparator}
        />
      </BottomSheet>
    );
  }

  private renderSheetItem = ({ item, index }: { item: PickerItemProps; index: number }): React.ReactElement => {
    const { selectedValue, onSelectItem, testID, numColumns = 1 } = this.props;
    const conditionalStyle = customizedStyles(numColumns);
    const onItemSelect = (): void => onSelectItem(item.value);
    const isCheck: boolean = selectedValue === item.value;
    return (
      <ListItem
        listItem={item}
        isCheck={isCheck}
        onItemSelect={onItemSelect}
        key={index}
        testID={testID}
        listItemViewStyle={conditionalStyle.item}
      />
    );
  };

  private renderKeyExtractor = (item: PickerItemProps, index: number): string => {
    const { value } = item;
    return `${value}-${index}`;
  };

  private itemSeparator = (): React.ReactNode => {
    const { numColumns } = this.props;
    if (numColumns && numColumns > 1) {
      return null;
    }
    return <Divider />;
  };
}

const customizedStyles = (numColumns: number): any => ({
  item: {
    width: numColumns > 1 ? theme.viewport.width / 2.5 : theme.viewport.width,
    color: theme.colors.darkTint5,
  },
});
