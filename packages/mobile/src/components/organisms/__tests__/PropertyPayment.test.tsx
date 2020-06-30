import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { PropertyPayment } from '@homzhub/mobile/src/components/organisms/PropertyPayment';

const mock = jest.fn();

describe('Property Payment Component', () => {
  let component: ShallowWrapper;

  it('should render property payment component', () => {
    const props = {
      onPayNow: mock,
      isSuccess: true,
      navigateToPropertyHelper: mock,
    };
    component = shallow(<PropertyPayment {...props} />);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render button', () => {
    const props = {
      onPayNow: mock,
      isSuccess: false,
      navigateToPropertyHelper: mock,
    };
    component = shallow(<PropertyPayment {...props} />);
    expect(toJson(component)).toMatchSnapshot();
  });
});
