import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { PaginationComponent } from '@homzhub/mobile/src/components/atoms/PaginationComponent';

const createTestProps = (testProps: any): object => ({
  dotsLength: 0,
  activeSlide: 0,
  ...testProps,
});
let props: any;

describe('PaginationComponent', () => {
  it('should match snapshot', () => {
    props = createTestProps({});
    const wrapper: ShallowWrapper = shallow(<PaginationComponent {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
