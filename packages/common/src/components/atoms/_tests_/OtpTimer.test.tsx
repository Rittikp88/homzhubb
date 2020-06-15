import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { OtpTimer } from '@homzhub/common/src/components/atoms/OtpTimer';

describe('OtpTimer', () => {
  const props = {
    onResentPress: jest.fn(),
  };
  const wrapper: ShallowWrapper = shallow(<OtpTimer {...props} />);

  it('should match snapshot', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
