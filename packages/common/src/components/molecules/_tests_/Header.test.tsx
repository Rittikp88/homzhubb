import React from 'react';
import renderer from 'react-test-renderer';
import { Header } from '@homzhub/common/src/components';

jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@react-native-community/google-signin', () => {});

describe('Test cases for Header', () => {
  it('should render snapshot', () => {
    const props = {
      icon: 'close',
      onIconPress: jest.fn(),
    };

    const tree = renderer.create(<Header {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
