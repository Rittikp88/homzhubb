import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import moment from 'moment';
import { withTranslation, WithTranslation } from 'react-i18next';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text, Label } from '@homzhub/common/src/components';
import { BottomSheet } from '@homzhub/mobile/src/components/molecules/BottomSheet';
import { CalendarComponent } from '@homzhub/common/src/components/atoms/CalendarComponent';

interface IFormCalendarProps extends WithTranslation {
  availableFrom: string;
  onSelectDate: (day: string) => void;
}

interface IFormCalendarState {
  isCalendarVisible: boolean;
}

class FormCalendar extends Component<IFormCalendarProps, IFormCalendarState> {
  public state = {
    isCalendarVisible: false,
  };

  public render(): React.ReactNode {
    const { t, availableFrom } = this.props;
    const { isCalendarVisible } = this.state;
    const availableDate = availableFrom === moment().format('YYYY-MM-DD') ? 'Today' : availableFrom;
    return (
      <>
        <Label type="regular" textType="regular" style={styles.label}>
          {t('common:availableFrom')}
        </Label>
        <View style={styles.dateView}>
          <View style={styles.dateLeft}>
            <Icon name={icons.calendar} color={theme.colors.darkTint5} size={18} onPress={this.handleOnPress} />
            <Text type="small" textType="regular" style={styles.dateText}>
              {availableDate}
            </Text>
          </View>
          <Icon name={icons.downArrowFilled} color={theme.colors.darkTint7} size={16} onPress={this.handleOnPress} />
        </View>
        <BottomSheet
          visible={isCalendarVisible}
          onCloseSheet={this.closeBottomSheet}
          headerTitle={t('common:availableFrom')}
          isShadowView
          sheetHeight={580}
        >
          <CalendarComponent onSelect={this.handleCalendar} selectedDate={availableFrom} />
        </BottomSheet>
      </>
    );
  }

  private handleOnPress = (): void => {
    const { isCalendarVisible } = this.state;
    this.setState({ isCalendarVisible: !isCalendarVisible });
  };

  private closeBottomSheet = (): void => {
    this.setState({ isCalendarVisible: false });
  };

  private handleCalendar = (day: string): void => {
    const { onSelectDate } = this.props;
    this.setState({ isCalendarVisible: false });
    onSelectDate(day);
  };
}

const styles = StyleSheet.create({
  dateView: {
    borderWidth: 1,
    borderColor: theme.colors.disabled,
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 4,
    marginTop: 6,
  },
  dateLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    marginLeft: 16,
    color: theme.colors.darkTint1,
  },
  label: {
    color: theme.colors.darkTint3,
  },
});

const HOC = withTranslation()(FormCalendar);
export { HOC as FormCalendar };
