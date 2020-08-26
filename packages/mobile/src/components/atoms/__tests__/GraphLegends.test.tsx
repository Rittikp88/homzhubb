import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { theme } from '@homzhub/common/src/styles/theme';
import { GraphLegends } from '@homzhub/mobile/src/components/atoms/GraphLegends';

const createTestProps = (testProps: any): object => ({
  direction: 'row',
  data: [
    {
      key: 1,
      title: 'Some Title',
      value: 1000,
      svg: { fill: theme.colors.blueDonut },
    },
  ],
  ...testProps,
});
let props: any;

describe('GraphLegends', () => {
  it('should match snapshot', () => {
    props = createTestProps({});
    const wrapper: ShallowWrapper = shallow(<GraphLegends {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot for column direction', () => {
    props = createTestProps({
      direction: 'column',
    });
    const wrapper: ShallowWrapper = shallow(<GraphLegends {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
