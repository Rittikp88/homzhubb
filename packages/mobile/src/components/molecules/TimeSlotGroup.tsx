import React from 'react';
import { TouchableOpacity, StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { isArray } from 'lodash';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import Icon from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label, TextFieldType, TextSizeType, FontWeightType } from '@homzhub/common/src/components';

// TODO: (Need to Move)
export interface ISlotItem {
  id: number;
  from: number;
  to: number;
  icon: string;
  formatted: string;
}

interface ITimeSlotProps {
  data: ISlotItem[];
  onItemSelect: (id: number) => void;
  selectedItem: number[] | number;
  selectedDate?: string;
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
    const { selectedItem, onItemSelect, fontType = 'regular', buttonItemStyle = {}, selectedDate = '' } = this.props;
    const isDisabled = DateUtils.isPastTime(item.from, selectedDate);
    let isSelected;
    if (isArray(selectedItem)) {
      isSelected = selectedItem.includes(item.id);
    } else {
      isSelected = selectedItem === item.id;
    }

    // Styles
    const textStyle = StyleSheet.flatten([styles.textStyle, isSelected && styles.selectedTextStyle]);
    const buttonItemContainerStyle = StyleSheet.flatten([
      styles.item,
      isSelected && styles.selectedContainerStyle,
      isDisabled && styles.disabledStyle,
      buttonItemStyle,
    ]);

    const onItemPress = (): void => onItemSelect(item.id);

    return (
      <TouchableOpacity
        activeOpacity={isDisabled ? 1 : 0.5}
        onPress={!isDisabled ? onItemPress : FunctionUtils.noop}
        style={buttonItemContainerStyle}
        key={item.id}
        testID="selectSlot"
      >
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
  disabledStyle: {
    backgroundColor: theme.colors.darkTint10,
  },
});
