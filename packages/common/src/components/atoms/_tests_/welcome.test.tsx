import React from 'react';
import { shallow } from 'enzyme';
import { Welcome } from '../welcome';

describe('Welcome', () => {
  test('should render snapshot', () => {
    const wrapped = shallow(<Welcome />);
    expect(wrapped).toMatchSnapshot();
  });
});
