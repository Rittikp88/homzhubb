import React from 'react';
import renderer from 'react-test-renderer';
import { FormButton } from '@homzhub/common/src/components';

jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@react-native-community/google-signin', () => {});
describe('Test cases for FormButton', () => {
  it('should render snapshot', () => {
    const props = {
      type: 'primary',
    };

    // @ts-ignore
    const tree = renderer.create(<FormButton {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
