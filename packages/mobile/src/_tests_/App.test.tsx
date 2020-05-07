import React from 'react';
import { shallow } from 'enzyme';
import App from '../App';

describe('App', () => {
  test('should render snapshot', () => {
    const wrapped = shallow(<App />);
    expect(wrapped).toMatchSnapshot();
  });
});
