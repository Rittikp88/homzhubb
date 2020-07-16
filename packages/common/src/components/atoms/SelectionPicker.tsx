import React from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';

interface ISelectionPicker {
  title: string;
  value: number;
}

interface IItem {
  item: ISelectionPicker;
  index: number;
}

interface IProps {
  data: ISelectionPicker[];
  selectedItem: number;
  onValueChange: (selectedValue: number) => void;
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
        />
      </View>
    );
  }

  public renderItem({ item, index }: IItem): React.ReactElement {
    const { onValueChange, data, selectedItem } = this.props;
    const selected = item.value === selectedItem;
    const dataLength = data.length;
    const isLastIndex = index === dataLength - 1;
    const conditionalStyle = createConditionalStyles(selected);
    const onPress = (): void => onValueChange(item.value);
    return (
      <TouchableOpacity onPress={onPress} style={styles.item}>
        <View style={[styles.optionWrapper, conditionalStyle.selectedItem]} key={`item-${index}`}>
          <Text type="regular" textType="semiBold" style={conditionalStyle.itemStyle}>
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
    borderWidth: 1,
    borderRadius: 4,
    margin: theme.layout.screenPadding,
  },
  divider: {
    borderColor: theme.colors.disabled,
    borderWidth: 0.8,
    marginTop: 5,
    height: 38,
  },
  optionWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    width: 180,
  },
  item: {
    flexDirection: 'row',
  },
});

const createConditionalStyles = (isSelected: boolean): any => ({
  itemStyle: {
    color: isSelected ? theme.colors.white : theme.colors.darkTint4,
  },
  selectedItem: {
    backgroundColor: isSelected ? theme.colors.primaryColor : theme.colors.white,
  },
});
