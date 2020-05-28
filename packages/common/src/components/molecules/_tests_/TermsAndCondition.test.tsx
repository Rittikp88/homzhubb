import React from 'react';
import renderer from 'react-test-renderer';
import { TermsCondition } from '@homzhub/common/src/components';

jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@react-native-community/google-signin', () => {});
describe('Test cases for TermsAndCondition', () => {
  it('should render snapshot', () => {
    const tree = renderer.create(<TermsCondition />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
