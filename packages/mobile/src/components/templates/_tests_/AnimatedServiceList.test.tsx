import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Text } from 'react-native';
import { AnimatedServiceList } from '@homzhub/mobile/src/components/templates/AnimatedServiceList';

jest.mock('@react-native-community/google-signin', () => {});
jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');

const createTestProps = (testProps: any): object => ({
  children: <Text>Testing Element</Text>,
  headerTitle: 'Animated List',
  title: 'Service',
  subTitle: 'Sub Service',
  onIconPress: jest.fn(),
  ...testProps,
});
let props: any;

describe('AnimatedServiceList', () => {
  it('should render snapshot', () => {
    props = createTestProps({});
    const wrapper = mount(<AnimatedServiceList {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
