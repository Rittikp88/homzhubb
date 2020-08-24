import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { CheckoutAssetDetails } from '@homzhub/mobile/src/components/organisms/CheckoutAssetDetails';
import { leaseTermDetail } from '@homzhub/common/src/mocks/PropertyDetails';

let props: any;
let wrapper: ShallowWrapper;

describe('CheckoutAssetDetails', () => {
  const createTestProps = (testProps: any): object => ({
    propertyId: 1,
    isLeaseFlow: true,
    setTermId: jest.fn(),
    onStepSuccess: jest.fn(),
    setLoading: jest.fn(),
    ...testProps,
  });

  props = createTestProps({});

  it('should match snapshot for lease flow', () => {
    wrapper = shallow(<CheckoutAssetDetails {...props} t={(key: string): string => key} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should call on submit lease form', () => {
    wrapper = shallow(<CheckoutAssetDetails {...props} t={(key: string): string => key} />);
    // @ts-ignore
    wrapper.find('[testID="leaseForm"]').prop('onSubmit')(leaseTermDetail);

    props = createTestProps({
      termId: 1,
    });
    wrapper = shallow(<CheckoutAssetDetails {...props} t={(key: string): string => key} />);
    // @ts-ignore
    wrapper.find('[testID="leaseForm"]').prop('onSubmit')(leaseTermDetail);

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot for resale flow', () => {
    props = createTestProps({
      isLeaseFlow: false,
    });
    wrapper = shallow(<CheckoutAssetDetails {...props} t={(key: string): string => key} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
