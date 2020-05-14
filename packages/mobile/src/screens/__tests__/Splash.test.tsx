import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Splash } from '@homzhub/mobile/src/screens/Splash';

describe('Splash Screen', () => {
  it('should match snapshot', () => {
    const wrapper = shallow(<Splash />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
