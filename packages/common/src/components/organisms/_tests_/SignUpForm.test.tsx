import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { SignUpForm } from '@homzhub/common/src/components';

jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@react-native-community/google-signin', () => {});

describe('Test cases for SignUpForm', () => {
  it('should render snapshot', () => {
    const props = {
      onSubmitFormSuccess: jest.fn(),
    };
    const tree = shallow(<SignUpForm {...props} />);
    expect(toJson(tree)).toMatchSnapshot();
  });
});
