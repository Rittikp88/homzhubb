import React from 'react';
import { shallow } from 'enzyme';
import { Welcome } from '@homzhub/common/src/components/atoms/welcome';

describe('Welcome', () => {
  test('should render snapshot', () => {
    const wrapped = shallow(<Welcome />);
    expect(wrapped).toMatchSnapshot();
  });
});
