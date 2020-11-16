import React from 'react';
import { StyleSheet, TouchableOpacity, StyleProp, ViewStyle, ScrollView, LayoutChangeEvent } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';

export interface ISelectionPicker<T> {
  title: string;
  value: T;
}

interface IProps<T> {
  data: ISelectionPicker<T>[];
  selectedItem: T[];
  onValueChange: (selectedValue: T) => void;
  itemWidth?: number;
  containerStyles?: StyleProp<ViewStyle>;
  testID?: string;
}

interface IOwnState {
  tabWidth: number;
}

export class SelectionPicker<T> extends React.PureComponent<IProps<T>, IOwnState> {
  public state = {
    tabWidth: theme.viewport.width / 2,
  };

  public render(): React.ReactElement {
    const { data, containerStyles } = this.props;
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.container, containerStyles]}
        onLayout={this.onLayout}
      >
        {data.map(this.renderItem)}
      </ScrollView>
    );
  }

  public renderItem = (item: ISelectionPicker<T>, index: number): React.ReactElement => {
    const { onValueChange, data, selectedItem, itemWidth } = this.props;
    const { tabWidth } = this.state;

    const selected = selectedItem.includes(item.value);
    const isLastIndex = index === data.length - 1;

    // Styling
    let color = theme.colors.active;
    let backgroundColor = theme.colors.white;
    if (selected) {
      color = theme.colors.white;
      backgroundColor = theme.colors.active;
    }
    // event
    const onPress = (): void => onValueChange(item.value);

    return (
      <TouchableOpacity
        key={`${item.value}`}
        onPress={onPress}
        style={[styles.itemContainer, { backgroundColor }]}
        testID="to"
      >
        <Text type="small" textType="semiBold" style={[styles.item, { color, width: itemWidth ?? tabWidth }]}>
          {item.title}
        </Text>
        {!isLastIndex && <Divider containerStyles={styles.divider} />}
      </TouchableOpacity>
    );
  };

  private onLayout = (e: LayoutChangeEvent): void => {
    const { width } = e.nativeEvent.layout;
    const { data, itemWidth } = this.props;

    if (itemWidth) return;

    this.setState({ tabWidth: (width - 4) / data.length });
  };
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1.5,
    borderRadius: 4,
    borderColor: theme.colors.primaryColor,
  },
  divider: {
    height: '100%',
    borderColor: theme.colors.disabled,
    borderWidth: 0.5,
  },
  item: {
    textAlign: 'center',
    padding: 8,
  },
  itemContainer: {
    flexDirection: 'row',
  },
});
