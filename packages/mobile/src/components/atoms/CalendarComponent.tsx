import React, { Component } from 'react';
import { Calendar, DateObject } from 'react-native-calendars';
import { View, FlatList, TouchableOpacity, StyleSheet, StyleProp, TextStyle, ViewStyle } from 'react-native';
import moment from 'moment';
import { groupBy } from 'lodash';
import { DateFormats, DateUtils, MonthNames } from '@homzhub/common/src/utils/DateUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import CalendarHeader from '@homzhub/common/src/components/atoms/CalendarHeader';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { WithShadowView } from '@homzhub/common/src/components/atoms/WithShadowView';

// CONSTANTS START

const INITIAL_YEAR = 1893;
const MAX_YEAR = 2036;

// CONSTANTS END

interface ICalendarProps {
  onSelect: (day: string) => void;
  selectedDate: string;
  allowPastDates?: boolean;
  maxDate?: string;
  isOnlyYearView?: boolean;
}

interface ICalendarState {
  isMonthView: boolean;
  isYearView: boolean;
  selectedDate: string;
  day: string;
  month: number;
  year: string;
  yearTitle: string;
  yearList: string[];
}

export class CalendarComponent extends Component<ICalendarProps, ICalendarState> {
  public constructor(props: ICalendarProps) {
    super(props);
    const { selectedDate } = props;
    this.state = {
      isMonthView: false,
      isYearView: false,
      selectedDate,
      day: moment().format(DateFormats.DD),
      month: new Date().getMonth(),
      year: moment().format(DateFormats.YYYY),
      yearTitle: '',
      yearList: [],
    };
  }

  public componentDidMount = (): void => {
    const yearData = this.getYearsData();
    const title = `${yearData[0]} - ${yearData[yearData.length - 1]}`;
    this.setState({ yearTitle: title, yearList: yearData });
  };

  public render(): React.ReactNode {
    const { isMonthView, isYearView } = this.state;
    const { isOnlyYearView } = this.props;
    const isYear = isYearView || isOnlyYearView;
    return (
      <View>
        {this.renderHeader()}
        {isMonthView ? this.renderListView() : isYear ? this.renderListView(true) : this.renderCalendar()}
      </View>
    );
  }

  private renderHeader = (): React.ReactElement => {
    const { allowPastDates, maxDate, isOnlyYearView } = this.props;
    const { year, isMonthView, selectedDate, isYearView, yearTitle } = this.state;
    const newYear = moment(selectedDate).year();
    let { month } = this.state;
    if (selectedDate) {
      month = moment(selectedDate).month();
    }
    const updateMonth = DateUtils.getFullMonthName(month, DateFormats.MMMM);

    const isCurrentMonth = month === moment().month();

    const title = `${updateMonth} ${newYear || year}`;

    return (
      <CalendarHeader
        isAllowPastDate={allowPastDates}
        headerTitle={title}
        headerYear={`${newYear || year}`}
        isCurrentMonth={isCurrentMonth}
        isMonthView={isMonthView}
        yearTitle={yearTitle}
        isYearView={isYearView || isOnlyYearView}
        maxDate={maxDate}
        onBackPress={this.handleBackPress}
        onNextPress={this.handleNextPress}
        onMonthPress={this.handleMonthPress}
        onYearPress={this.handleYearPress}
      />
    );
  };

  private renderListView = (isYearView?: boolean): React.ReactNode => {
    const { yearList } = this.state;

    const listData = isYearView ? yearList : MonthNames;

    return (
      <FlatList
        data={listData}
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
    const { month, isMonthView, isYearView, year } = this.state;
    const { isOnlyYearView, selectedDate } = this.props;
    const onPressItem = (): void => (isMonthView ? this.onSelectMonth(item, index) : this.onSelectYear(item, index));
    const isSelected = isYearView ? year === item : isOnlyYearView ? selectedDate === item : month === index;
    const isDisable = isOnlyYearView && item > year;

    return (
      <TouchableOpacity
        key={index}
        disabled={isDisable}
        style={StyleSheet.flatten([customStyles.renderItemView(isSelected)])}
        onPress={onPressItem}
      >
        <Label type="large" style={StyleSheet.flatten([customStyles.renderItemTitle(isSelected, isDisable)])}>
          {item}
        </Label>
      </TouchableOpacity>
    );
  };

  private renderCalendar = (): React.ReactElement => {
    const { allowPastDates, maxDate } = this.props;
    const { day, month, year, selectedDate } = this.state;
    const updateMonth = month + 1;
    const date = selectedDate || DateUtils.getFormattedDate(day, updateMonth, year, 'YYYY-MM-DD').toDateString();
    const markedDate = !selectedDate ? moment().format('YYYY-MM-DD') : moment(date).format('YYYY-MM-DD');
    return (
      <>
        <Calendar
          hideArrows
          // @ts-ignore
          renderHeader={(): null => null}
          minDate={allowPastDates ? undefined : new Date()}
          maxDate={maxDate}
          current={date}
          key={date}
          style={styles.calendarStyle}
          onDayPress={this.onDayPress}
          markingType="custom"
          theme={{}}
          markedDates={{
            [markedDate]: {
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
    this.setState({ month: index, isMonthView: false, isYearView: false });
    this.getSelectedDate(index, Number(year));
  };

  private onSelectYear = (item: string, index: number): void => {
    const { month } = this.state;
    const { isOnlyYearView, onSelect } = this.props;
    if (isOnlyYearView) {
      this.setState({ year: item, isMonthView: false, isYearView: false });
      onSelect(item);
    } else {
      this.setState({ year: item, isMonthView: true, isYearView: false });
      this.getSelectedDate(Number(month), index);
    }
  };

  private onDayPress = (day: DateObject): void => {
    this.setState({ selectedDate: day.dateString });
  };

  private handleSelect = (): void => {
    const { onSelect } = this.props;
    const { selectedDate } = this.state;
    onSelect(selectedDate);
  };

  private handleMonthPress = (): void => {
    const { isMonthView } = this.state;
    this.setState({ isMonthView: !isMonthView, isYearView: false });
  };

  private handleYearPress = (): void => {
    const { isYearView } = this.state;
    const yearData = this.getYearsData();
    const yearTitle = `${yearData[0]} - ${yearData[yearData.length - 1]}`;
    this.setState({ isYearView: !isYearView, isMonthView: false, yearTitle, yearList: yearData });
  };

  /**
   * Handle Back Press Functionality
   * Cases: Day, Month and Year view
   */
  private handleBackPress = (): void => {
    const { allowPastDates, isOnlyYearView } = this.props;
    const { year, isMonthView, selectedDate, isYearView, yearTitle } = this.state;
    let { month } = this.state;

    // For year view
    const value = Number(yearTitle.split('-')[0]);
    // For year view

    if (selectedDate) {
      month = moment(selectedDate).month();
    }

    if (!allowPastDates && month === moment().month() && !isYearView) {
      return;
    }

    if (isMonthView) {
      const previousYear = Number(year) - 1;
      this.getSelectedDate(month, previousYear);
      this.setState({ year: previousYear.toString() });
    } else if ((isYearView || isOnlyYearView) && value > INITIAL_YEAR) {
      const previousYear = value - 1;
      const yearData = this.getYearsData(previousYear);
      const title = `${yearData[0]} - ${yearData[yearData.length - 1]}`;
      this.setState({ yearTitle: title, yearList: yearData });
    } else {
      const previousMonth = month - 1;
      this.getSelectedDate(previousMonth, Number(year));
      this.setState({ month: previousMonth });
    }
  };

  /**
   * Handle Next Press Functionality
   * Cases: Day, Month and Year view
   */
  private handleNextPress = (): void => {
    const { year, isMonthView, selectedDate, isYearView, yearTitle } = this.state;
    const { maxDate, isOnlyYearView } = this.props;

    // For year view
    const value = Number(yearTitle.split('-')[1]);
    // For year view

    let { month } = this.state;
    if (maxDate && moment(maxDate).month() === moment().month()) {
      return;
    }
    if (selectedDate) {
      month = moment(selectedDate).month();
    }

    if (isMonthView && Number(year) < MAX_YEAR - 1) {
      const nextYear = Number(year) + 1;
      this.getSelectedDate(month, nextYear);
      this.setState({ year: nextYear.toString() });
    } else if ((isYearView || isOnlyYearView) && value < MAX_YEAR - 1) {
      const nextYear = value + 1;
      const yearData = this.getYearsData(nextYear);
      const title = `${yearData[0]} - ${yearData[yearData.length - 1]}`;
      this.setState({ yearTitle: title, yearList: yearData });
    } else {
      const nextMonth = month <= 10 ? month + 1 : 0;
      const nextYear = month <= 10 ? Number(year) : Number(year) + 1;
      this.getSelectedDate(nextMonth, nextYear);
      this.setState({ month: nextMonth, year: nextYear.toString() });
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

  /**
   * Created Year list for year view
   * Grouping by INITIAL and MAX year on the gap of 16 years
   */
  private getYearsData = (updateYear?: number): string[] => {
    const { year, selectedDate } = this.state;
    const newYear = moment(selectedDate).year();
    const formattedYear = updateYear || Number(newYear || year);
    const years = [];
    let updatedData: string[] = [];

    // for years list
    for (let i = INITIAL_YEAR; i <= MAX_YEAR; i++) {
      if (i < MAX_YEAR) {
        years.push(i.toString());
      }
    }

    while (years.length > 0) {
      const data = years.splice(0, 16);
      const abc = groupBy(data, () => `${data[0]}-${data[data.length - 1]}`);

      // eslint-disable-next-line no-loop-func
      Object.keys(abc).forEach((key) => {
        const values: string[] = key.split('-');
        if (Number(values[0]) <= formattedYear && Number(values[1]) >= formattedYear) {
          updatedData = abc[key];
        }
      });
    }

    return updatedData;
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
  renderItemTitle: (isSelected: boolean, isDisable?: boolean): StyleProp<TextStyle> => ({
    paddingVertical: 6,
    color: isSelected ? theme.colors.white : isDisable ? theme.colors.disabled : theme.colors.darkTint2,
  }),
};
