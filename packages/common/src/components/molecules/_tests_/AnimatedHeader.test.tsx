import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { AnimatedHeader } from '@homzhub/common/src/components';

jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@react-native-community/google-signin', () => {});

describe('Test cases for Header', () => {
  it('should render snapshot', () => {
    const props = {
      onIconPress: jest.fn(),
    };

    const tree = shallow(<AnimatedHeader {...props} />);
    expect(toJson(tree)).toMatchSnapshot();
  });
});
