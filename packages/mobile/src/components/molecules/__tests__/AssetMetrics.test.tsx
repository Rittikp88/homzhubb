import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { theme } from '@homzhub/common/src/styles/theme';
import { AssetMetrics } from '@homzhub/mobile/src/components/molecules/AssetMetrics';

jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@react-native-community/google-signin', () => {});

describe('AssetMetrics', () => {
  let wrapper: ShallowWrapper;

  it('should match snapshot', () => {
    const props = {
      header: 'header',
      value: 'value',
      angle: 180,
      location: [0, 1],
      colorA: theme.colors.white,
      colorB: theme.colors.background,
    };
    wrapper = shallow(<AssetMetrics {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot for show plus icon', () => {
    const props = {
      header: 'header',
      value: 'value',
      angle: 180,
      location: [0, 1],
      colorA: theme.colors.white,
      colorB: theme.colors.background,
      showPlusIcon: true,
    };
    wrapper = shallow(<AssetMetrics {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot for currency', () => {
    const props = {
      header: 'header',
      value: 'value',
      angle: 180,
      currency: 'INR',
      location: [0, 1],
      colorA: theme.colors.white,
      colorB: theme.colors.background,
      showPlusIcon: true,
    };
    wrapper = shallow(<AssetMetrics {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
