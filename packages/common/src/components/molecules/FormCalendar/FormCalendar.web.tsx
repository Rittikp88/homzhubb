import React, { Component } from 'react';
import { StyleProp, StyleSheet, Text as RNText, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { FormikProps } from 'formik';
import moment from 'moment';
import { withTranslation, WithTranslation } from 'react-i18next';
import { PopupProps } from 'reactjs-popup/dist/types';
import { PopupActions } from 'reactjs-popup/dist/types';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import { FontWeightType, Label, Text, TextFieldType, TextSizeType } from '@homzhub/common/src/components/atoms/Text';
import { CalendarComponent } from '@homzhub/mobile/src/components/atoms/CalendarComponent';

interface IFormCalendarProps extends WithTranslation {
  name: string;
  calendarTitle?: string;
  isYearView?: boolean;
  formProps?: FormikProps<any>;
  selectedValue?: string;
  label?: string;
  iconColor?: string;
  placeHolder?: string;
  allowPastDates?: boolean;
  isMandatory?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  placeHolderStyle?: StyleProp<TextStyle>;
  dateContainerStyle?: StyleProp<TextStyle>;
  dateStyle?: StyleProp<TextStyle>;
  textType?: TextFieldType;
  textSize?: TextSizeType;
  fontType?: FontWeightType;
  maxDate?: string;
  minDate?: string;
  isCurrentDateEnable?: boolean;
  bubbleSelectedDate?: (day: string) => void;
}

interface IFormCalendarState {
  isCalendarVisible: boolean;
}

class FormCalendar extends Component<IFormCalendarProps, IFormCalendarState> {
  public state = {
    isCalendarVisible: false,
  };

  private popupRef = React.createRef<PopupActions>();

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
      isMandatory = false,
      textSize = 'regular',
      fontType = 'regular',
      placeHolderStyle = {},
      dateStyle = {},
      dateContainerStyle = {},
      maxDate,
      minDate,
      isYearView = false,
      isCurrentDateEnable = false,
    } = this.props;
    const availableDate = (): string => {
      if (selectedValue) {
        return selectedValue;
      }
      return formProps?.values[name] === moment().format('YYYY-MM-DD') ? 'Today' : formProps?.values[name];
    };

    const defaultDropDownProps = (width: string): PopupProps => ({
      position: 'bottom left',
      on: 'click',
      arrow: false,
      contentStyle: { minWidth: width, marginTop: '4px' },
      closeOnDocumentClick: true,
      children: undefined,
    });

    const labelStyles = { ...theme.form.formLabel };
    let TextField = Text;
    if (textType === 'label') {
      TextField = Label;
    }
    const isPlaceholderStyle = selectedValue === '' || !availableDate();
    return (
      <View style={containerStyle}>
        <TextField type={textSize} textType={fontType} style={labelStyles}>
          {label || t('common:availableFrom')}
          {isMandatory && <RNText style={styles.asterix}> *</RNText>}
        </TextField>
        {!PlatformUtils.isMobile() && (
          <Popover
            content={
              // eslint-disable-next-line react/jsx-wrap-multilines
              <CalendarComponent
                allowPastDates={allowPastDates}
                maxDate={maxDate}
                minDate={minDate}
                isOnlyYearView={isYearView}
                onSelect={this.onDateSelected}
                isCurrentDateEnable={isCurrentDateEnable}
                selectedDate={selectedValue ?? formProps?.values[name]}
              />
            }
            popupProps={defaultDropDownProps('100px')}
            forwardedRef={this.popupRef}
          >
            <TouchableOpacity
              testID="toCalenderInput"
              style={[styles.dateView, dateContainerStyle]}
              onPress={this.onCalendarOpen}
            >
              <View style={styles.dateLeft}>
                {!isYearView && <Icon name={icons.calendar} color={iconColor || theme.colors.darkTint5} size={18} />}
                <Text
                  type="small"
                  textType="regular"
                  style={[styles.dateText, isPlaceholderStyle && placeHolderStyle, dateStyle]}
                >
                  {availableDate() || placeHolder}
                </Text>
              </View>

              <Icon name={icons.downArrowFilled} color={theme.colors.darkTint7} size={16} />
            </TouchableOpacity>
          </Popover>
        )}
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
    if (this.popupRef && this.popupRef.current) {
      this.popupRef.current?.close();
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
  asterix: {
    color: theme.colors.error,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
const HOC = withTranslation()(FormCalendar);
export { HOC as FormCalendar };
