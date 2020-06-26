import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { MaintenanceDetails } from '@homzhub/mobile/src/components/molecules/MaintenanceDetails';

describe('MaintenanceDetails', () => {
  it('should match snapshot', () => {
    const formValues = {
      values: {
        name: 'test',
      },
      touched: {
        name: 'test',
      },
    };
    const props = {
      formProps: formValues,
      currency: 'INR',
      maintenanceAmountKey: 'maintenance_key',
      maintenanceScheduleKey: 'ANNUALLY',
    };
    // @ts-ignore
    const wrapper = mount(<MaintenanceDetails {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
