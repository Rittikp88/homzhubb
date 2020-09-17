import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { AnimatedHeader } from '@homzhub/mobile/src/components/molecules/AnimatedHeader';

jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@react-native-community/google-signin', () => {});

describe('Test cases for Header', () => {
  const wrapper: ShallowWrapper = shallow(<AnimatedHeader />);

  it('should render snapshot', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
