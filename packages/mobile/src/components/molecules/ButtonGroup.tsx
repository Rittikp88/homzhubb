import React from 'react';
import { TouchableOpacity, StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text, Label, TextFieldType, TextSizeType, FontWeightType } from '@homzhub/common/src/components';

interface IButtonGroupItem<T> {
  title: string;
  value: T;
}

interface IButtonGroupProps<T> {
  data: IButtonGroupItem<T>[];
  onItemSelect: (value: T) => void;
  selectedItem: T;
  totalItems: number;
  containerStyle?: StyleProp<ViewStyle>;
  textType?: TextFieldType;
  textSize?: TextSizeType;
  fontType?: FontWeightType;
}

export class ButtonGroup<T> extends React.PureComponent<IButtonGroupProps<T>> {
  public render(): React.ReactElement {
    const { data } = this.props;
    return (
      <View style={styles.container}>
        {data.map((item: IButtonGroupItem<T>) => {
          return this.renderItem(item);
        })}
      </View>
    );
  }

  public renderItem = (item: IButtonGroupItem<T>): React.ReactElement => {
    const {
      selectedItem,
      onItemSelect,
      totalItems,
      textType = 'label',
      textSize = 'large',
      fontType = 'regular',
      containerStyle = {},
    } = this.props;
    let TextField = Label;

    if (textType === 'text') {
      TextField = Text;
    }

    // Styles
    const isSelected = item.value === selectedItem;
    const textStyle = StyleSheet.flatten([styles.textStyle, isSelected && styles.selectedTextStyle]);
    const buttonItemContainerStyle = StyleSheet.flatten([
      styles.item,
      isSelected && styles.selectedContainerStyle,
      totalItems > 2 && { flex: 1 },
      containerStyle,
    ]);

    const onItemPress = (): void => onItemSelect(item.value);

    return (
      <TouchableOpacity onPress={onItemPress} style={buttonItemContainerStyle} key={item.title}>
        <TextField type={textSize} textType={fontType} style={textStyle}>
          {item.title}
        </TextField>
      </TouchableOpacity>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexGrow: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginTop: 16,
  },
  item: {
    marginEnd: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: theme.colors.disabled,
    backgroundColor: theme.colors.white,
  },
  selectedContainerStyle: {
    backgroundColor: theme.colors.primaryColor,
  },
  textStyle: {
    color: theme.colors.darkTint5,
  },
  selectedTextStyle: {
    color: theme.colors.white,
  },
});
