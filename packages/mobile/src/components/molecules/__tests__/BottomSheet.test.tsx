import React from 'react';
import { Text } from 'react-native';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { BottomSheet, IBottomSheetProps } from '@homzhub/mobile/src/components/molecules/BottomSheet';

jest.mock('@react-native-community/google-signin', () => {});
jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');

describe('BottomSheet', () => {
  beforeAll(() => jest.spyOn(React, 'useEffect').mockImplementation((f) => f));
  it('should render snapshot', () => {
    const testProps: IBottomSheetProps = {
      children: <Text>Bottom Sheet</Text>,
      visible: false,
      onCloseSheet: jest.fn(),
    };
    const wrapper = shallow(<BottomSheet {...testProps} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render snapshot when visible is true', () => {
    const testProps: IBottomSheetProps = {
      children: <Text>Bottom Sheet</Text>,
      visible: true,
      onCloseSheet: jest.fn(),
    };
    const wrapper = shallow(<BottomSheet {...testProps} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
