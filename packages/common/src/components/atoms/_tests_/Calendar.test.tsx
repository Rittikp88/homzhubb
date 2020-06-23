import React from 'react';
import { mount } from 'enzyme';
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
  it('should match snapshot', () => {
    props = createTestProps({});
    const wrapper = mount(<CalendarComponent {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
