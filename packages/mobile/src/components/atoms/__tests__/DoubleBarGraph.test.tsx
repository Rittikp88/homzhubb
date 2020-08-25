import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { DoubleBarGraph } from '@homzhub/mobile/src/components/atoms/DoubleBarGraph';

const createTestProps = (testProps: any): object => ({
  // TODO: add props
  ...testProps,
});
let props: any;

describe('DoubleBarGraph', () => {
  it('should match snapshot', () => {
    props = createTestProps({});
    const wrapper: ShallowWrapper = shallow(<DoubleBarGraph {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
