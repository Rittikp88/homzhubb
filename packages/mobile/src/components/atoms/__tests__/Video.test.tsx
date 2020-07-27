import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { RNVideo } from '@homzhub/mobile/src/components/atoms/Video';

jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@react-native-community/google-signin', () => {});

describe('Video', () => {
  const props = {
    uri: 'videoUrl',
    onBuffer: jest.fn(),
    onVideoError: jest.fn(),
  };
  const wrapper: ShallowWrapper = shallow(<RNVideo {...props} />);

  it('should match snapshot', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
