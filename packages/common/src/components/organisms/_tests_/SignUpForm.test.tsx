import React from 'react';
import renderer from 'react-test-renderer';
import { SignUpForm } from '@homzhub/common/src/components';

jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@react-native-community/google-signin', () => {});
describe('Test cases for SignUpForm', () => {
  it('should render snapshot', () => {
    // @ts-ignore
    const tree = renderer.create(<SignUpForm />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
