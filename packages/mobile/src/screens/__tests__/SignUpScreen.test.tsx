import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import SignUpScreen from '@homzhub/mobile/src/screens/Auth/SignUpScreen';

describe('SignUp Screen', () => {
  it('should match snapshot', () => {
    const wrapper = shallow(<SignUpScreen />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
