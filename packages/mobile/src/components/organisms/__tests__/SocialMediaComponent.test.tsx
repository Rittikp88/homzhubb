import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { SocialMediaComponent } from '@homzhub/mobile/src/components';
import { SocialMediaData } from '@homzhub/common/src/mocks/SocialMedia';

jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@react-native-community/google-signin', () => {});

describe('Test cases for SocialMediaComponent', () => {
  const props = {
    onEmailLogin: jest.fn(),
    onLoginSuccessAction: jest.fn(),
    socialMediaItems: SocialMediaData,
    isFromLogin: true,
    navigation: { navigate: jest.fn() },
  };
  // @ts-ignore
  const wrapper = mount(<SocialMediaComponent {...props} t={(key: string): string => key} />);

  it('should render snapshot', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render snapshot from email login', () => {
    wrapper.setProps({ isFromLogin: false });
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
