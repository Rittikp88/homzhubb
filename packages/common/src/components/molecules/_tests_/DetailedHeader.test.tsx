import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { DetailedHeader } from '@homzhub/common/src/components/molecules/DetailedHeader';

describe('Test cases for DetailedHeader', () => {
  const wrapper: ShallowWrapper = shallow(<DetailedHeader />);

  it('should render snapshot', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
