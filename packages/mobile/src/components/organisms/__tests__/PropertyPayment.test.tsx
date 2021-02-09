import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import PropertyPayment from '@homzhub/common/src/components/organisms/PropertyPayment';

const mock = jest.fn();

describe('Property Payment Component', () => {
  let component: ShallowWrapper;
  const props = {
    handleNextStep: mock,
    valueAddedServices: [],
    setValueAddedServices: mock,
    propertyId: 1,
  };

  it('should render property payment component', () => {
    component = shallow(<PropertyPayment {...props} />);
    expect(toJson(component)).toMatchSnapshot();
  });
});
