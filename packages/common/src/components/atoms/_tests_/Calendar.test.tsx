// @ts-nocheck
import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { CalendarComponent } from '@homzhub/common/src/components/atoms/CalendarComponent';

jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@react-native-community/google-signin', () => {});

const createTestProps = (testProps: any): object => ({
  onSelect: jest.fn(),
  selectedDate: '2020-06-22',
  ...testProps,
});
let props: any;

describe('CalendarComponent', () => {
  it('should match snapshot when isMonthView is true', () => {
    props = createTestProps({});
    const wrapper = shallow(<CalendarComponent {...props} />);
    const instance = wrapper.instance();
    instance.handleMonthPress();
    instance.handleBackPress();
    instance.handleNextPress();
    instance.onSelectMonth(6, 0);
    instance.onDayPress({ dateString: '2020-06-19' });
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot when isMonthView is false', () => {
    props = createTestProps({
      selectedDate: '',
    });
    const wrapper = shallow(<CalendarComponent {...props} />);
    const instance = wrapper.instance();
    instance.handleSelect();
    instance.handleBackPress();
    instance.handleNextPress();
    instance.setState({ month: 6 });
    expect(instance).toMatchSnapshot();
  });
});
