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
  containerStyle?: StyleProp<ViewStyle>;
  buttonItemStyle?: StyleProp<ViewStyle>;
  textType?: TextFieldType;
  textSize?: TextSizeType;
  fontType?: FontWeightType;
  testID?: string;
}

export class ButtonGroup<T> extends React.PureComponent<IButtonGroupProps<T>> {
  public render(): React.ReactElement {
    const { data, containerStyle = {} } = this.props;
    return (
      <View style={[styles.container, containerStyle]}>
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
      textType = 'label',
      textSize = 'large',
      fontType = 'regular',
      buttonItemStyle = {},
      testID = 'btngrp',
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
      buttonItemStyle,
    ]);

    const onItemPress = (): void => onItemSelect(item.value);

    return (
      <TouchableOpacity onPress={onItemPress} style={buttonItemContainerStyle} key={item.title} testID={testID}>
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
