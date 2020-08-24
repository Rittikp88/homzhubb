import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { icons } from '@homzhub/common/src/assets/icon';
import { DetailedHeader } from '@homzhub/common/src/components/molecules/DetailedHeader';

describe('Test cases for DetailedHeader', () => {
  let wrapper: ShallowWrapper;

  it('should render snapshot', () => {
    wrapper = shallow(<DetailedHeader />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render snapshot with icon', () => {
    const props = {
      icon: icons.sun,
    };
    wrapper = shallow(<DetailedHeader {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render snapshot with header content visible', () => {
    const props = {
      title: 'Some title',
      subTitle: 'Subtitle',
    };
    wrapper = shallow(<DetailedHeader {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
