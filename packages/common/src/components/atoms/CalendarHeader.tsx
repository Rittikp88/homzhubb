import React from 'react';
import { StyleProp, StyleSheet, TextStyle, View } from 'react-native';
import moment from 'moment';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Text } from '@homzhub/common/src/components/atoms/Text';

interface IProps {
  isAllowPastDate?: boolean;
  headerTitle?: string;
  isMonthView?: boolean;
  isCurrentMonth?: boolean;
  maxDate?: string;
  onBackPress?: () => void;
  onNextPress?: () => void;
  onMonthPress?: () => void;
}

const CalendarHeader = (props: IProps): React.ReactElement => {
  const {
    isAllowPastDate,
    maxDate,
    onBackPress,
    onNextPress,
    onMonthPress,
    isCurrentMonth,
    headerTitle,
    isMonthView = false,
  } = props;
  return (
    <>
      <View style={styles.headerContainer}>
        <Icon
          name={icons.leftArrow}
          onPress={onBackPress}
          size={22}
          color={!isAllowPastDate && isCurrentMonth ? theme.colors.disabled : theme.colors.primaryColor}
        />
        <Text
          type="small"
          textType="semiBold"
          onPress={onMonthPress}
          style={StyleSheet.flatten([customStyles.headerTitle(isMonthView)])}
        >
          {headerTitle}
        </Text>
        <Icon
          name={icons.rightArrow}
          size={22}
          color={
            maxDate && moment(maxDate).month() === moment().month() ? theme.colors.disabled : theme.colors.primaryColor
          }
          onPress={onNextPress}
        />
      </View>
      <Divider />
    </>
  );
};

export default CalendarHeader;

const styles = StyleSheet.create({
  headerContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
});

const customStyles = {
  headerTitle: (isMonthView: boolean): StyleProp<TextStyle> => ({
    color: isMonthView ? theme.colors.darkTint2 : theme.colors.primaryColor,
  }),
};
