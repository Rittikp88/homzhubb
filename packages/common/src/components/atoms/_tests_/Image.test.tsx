import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { ImageRound, ImageSquare } from '@homzhub/common/src/components';

describe('<ImageRound />', () => {
  it('renders a round image', () => {
    const roundImage = shallow(<ImageRound size={50} source={exampleImage} />);
    expect(toJson(roundImage)).toMatchSnapshot();
  });
});

describe('<ImageSquare />', () => {
  it('renders a square image', () => {
    const squareImage = shallow(<ImageSquare size={50} source={exampleImage} />);
    expect(toJson(squareImage)).toMatchSnapshot();
  });
});