import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { LoginForm } from '@homzhub/common/src/components';

jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@react-native-community/google-signin', () => {});

describe('Test cases for LoginForm', () => {
  it('should render snapshot', () => {
    const props = {
      onLoginSuccess: jest.fn(),
      isEmailLogin: true,
    };
    const tree = shallow(<LoginForm {...props} />);
    expect(toJson(tree)).toMatchSnapshot();
  });
});
