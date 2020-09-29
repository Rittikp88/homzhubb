import React, { Component } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, TouchableOpacity, TextStyle } from 'react-native';
import { FormikProps } from 'formik';
import moment from 'moment';
import { withTranslation, WithTranslation } from 'react-i18next';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text, Label, TextFieldType, TextSizeType, FontWeightType } from '@homzhub/common/src/components/atoms/Text';
import { BottomSheet } from '@homzhub/mobile/src/components/molecules/BottomSheet';
import { CalendarComponent } from '@homzhub/common/src/components/atoms/CalendarComponent';

interface IFormCalendarProps extends WithTranslation {
  name: string;
  formProps?: FormikProps<any>;
  selectedValue?: string;
  label?: string;
  iconColor?: string;
  placeHolder?: string;
  allowPastDates?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  placeHolderStyle?: StyleProp<TextStyle>;
  textType?: TextFieldType;
  textSize?: TextSizeType;
  fontType?: FontWeightType;
  maxDate?: string;
  bubbleSelectedDate?: (day: string) => void;
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
      formProps,
      selectedValue,
      containerStyle = {},
      label,
      placeHolder,
      allowPastDates,
      textType,
      iconColor,
      textSize = 'regular',
      fontType = 'regular',
      placeHolderStyle = {},
      maxDate,
    } = this.props;
    const { isCalendarVisible } = this.state;
    const availableDate = (): string => {
      if (selectedValue) {
        return selectedValue;
      }
      return formProps?.values[name] === moment().format('YYYY-MM-DD') ? 'Today' : formProps?.values[name];
    };
    const labelStyles = { ...theme.form.formLabel };
    let TextField = Text;
    if (textType === 'label') {
      TextField = Label;
    }
    return (
      <View style={containerStyle}>
        <TextField type={textSize} textType={fontType} style={labelStyles}>
          {label || t('common:availableFrom')}
        </TextField>
        <TouchableOpacity testID="toCalenderInput" style={styles.dateView} onPress={this.onCalendarOpen}>
          <View style={styles.dateLeft}>
            <Icon name={icons.calendar} color={iconColor || theme.colors.darkTint5} size={18} />
            <Text type="small" textType="regular" style={[styles.dateText, selectedValue === '' && placeHolderStyle]}>
              {availableDate() || placeHolder}
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
          <CalendarComponent
            allowPastDates={allowPastDates}
            maxDate={maxDate}
            onSelect={this.onDateSelected}
            selectedDate={selectedValue ?? formProps?.values[name]}
          />
        </BottomSheet>
      </View>
    );
  }

  private onDateSelected = (day: string): void => {
    const { name, formProps, bubbleSelectedDate } = this.props;
    this.setState({ isCalendarVisible: false });
    if (bubbleSelectedDate) {
      bubbleSelectedDate(day);
    } else {
      formProps?.setFieldValue(name, day);
      formProps?.setFieldTouched(name);
    }
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
});
const HOC = withTranslation()(FormCalendar);
export { HOC as FormCalendar };
