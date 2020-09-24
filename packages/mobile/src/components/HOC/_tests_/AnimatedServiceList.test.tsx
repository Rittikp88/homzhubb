import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Text } from 'react-native';
import { AnimatedServiceList } from '@homzhub/mobile/src/components/HOC/AnimatedServiceList';

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
