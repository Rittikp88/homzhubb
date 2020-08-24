import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { LeaseDetailsForm } from '@homzhub/mobile/src/components/molecules/LeaseDetailsForm';
import { leaseTermDetail } from '@homzhub/common/src/mocks/PropertyDetails';

let props: any;
const mockFunction = jest.fn();

describe('LeaseDetailsForm', () => {
  const createTestProps = (testProps: any): object => ({
    initialValues: leaseTermDetail,
    currency: '',
    onSubmit: mockFunction,
    ...testProps,
  });
  props = createTestProps({});

  const wrapper = shallow(<LeaseDetailsForm {...props} t={(key: string): string => key} />);

  it('should match snapshot', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
