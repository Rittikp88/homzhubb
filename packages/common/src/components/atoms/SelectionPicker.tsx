import React from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';

export interface ISelectionPicker {
  title: string;
  value: number;
}

interface IItem {
  item: ISelectionPicker;
  index: number;
}

interface IProps {
  data: ISelectionPicker[];
  selectedItem: number[];
  onValueChange: (selectedValue: number) => void;
  optionWidth?: number;
  testID?: string;
}

class SelectionPicker extends React.PureComponent<IProps, {}> {
  public render(): React.ReactElement {
    const { data } = this.props;
    return (
      <View style={styles.container}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={data}
          renderItem={(item: IItem): React.ReactElement => this.renderItem(item)}
          keyExtractor={this.keyExtractor}
          testID="ftlist"
        />
      </View>
    );
  }

  public renderItem({ item, index }: IItem): React.ReactElement {
    const { onValueChange, data, selectedItem, optionWidth = (theme.viewport.width - 35) / 2 } = this.props;
    const selected = selectedItem.includes(item.value);
    const dataLength = data.length;
    const isLastIndex = index === dataLength - 1;
    const conditionalStyle = createConditionalStyles(selected, optionWidth);
    const onPress = (): void => onValueChange(item.value);
    return (
      <TouchableOpacity onPress={onPress} style={styles.item} testID="to">
        <View
          style={[styles.optionWrapper, conditionalStyle.selectedItem, conditionalStyle.itemWidth]}
          key={`item-${index}`}
        >
          <Text type="small" textType="semiBold" style={conditionalStyle.itemStyle}>
            {item.title}
          </Text>
        </View>
        {!isLastIndex && <Divider containerStyles={styles.divider} key={`divider-${index}`} />}
      </TouchableOpacity>
    );
  }

  private keyExtractor = (item: ISelectionPicker, index: number): string => index.toString();
}

export { SelectionPicker };

const styles = StyleSheet.create({
  container: {
    borderColor: theme.colors.primaryColor,
    borderWidth: 1.5,
    borderRadius: 4,
  },
  divider: {
    borderColor: theme.colors.disabled,
    borderWidth: 0.5,
    marginTop: 6,
    height: 25,
  },
  optionWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 7,
  },
  item: {
    flexDirection: 'row',
  },
});

const createConditionalStyles = (isSelected: boolean, optionWidth?: number): any => ({
  itemStyle: {
    color: isSelected ? theme.colors.white : theme.colors.darkTint4,
  },
  selectedItem: {
    backgroundColor: isSelected ? theme.colors.primaryColor : theme.colors.white,
  },
  itemWidth: {
    width: optionWidth,
  },
});
