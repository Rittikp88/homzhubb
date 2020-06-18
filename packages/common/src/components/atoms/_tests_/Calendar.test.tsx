import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { CalendarComponent } from '@homzhub/common/src/components/atoms/CalendarComponent';

jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@react-native-community/google-signin', () => {});

describe('CalendarComponent', () => {
  const wrapper = mount(<CalendarComponent onSelect={jest.fn()} />);

  it('should match snapshot', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
