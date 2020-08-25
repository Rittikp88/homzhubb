import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { PropertyAddressCountry } from '@homzhub/mobile/src/components/molecules/PropertyAdressCountry';

describe('PropertyAddressCountry', () => {
  const props = {
    primaryAddress: '2 BHK',
    subAddress: 'Delhi',
  };
  it('should match snapshot', () => {
    const wrapper = shallow(<PropertyAddressCountry {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});