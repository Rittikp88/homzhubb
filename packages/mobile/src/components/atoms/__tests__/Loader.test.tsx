import React from 'react';
import { Platform } from 'react-native';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Loader } from '@homzhub/mobile/src/components/atoms/Loader';

describe('Loader', () => {
  it('should match snapshot for android', () => {
    Platform.OS = 'android';
    const wrapper: ShallowWrapper = shallow(<Loader />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot for ios', () => {
    Platform.OS = 'ios';
    const wrapper: ShallowWrapper = shallow(<Loader />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});