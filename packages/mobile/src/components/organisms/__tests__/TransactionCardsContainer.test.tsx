import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { TransactionCardsContainer } from '@homzhub/mobile/src/components/organisms/TransactionCardsContainer';
import { FinancialTransaction } from '@homzhub/common/src/mocks/FinancialTransactions';
import { FinancialTransactions } from '@homzhub/common/src/domain/models/FinancialTransactions';

let props: any;
let wrapper: ShallowWrapper;
const desierilizedTransactions = ObjectMapper.deserialize(FinancialTransactions, FinancialTransaction);

describe('TransactionCardsContainer', () => {
  const createTestProps = (testProps: any): object => ({
    transactionsData: desierilizedTransactions.results,
    getTransactions: jest.fn(),
    getLedgerMetrics: jest.fn(),
    ...testProps,
  });

  props = createTestProps({});

  it('should match snapshot', () => {
    wrapper = shallow(<TransactionCardsContainer {...props} t={(key: string): string => key} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
