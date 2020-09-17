// @ts-nocheck
import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { SignUpForm } from '@homzhub/mobile/src/components';

jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@react-native-community/google-signin', () => {});

describe('Test cases for SignUpForm', () => {
  const props = {
    onSubmitFormSuccess: jest.fn(),
  };
  it('should render snapshot', () => {
    const tree = shallow(<SignUpForm {...props} t={(key: string): string => key} />);
    expect(toJson(tree)).toMatchSnapshot();
  });
  it('should render snapshot for dropdown selection', () => {
    const wrapper = shallow(<SignUpForm {...props} t={(key: string): string => key} />);
    const instance = wrapper.dive().instance();
    instance.onCloseDropDown();
    instance.handleSelection('+91');
    expect(instance).toMatchSnapshot();
  });
});