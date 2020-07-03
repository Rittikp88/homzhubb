import React, { Component } from 'react';
import { Calendar, DateObject } from 'react-native-calendars';
import { View, FlatList, TouchableOpacity, StyleSheet, StyleProp, TextStyle, ViewStyle } from 'react-native';
import moment from 'moment';
import { DateFormats, DateUtils, MonthNames } from '@homzhub/common/src/utils/DateUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider, Button, Text, Label, WithShadowView } from '@homzhub/common/src/components';

interface ICalendarProps {
  onSelect: (day: string) => void;
  selectedDate: string;
}

interface ICalendarState {
  isMonthView: boolean;
  selectedDate: string;
  day: string;
  month: number;
  year: string;
}

export class CalendarComponent extends Component<ICalendarProps, ICalendarState> {
  public constructor(props: ICalendarProps) {
    super(props);
    const { selectedDate } = props;
    this.state = {
      isMonthView: false,
      selectedDate,
      day: moment().format(DateFormats.DD),
      month: new Date().getMonth(),
      year: moment().format(DateFormats.YYYY),
    };
  }

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
    const { year, month, isMonthView, selectedDate } = this.state;
    const newMonth = moment(selectedDate).month();
    const newYear = moment(selectedDate).year();
    const updateMonth = DateUtils.getFullMonthName(newMonth || month, DateFormats.MMMM);

    return (
      <>
        <View style={styles.headerContainer}>
          <Icon
            name={icons.leftArrow}
            onPress={this.handleBackPress}
            size={22}
            color={month === moment().month() ? theme.colors.disabled : theme.colors.primaryColor}
          />
          <Text
            type="small"
            textType="semiBold"
            onPress={this.handleMonthPress}
            style={StyleSheet.flatten([customStyles.headerTitle(isMonthView)])}
          >
            {`${updateMonth} ${newYear || year}`}
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
    const { day, month, year, selectedDate } = this.state;
    const updateMonth = DateUtils.getFullMonthName(month, DateFormats.MMM);
    const date =
      selectedDate || DateUtils.getFormattedDate(day, updateMonth, year, DateFormats.YYYYMMMDD).toDateString();
    return (
      <>
        <Calendar
          hideArrows
          // @ts-ignore
          renderHeader={this.headerView}
          minDate={new Date()}
          current={date}
          key={date}
          style={styles.calendarStyle}
          onDayPress={this.onDayPress}
          markingType="custom"
          theme={{}}
          markedDates={{
            [date]: {
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
    const { year } = this.state;
    this.setState({ month: index, isMonthView: false });
    this.getSelectedDate(index, Number(year));
  };

  private onDayPress = (day: DateObject): void => {
    this.setState({ selectedDate: day.dateString });
  };

  private handleSelect = (): void => {
    const { onSelect } = this.props;
    const { selectedDate } = this.state;
    onSelect(selectedDate);
  };

  private headerView = (): null => {
    return null;
  };

  private handleBackPress = (): void => {
    const { year, isMonthView, month } = this.state;

    if (month === moment().month()) {
      return;
    }

    if (isMonthView) {
      const previousYear = Number(year) - 1;
      this.getSelectedDate(month, previousYear);
      this.setState({ year: previousYear.toString() });
    } else {
      const previousMonth = month - 1;
      this.getSelectedDate(previousMonth, Number(year));
      this.setState({ month: previousMonth });
    }
  };

  private handleNextPress = (): void => {
    const { year, isMonthView, month } = this.state;

    if (isMonthView) {
      const nextYear = Number(year) + 1;
      this.getSelectedDate(month, nextYear);
      this.setState({ year: nextYear.toString() });
    } else {
      const nextMonth = month + 1;
      this.getSelectedDate(nextMonth, Number(year));
      this.setState({ month: nextMonth });
    }
  };

  private getSelectedDate = (month: number, year: number): void => {
    const { selectedDate } = this.props;
    const isNotSelected = moment(selectedDate).month() !== month || moment(selectedDate).year() !== year;
    if (isNotSelected) {
      this.setState({ selectedDate: '' });
    } else {
      this.setState({ selectedDate });
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
