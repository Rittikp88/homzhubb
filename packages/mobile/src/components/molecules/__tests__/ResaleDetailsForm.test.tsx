import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { saleTerm } from '@homzhub/common/src/mocks/PropertyDetails';
import { ResaleDetailsForm } from '@homzhub/mobile/src/components/molecules/ResaleDetailsForm';

let props: any;
const mockFunction = jest.fn();

describe('ResaleDetailsForm', () => {
  const createTestProps = (testProps: any): object => ({
    initialValues: saleTerm,
    currency: '',
    onSubmit: mockFunction,
    ...testProps,
  });
  props = createTestProps({});

  const wrapper = shallow(<ResaleDetailsForm {...props} t={(key: string): string => key} />);

  it('should match snapshot', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
