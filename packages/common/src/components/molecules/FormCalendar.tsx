import React, { Component } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, TouchableOpacity } from 'react-native';
import { FormikProps, FormikValues } from 'formik';
import moment from 'moment';
import { withTranslation, WithTranslation } from 'react-i18next';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text, Label } from '@homzhub/common/src/components';
import { BottomSheet } from '@homzhub/mobile/src/components/molecules/BottomSheet';
import { CalendarComponent } from '@homzhub/common/src/components/atoms/CalendarComponent';

interface IFormCalendarProps extends WithTranslation {
  name: string;
  formProps: FormikProps<FormikValues>;
  label?: string;
  placeHolder?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

interface IFormCalendarState {
  isCalendarVisible: boolean;
}

class FormCalendar extends Component<IFormCalendarProps, IFormCalendarState> {
  public state = {
    isCalendarVisible: false,
  };

  public render(): React.ReactNode {
    const {
      t,
      name,
      formProps: { values },
      containerStyle = {},
      label,
      placeHolder,
    } = this.props;
    const { isCalendarVisible } = this.state;
    const availableDate = values[name] === moment().format('YYYY-MM-DD') ? 'Today' : values[name];

    return (
      <View style={[styles.container, containerStyle]}>
        <Label type="regular" textType="regular" style={styles.label}>
          {label || t('common:availableFrom')}
        </Label>
        <TouchableOpacity testID="toCalenderInput" style={styles.dateView} onPress={this.onCalendarOpen}>
          <View style={styles.dateLeft}>
            <Icon name={icons.calendar} color={theme.colors.darkTint5} size={18} />
            <Text type="small" textType="regular" style={styles.dateText}>
              {availableDate || placeHolder}
            </Text>
          </View>
          <Icon name={icons.downArrowFilled} color={theme.colors.darkTint7} size={16} />
        </TouchableOpacity>
        <BottomSheet
          visible={isCalendarVisible}
          onCloseSheet={this.onCalendarClose}
          headerTitle={t('common:availableFrom')}
          isShadowView
          sheetHeight={580}
        >
          <CalendarComponent onSelect={this.onDateSelected} selectedDate={values[name]} />
        </BottomSheet>
      </View>
    );
  }

  private onDateSelected = (day: string): void => {
    const {
      name,
      formProps: { setFieldValue, setFieldTouched },
    } = this.props;
    this.setState({ isCalendarVisible: false });

    setFieldValue(name, day);
    setFieldTouched(name);
  };

  private onCalendarOpen = (): void => {
    const { isCalendarVisible } = this.state;
    this.setState({ isCalendarVisible: !isCalendarVisible });
  };

  private onCalendarClose = (): void => {
    this.setState({ isCalendarVisible: false });
  };
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
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
