import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import Header from '@homzhub/mobile/src/components/molecules/Header';

const createTestProps = (testProps: any): object => ({
  backgroundColor: theme.colors.primaryColor,
  icon: icons.leftArrow,
  onIconPress: jest.fn(),
  isHeadingVisible: true,
  ...testProps,
});
let props: any;

describe('Header', () => {
  it('should match snapshot', () => {
    props = createTestProps({});
    const wrapper = mount(<Header {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  it('should match snapshot without title', () => {
    props = createTestProps({
      isHeadingVisible: true,
      title: 'Header',
    });
    const wrapper = mount(<Header {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
