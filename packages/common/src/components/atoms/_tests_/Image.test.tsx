import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { ImageRound, ImageSquare } from '@homzhub/common/src/components';
import { images } from '@homzhub/common/src/assets/images';

describe('<ImageRound />', () => {
  it('renders a round image', () => {
    const roundImage = shallow(<ImageRound size={50} source={images.logo} />);
    expect(toJson(roundImage)).toMatchSnapshot();
  });
});

describe('<ImageSquare />', () => {
  it('renders a square image', () => {
    const squareImage = shallow(<ImageSquare size={50} source={images.logo} />);
    expect(toJson(squareImage)).toMatchSnapshot();
  });
});
