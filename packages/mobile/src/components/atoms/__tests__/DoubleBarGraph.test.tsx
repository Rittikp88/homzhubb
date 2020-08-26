import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { DoubleBarGraph } from '@homzhub/mobile/src/components/atoms/DoubleBarGraph';

const createTestProps = (testProps: any): object => ({
  data: {
    data1: [1, 2],
    data2: [3, 4],
    label: ['A', 'B'],
  },
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
