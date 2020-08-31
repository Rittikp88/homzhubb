import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { RentAndMaintenance } from '@homzhub/mobile/src/components/molecules/RentAndMaintenance';
import { Transaction } from '@homzhub/common/src/domain/models/LeaseTransaction';

// @ts-ignore
const rentData: Transaction = {
  label: 'Rent',
  currencySymbol: '',
  amount: 2700,
  status: 'Paid',
  currencyCode: '',
};

// @ts-ignore
const depositData: Transaction = {
  label: 'Deposit',
  currencySymbol: '',
  amount: 5000,
  status: 'Due',
};

describe('Rent And Maintenance', () => {
  const props = {
    rentData,
    depositData,
  };
  it('should match snapshot', () => {
    const wrapper = shallow(<RentAndMaintenance {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
