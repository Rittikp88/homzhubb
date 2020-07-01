import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { RNVideo } from '@homzhub/common/src/components';

describe('Badge', () => {
  const props = {
    uri: 'videoUrl',
    onBuffer: jest.fn(),
    onVideoError: jest.fn(),
  };
  const wrapper: ShallowWrapper = shallow(<RNVideo {...props} />);

  it('should match snapshot', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
