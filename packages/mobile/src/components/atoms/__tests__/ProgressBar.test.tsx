import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { ProgressBar } from '@homzhub/mobile/src/components/atoms/ProgressBar';

let props: any;

describe('ProgressBar', () => {
  beforeEach(() => {
    props = {
      progress: 50,
    };
  });

  it('should match snapshot', () => {
    const wrapper: ShallowWrapper = shallow(<ProgressBar {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
