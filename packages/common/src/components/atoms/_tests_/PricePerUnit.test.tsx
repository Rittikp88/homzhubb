import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { PricePerUnit } from '@homzhub/common/src/components/atoms/PricePerUnit';

describe('PricePerUnit', () => {
  let wrapper: ShallowWrapper;

  it('should match snapshot', () => {
    const props = {
      price: 1000,
      currency: 'INR',
    };
    wrapper = shallow(<PricePerUnit {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render with unit', () => {
    const props = {
      price: 1000,
      currency: 'INR',
      unit: 'mo',
    };
    wrapper = shallow(<PricePerUnit {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render with currency other than INR', () => {
    const props = {
      price: 1000,
      currency: 'USD',
      unit: 'mo',
    };
    wrapper = shallow(<PricePerUnit {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render with priceTransformation', () => {
    const props = {
      price: 1000,
      currency: 'USD',
      unit: 'mo',
      priceTransformation: true,
    };
    wrapper = shallow(<PricePerUnit {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render with priceTransformation false', () => {
    const props = {
      price: 1000,
      currency: 'USD',
      unit: 'mo',
      priceTransformation: false,
    };
    wrapper = shallow(<PricePerUnit {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
