import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import PropertySearch from '@homzhub/mobile/src/screens/PropertySearch';

describe('Property Search Screen', () => {
  it('should render the property search screen', () => {
    const component = shallow(<PropertySearch/>);
    expect(toJson(component)).toMatchSnapshot();
  });
});
