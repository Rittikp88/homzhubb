import React from 'react';
import { StyleSheet, TouchableOpacity, StyleProp, ViewStyle, LayoutChangeEvent, View } from 'react-native';
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
      <View style={[styles.container, containerStyles]} onLayout={this.onLayout}>
        {data.map(this.renderItem)}
      </View>
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
        style={[
          styles.itemContainer,
          { backgroundColor },
          index === 0 && styles.firstItem,
          isLastIndex && styles.lastItem,
        ]}
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

    this.setState({ tabWidth: width / data.length });
  };
}

const BORDER_RADIUS = 4;
const BORDER_WIDTH = 1.5;
const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    borderRadius: BORDER_RADIUS,
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
    borderTopWidth: BORDER_WIDTH,
    borderTopColor: theme.colors.active,
    borderBottomWidth: BORDER_WIDTH,
    borderBottomColor: theme.colors.active,
  },
  firstItem: {
    borderStartWidth: BORDER_WIDTH,
    borderStartColor: theme.colors.active,
    borderTopStartRadius: BORDER_RADIUS,
    borderBottomStartRadius: BORDER_RADIUS,
    borderBottomWidth: BORDER_WIDTH,
    borderBottomColor: theme.colors.active,
    borderTopWidth: BORDER_WIDTH,
    borderTopColor: theme.colors.active,
  },
  lastItem: {
    borderEndWidth: BORDER_WIDTH,
    borderEndColor: theme.colors.active,
    borderTopEndRadius: BORDER_RADIUS,
    borderBottomEndRadius: BORDER_RADIUS,
    borderBottomWidth: BORDER_WIDTH,
    borderBottomColor: theme.colors.active,
    borderTopWidth: BORDER_WIDTH,
    borderTopColor: theme.colors.active,
  },
});
