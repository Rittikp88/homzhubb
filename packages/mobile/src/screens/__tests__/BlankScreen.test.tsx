import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { BlankScreen } from '@homzhub/mobile/src/screens/BlankScreen';

describe('Blank Screen', () => {
  it('should render the Blank screen', () => {
    const component = shallow(<BlankScreen />);
    expect(toJson(component)).toMatchSnapshot();
  });
});
