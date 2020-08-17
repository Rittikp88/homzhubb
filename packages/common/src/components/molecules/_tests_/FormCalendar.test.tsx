import React from 'react';
import moment from 'moment';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { BottomSheet } from '@homzhub/mobile/src/components/molecules/BottomSheet';
import { CalendarComponent } from '@homzhub/common/src/components/atoms/CalendarComponent';
import { FormCalendar } from '@homzhub/common/src/components/molecules/FormCalendar';

jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@react-native-community/google-signin', () => {});

describe('Test cases for FormCalendar', () => {
  const formProps = {
    values: {
      test: '2020-11-01',
    },
    touched: {
      name: 'test',
    },
    setFieldValue: jest.fn(),
    setFieldTouched: jest.fn(),
  };
  // @ts-ignore
  const wrapper: ShallowWrapper = shallow(<FormCalendar name="test" formProps={formProps} />).dive();

  it('should render snapshot', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render snapshot when initial date today', () => {
    wrapper.setProps({
      formProps: {
        ...formProps,
        values: {
          test: moment().format('YYYY-MM-DD'),
        },
      },
    });
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render snapshot when calendar is open', () => {
    expect(wrapper.state('isCalendarVisible')).toEqual(false);
    wrapper.find("[testID='toCalenderInput']").simulate('press');
    expect(wrapper.state('isCalendarVisible')).toEqual(true);
  });

  it('should close bottom-sheet on close button press of bottom-sheet', () => {
    expect(wrapper.setState({ isCalendarVisible: true }));
    // @ts-ignore
    wrapper.find(BottomSheet).prop('onCloseSheet')();
    expect(wrapper.state('isCalendarVisible')).toEqual(false);
  });

  it('should set the form field when user selects a date', () => {
    const selectedDate = '2020-11-01';
    expect(wrapper.setState({ isCalendarVisible: true }));
    wrapper.find(CalendarComponent).prop('onSelect')(selectedDate);
    expect(wrapper.state('isCalendarVisible')).toEqual(false);
    expect(formProps.setFieldTouched).toHaveBeenCalledWith('test');
    expect(formProps.setFieldValue).toHaveBeenCalledWith('test', selectedDate);
  });
});
