import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { ProgressBar } from '@homzhub/mobile/src/components/atoms/ProgressBar';

const createTestProps = (testProps: any): object => ({
  progress: 50,
  ...testProps,
});
let props: any;

describe('ProgressBar', () => {
  it('should match snapshot', () => {
    props = createTestProps({});
    const wrapper: ShallowWrapper = shallow(<ProgressBar {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
