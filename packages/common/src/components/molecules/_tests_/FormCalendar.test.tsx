import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { FormCalendar } from '@homzhub/common/src/components/molecules/FormCalendar';

jest.mock('@react-native-community/google-signin', () => {});
jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');

describe('Test cases for FormCalendar', () => {
  it('should render snapshot', () => {
    const wrapper = mount(<FormCalendar onSelectDate={jest.fn()} availableFrom="2020-06-24" />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render snapshot when availableFrom is not equal to current date', () => {
    const wrapper = mount(<FormCalendar onSelectDate={jest.fn()} availableFrom="2022-08-29" />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
