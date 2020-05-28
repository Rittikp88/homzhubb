import React from 'react';
import { Text } from 'react-native';
import { mount } from 'enzyme';
import { BottomSheet, IBottomSheetProps } from '@homzhub/mobile/src/components/molecules/BottomSheet';

describe('BottomSheet', () => {

  it('should render snapshot', () => {
    const testProps: IBottomSheetProps = {
      children: <Text>Bottom Sheet</Text>,
      visible: false,
      onCloseSheet: jest.fn(),
    };
    const wrapper = mount(<BottomSheet {...testProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render snapshot when visible is true', () => {
    const testProps: IBottomSheetProps = {
      children: <Text>Bottom Sheet</Text>,
      visible: true,
      onCloseSheet: jest.fn(),
    };
    const wrapper = mount(<BottomSheet {...testProps} />);
    expect(wrapper).toMatchSnapshot();
  });
});
