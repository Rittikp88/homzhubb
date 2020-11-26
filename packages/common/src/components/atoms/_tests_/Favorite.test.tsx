import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Favorite } from '@homzhub/common/src/components/atoms/Favorite';

const mock = jest.fn();

describe('Favorite', () => {
  let wrapper: ShallowWrapper;

  beforeEach(() => {
    const props = {
      onFavorite: mock,
      isFavorite: true,
    };
    wrapper = shallow(<Favorite {...props} />);
  });

  it('should match snapshot for selected true', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
