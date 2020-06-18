import React, { Component } from 'react';
import { Calendar } from 'react-native-calendars';
import { View, FlatList, TouchableOpacity, StyleSheet, StyleProp, TextStyle, ViewStyle } from 'react-native';
import moment from 'moment';
import { DateFormats, DateUtils, MonthNames } from '@homzhub/common/src/utils/DateUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider, Button, Text, Label, WithShadowView } from '@homzhub/common/src/components';

interface ICalendarProps {
  onSelect: (day: string) => void;
}

interface ICalendarState {
  isMonthView: boolean;
  selectedDay: string;
  day: string;
  month: number;
  year: string;
}

export class CalendarComponent extends Component<ICalendarProps, ICalendarState> {
  public state = {
    isMonthView: false,
    selectedDay: '',
    day: moment().format(DateFormats.DD),
    month: new Date().getMonth(),
    year: moment().format(DateFormats.YYYY),
  };

  public render(): React.ReactNode {
    const { isMonthView } = this.state;
    return (
      <View>
        {this.renderHeader()}
        {isMonthView ? this.renderMonthView() : this.renderCalendar()}
      </View>
    );
  }

  private renderHeader = (): React.ReactElement => {
    const { year, month, isMonthView } = this.state;
    const updateMonth = DateUtils.getFullMonthName(month, DateFormats.MMMM);
    return (
      <>
        <View style={styles.headerContainer}>
          <Icon name={icons.leftArrow} size={22} color={theme.colors.primaryColor} onPress={this.handleBackPress} />
          <Text
            type="small"
            textType="semiBold"
            onPress={this.handleMonthPress}
            style={StyleSheet.flatten([customStyles.headerTitle(isMonthView)])}
          >
            {`${updateMonth} ${year}`}
          </Text>
          <Icon name={icons.rightArrow} size={22} color={theme.colors.primaryColor} onPress={this.handleNextPress} />
        </View>
        <Divider />
      </>
    );
  };

  private renderMonthView = (): React.ReactNode => {
    return (
      <FlatList
        data={MonthNames}
        renderItem={this.renderItem}
        contentContainerStyle={styles.listContent}
        keyExtractor={this.renderKeyExtractor}
        numColumns={4}
      />
    );
  };

  private renderKeyExtractor = (item: string, index: number): string => {
    return `${item}-${index}`;
  };

  private renderItem = ({ item, index }: { item: string; index: number }): React.ReactElement => {
    const onPressItem = (): void => this.onSelectMonth(item, index);
    const { month } = this.state;
    const isSelected = month === index;
    return (
      <TouchableOpacity
        key={index}
        style={StyleSheet.flatten([customStyles.renderItemView(isSelected)])}
        onPress={onPressItem}
      >
        <Label type="large" style={StyleSheet.flatten([customStyles.renderItemTitle(isSelected)])}>
          {item}
        </Label>
      </TouchableOpacity>
    );
  };

  private renderCalendar = (): React.ReactElement => {
    const { day, month, year, selectedDay } = this.state;
    const updateMonth = DateUtils.getFullMonthName(month, DateFormats.MMM);
    const date = DateUtils.getFormattedDate(day, updateMonth, year, DateFormats.YYYYMMMDD);
    return (
      <>
        <Calendar
          hideArrows
          // @ts-ignore
          renderHeader={this.headerView}
          current={date}
          key={date.toDateString()}
          style={styles.calendarStyle}
          onDayPress={this.onDayPress}
          markingType="custom"
          theme={{}}
          markedDates={{
            [selectedDay]: {
              customStyles: {
                container: {
                  backgroundColor: theme.colors.primaryColor,
                  borderRadius: 4,
                },
                text: {
                  color: theme.colors.white,
                },
              },
            },
          }}
        />
        <WithShadowView outerViewStyle={styles.shadowView}>
          <Button type="primary" title="Select" containerStyle={styles.buttonStyle} onPress={this.handleSelect} />
        </WithShadowView>
      </>
    );
  };

  private onSelectMonth = (item: string, index: number): void => {
    this.setState({ month: index, isMonthView: false });
  };

  // TODO: (Shikha: 18/06/2020) - Need to add day type
  private onDayPress = (day: any): void => {
    this.setState({ selectedDay: day.dateString });
  };

  private handleSelect = (): void => {
    const { onSelect } = this.props;
    const { selectedDay } = this.state;
    onSelect(selectedDay);
  };

  private headerView = (): null => {
    return null;
  };

  private handleBackPress = (): void => {
    const { year, isMonthView, month } = this.state;
    const previousYear = Number(year) - 1;
    const previousMonth = month - 1;
    if (isMonthView) {
      this.setState({ year: previousYear.toString() });
    } else {
      this.setState({ month: previousMonth });
    }
  };

  private handleNextPress = (): void => {
    const { year, isMonthView, month } = this.state;
    const nextYear = Number(year) + 1;
    const nextMonth = month + 1;
    if (isMonthView) {
      this.setState({ year: nextYear.toString() });
    } else {
      this.setState({ month: nextMonth });
    }
  };

  private handleMonthPress = (): void => {
    const { isMonthView } = this.state;
    this.setState({ isMonthView: !isMonthView });
  };
}

const styles = StyleSheet.create({
  shadowView: {
    paddingTop: 10,
    marginBottom: PlatformUtils.isIOS() ? 20 : 0,
    paddingBottom: 0,
  },
  buttonStyle: {
    flex: 0,
    margin: 16,
  },
  headerContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  listContent: {
    marginVertical: 16,
  },
  calendarStyle: {
    height: 310,
  },
});

const customStyles = {
  headerTitle: (isMonthView: boolean): StyleProp<TextStyle> => ({
    color: isMonthView ? theme.colors.darkTint2 : theme.colors.primaryColor,
  }),
  renderItemView: (isSelected: boolean): StyleProp<ViewStyle> => ({
    width: 80,
    marginVertical: 12,
    marginHorizontal: 10,
    alignItems: 'center',
    backgroundColor: isSelected ? theme.colors.primaryColor : theme.colors.white,
    borderRadius: 4,
  }),
  renderItemTitle: (isSelected: boolean): StyleProp<TextStyle> => ({
    paddingVertical: 6,
    color: isSelected ? theme.colors.white : theme.colors.darkTint2,
  }),
};
