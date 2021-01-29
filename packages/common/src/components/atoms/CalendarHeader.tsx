import React from 'react';
import { StyleSheet, View } from 'react-native';
import moment from 'moment';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Text } from '@homzhub/common/src/components/atoms/Text';

interface IProps {
  isAllowPastDate?: boolean;
  headerTitle?: string;
  headerYear?: string;
  yearTitle?: string;
  isMonthView?: boolean;
  isYearView?: boolean;
  isCurrentMonth?: boolean;
  maxDate?: string;
  month?: number;
  onBackPress?: () => void;
  onNextPress?: () => void;
  onMonthPress?: () => void;
  onYearPress?: () => void;
}

const CalendarHeader = (props: IProps): React.ReactElement => {
  const {
    isAllowPastDate,
    maxDate,
    onBackPress,
    onNextPress,
    onMonthPress,
    onYearPress,
    isCurrentMonth,
    headerTitle,
    headerYear,
    isMonthView = false,
    isYearView = false,
    yearTitle,
    month,
  } = props;
  const isNextDisable =
    maxDate && (moment(maxDate).month() === moment().month() || (month && moment(maxDate).month() === month));
  return (
    <>
      <View style={styles.headerContainer}>
        <Icon
          name={icons.leftArrow}
          onPress={onBackPress}
          size={22}
          color={!isAllowPastDate && isCurrentMonth && !isYearView ? theme.colors.disabled : theme.colors.primaryColor}
        />
        {!isYearView && !isMonthView && (
          <Text type="small" textType="semiBold" onPress={onMonthPress} style={styles.headerTitle}>
            {headerTitle}
          </Text>
        )}
        {isMonthView && (
          <Text type="small" textType="semiBold" onPress={onYearPress} style={styles.headerTitle}>
            {headerYear}
          </Text>
        )}
        {isYearView && (
          <Text type="small" textType="semiBold" style={styles.headerTitle}>
            {yearTitle}
          </Text>
        )}
        <Icon
          name={icons.rightArrow}
          size={22}
          color={isNextDisable ? theme.colors.disabled : theme.colors.primaryColor}
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
  headerTitle: {
    color: theme.colors.primaryColor,
  },
});
