import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { HorizontalPicker } from '@homzhub/common/src/components/atoms/HorizontalPicker';

describe('HorizontalPicker', () => {
  const props = {
    value: 0,
    onValueChange: jest.fn(),
  };
  const wrapper: ShallowWrapper = shallow(<HorizontalPicker {...props} />);

  it('should match snapshot', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
