import React from 'react';
import { TouchableOpacity, StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import Icon from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label, TextFieldType, TextSizeType, FontWeightType } from '@homzhub/common/src/components';

interface ISlotItem {
  id: number;
  from: number;
  to: number;
  icon: string;
  formatted: string;
}

interface ITimeSlotProps {
  data: ISlotItem[];
  onItemSelect: (id: number) => void;
  selectedItem: number[];
  containerStyle?: StyleProp<ViewStyle>;
  buttonItemStyle?: StyleProp<ViewStyle>;
  textType?: TextFieldType;
  textSize?: TextSizeType;
  fontType?: FontWeightType;
  testID?: string;
}

export class TimeSlotGroup extends React.PureComponent<ITimeSlotProps> {
  public render(): React.ReactElement {
    const { data, containerStyle = {} } = this.props;
    return (
      <View style={[styles.container, containerStyle]}>
        {data.map((item: ISlotItem) => {
          return this.renderItem(item);
        })}
      </View>
    );
  }

  public renderItem = (item: ISlotItem): React.ReactElement => {
    const { selectedItem, onItemSelect, fontType = 'regular', buttonItemStyle = {} } = this.props;

    // Styles
    const isSelected = selectedItem.includes(item.id);
    const textStyle = StyleSheet.flatten([styles.textStyle, isSelected && styles.selectedTextStyle]);
    const buttonItemContainerStyle = StyleSheet.flatten([
      styles.item,
      isSelected && styles.selectedContainerStyle,
      buttonItemStyle,
    ]);

    const onItemPress = (): void => onItemSelect(item.id);

    return (
      <TouchableOpacity onPress={onItemPress} style={buttonItemContainerStyle} key={item.id} testID="selectSlot">
        <Icon name={item.icon} size={20} color={isSelected ? theme.colors.white : theme.colors.darkTint4} />
        <Label type="large" textType={fontType} style={textStyle}>
          {item.formatted}
        </Label>
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
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
    width: 160,
    marginRight: 18,
    marginVertical: 10,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: theme.colors.disabled,
    backgroundColor: theme.colors.white,
  },
  selectedContainerStyle: {
    backgroundColor: theme.colors.primaryColor,
  },
  textStyle: {
    color: theme.colors.darkTint4,
    marginLeft: 6,
  },
  selectedTextStyle: {
    color: theme.colors.white,
  },
});
