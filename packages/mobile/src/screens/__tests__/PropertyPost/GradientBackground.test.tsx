import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { GradientBackground } from '@homzhub/mobile/src/screens/PropertyPost/GradientBackground';

describe('Gradient Background Component', () => {
  it('should render GradientBackground', () => {
    const wrapper: ShallowWrapper = shallow(<GradientBackground />);
    expect(toJson(wrapper.dive())).toMatchSnapshot();
  });
});
