import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { DonutGraph } from '@homzhub/mobile/src/components/atoms/DonutGraph';

const createTestProps = (testProps: any): object => ({
  // TODO: add props
  ...testProps,
});
let props: any;

describe('DonutGraph', () => {
  it('should match snapshot', () => {
    props = createTestProps({});
    const wrapper: ShallowWrapper = shallow(<DonutGraph {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
