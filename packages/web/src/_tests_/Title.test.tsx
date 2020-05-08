import React from 'react';
import { shallow } from 'enzyme';
import Title from '../Title';

const title = 'This is title';
// @ts-ignore
const wrapped = shallow(<Title>{title}</Title>);
describe('Title', () => {
  it('should render the Title Component correctly', () => {
    expect(wrapped).toMatchSnapshot();
  });
  it('renders the Titles children', () => {
    expect(wrapped.find('h1').text()).toEqual(title);
  });
});
