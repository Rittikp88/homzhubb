import React from 'react';
import { StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';

export interface ISelectionPicker {
  title: string;
  value: number;
}

interface IProps {
  data: ISelectionPicker[];
  selectedItem: number[];
  onValueChange: (selectedValue: number) => void;
  optionWidth?: number;
  testID?: string;
}

export class SelectionPicker extends React.PureComponent<IProps, {}> {
  public render = (): React.ReactNode => {
    const { data } = this.props;
    return (
      <FlatList<ISelectionPicker>
        horizontal
        showsHorizontalScrollIndicator={false}
        data={data}
        renderItem={this.renderItem}
        ItemSeparatorComponent={this.renderSeparator}
        keyExtractor={this.keyExtractor}
        style={styles.container}
      />
    );
  };

  public renderItem = ({ item, index }: { item: ISelectionPicker; index: number }): React.ReactElement => {
    const { onValueChange, selectedItem } = this.props;

    const selected = selectedItem.includes(item.value);
    let color = theme.colors.darkTint4;
    let backgroundColor = theme.colors.white;

    if (selected) {
      color = theme.colors.white;
      backgroundColor = theme.colors.active;
    }

    const onPress = (): void => onValueChange(item.value);

    return (
      <TouchableOpacity onPress={onPress} style={[styles.item, { backgroundColor }]} key={`item-${index}`}>
        <Text type="small" textType="semiBold" style={{ color }}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  private renderSeparator = (): React.ReactElement => <Divider containerStyles={styles.divider} />;

  private keyExtractor = (item: ISelectionPicker, index: number): string => index.toString();
}

const styles = StyleSheet.create({
  container: {
    borderColor: theme.colors.primaryColor,
    borderRadius: 4,
    borderWidth: 1.5,
  },
  item: {
    width: (theme.viewport.width - 48) / 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  divider: {
    borderColor: theme.colors.disabled,
    borderWidth: 0.7,
    marginVertical: 4,
  },
});
