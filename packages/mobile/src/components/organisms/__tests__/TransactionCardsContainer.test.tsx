import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { TransactionCardsContainer } from '@homzhub/mobile/src/components/organisms/TransactionCardsContainer';

let props: any;
let wrapper: ShallowWrapper;

describe('TransactionCardsContainer', () => {
  const createTestProps = (testProps: any): object => ({
    data: [],
    ...testProps,
  });

  props = createTestProps({});

  it('should match snapshot', () => {
    wrapper = shallow(<TransactionCardsContainer {...props} t={(key: string): string => key} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
