import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { FinancialHeaderContainer } from '@homzhub/mobile/src/components/organisms/FinancialHeaderContainer';

let props: any;
let wrapper: ShallowWrapper;

describe('FinancialHeaderContainer', () => {
  const createTestProps = (testProps: any): object => ({
    income: 0,
    expense: 0,
    ...testProps,
  });

  props = createTestProps({});

  it('should match snapshot', () => {
    wrapper = shallow(<FinancialHeaderContainer {...props} t={(key: string): string => key} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
