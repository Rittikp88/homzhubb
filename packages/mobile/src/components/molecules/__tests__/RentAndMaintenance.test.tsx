import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { RentAndMaintenance } from '@homzhub/mobile/src/components/molecules/RentAndMaintenance';

describe('Rent And Maintenance', () => {
  it('should match snapshot', () => {
    const wrapper = shallow(<RentAndMaintenance />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
