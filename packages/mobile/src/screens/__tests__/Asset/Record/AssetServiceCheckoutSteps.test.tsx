import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import {
  AssetServiceCheckoutSteps,
  mapStateToProps,
  mapDispatchToProps,
} from '@homzhub/mobile/src/screens/Asset/Record/AssetServiceCheckoutSteps';
import { ServiceStepTypes } from '@homzhub/common/src/domain/models/Service';
import { initialUserState } from '@homzhub/common/src/modules/user/reducer';
import { initialPropertyState } from '@homzhub/common/src/modules/property/reducer';
import { PropertyActionTypes } from '@homzhub/common/src/modules/property/actions';
import { initialSearchState } from '@homzhub/common/src/modules/search/reducer';
import { initialAssetState } from '@homzhub/common/src/modules/asset/reducer';
import { initialPortfolioState } from '@homzhub/common/src/modules/portfolio/reducer';
import { initialRecordAssetState } from '@homzhub/common/src/modules/recordAsset/reducer';

const mock = jest.fn();
describe('Asset Service Checkout Steps', () => {
  let component: any;
  let props: any;

  beforeEach(() => {
    props = {
      steps: [
        ServiceStepTypes.LEASE_DETAILS,
        ServiceStepTypes.PROPERTY_VERIFICATIONS,
        ServiceStepTypes.PAYMENT_TOKEN_AMOUNT,
      ],
      propertyId: 1,
      termId: 1,
      setTermId: mock,
      navigation: {
        navigate: mock,
        goBack: mock,
      },
    };
    component = shallow(<AssetServiceCheckoutSteps {...props} t={(key: string): string => key} />);
  });

  it('should render snapshot', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render snapshot when typeOfSale is not tenant', () => {
    component = shallow(<AssetServiceCheckoutSteps {...props} t={(key: string): string => key} />);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should update the current step', () => {
    component.find('[testID="stepIndicator"]').prop('onPress')(1);
    expect(component.instance().state.currentStep).toBe(1);
    component.find('[testID="stepIndicator"]').prop('onPress')(2);
    expect(component.instance().state.currentStep).toBe(2);
    component.find('[testID="stepIndicator"]').prop('onPress')(3);
    expect(component.instance().state.currentStep).toBe(3);
    component = shallow(<AssetServiceCheckoutSteps {...props} t={(key: string): string => key} />);
    component.find('[testID="stepIndicator"]').prop('onPress')(2);
    expect(component.instance().state.currentStep).toBe(2);
  });

  it('should update loading state', () => {
    component.find('[testID="stepIndicator"]').prop('onPress')(1);
    component.find('[testID="verification"]').prop('setLoading')(true);
    expect(component.instance().state.isLoading).toBe(true);
  });

  it.skip('should update state on pay now', () => {
    component.find('[testID="stepIndicator"]').prop('onPress')(2);
    component.find('[testID="propertyPayment"]').prop('onPayNow')();
    expect(component.instance().state.isPaymentSuccess).toBe(true);
  });

  it.skip('should navigate to markdown', () => {
    component.find('[testID="stepIndicator"]').prop('onPress')(2);
    component.find('[testID="propertyPayment"]').prop('navigateToPropertyHelper')();
    component.find('[testID="propertyPayment"]').prop('navigateToPropertyHelper')('verification');
    expect(props.navigation.navigate).toBeCalled();
  });

  it('should navigate to previous screen', () => {
    component.find('[testID="lblNavigate"]').prop('onIconPress')();
    expect(props.navigation.goBack).toBeCalled();
  });

  it('should render snapshot without steps', () => {
    props = {
      ...props,
      steps: [],
    };
    component = shallow(<AssetServiceCheckoutSteps {...props} t={(key: string): string => key} />);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should handle mapStateToProps', () => {
    const mockedState = {
      user: {
        ...initialUserState,
      },
      property: {
        ...initialPropertyState,
        termId: 1,
      },
      search: {
        ...initialSearchState,
      },
      asset: {
        ...initialAssetState,
      },
      portfolio: {
        ...initialPortfolioState,
      },
      recordAsset: {
        ...initialRecordAssetState,
      },
    };
    const state = mapStateToProps(mockedState);
    expect(state.termId).toStrictEqual(1);
  });

  it('should handle mapDispatchToProps', () => {
    const dispatch = jest.fn();
    mapDispatchToProps(dispatch).setTermId(1);
    expect(dispatch.mock.calls[0][0]).toStrictEqual({
      type: PropertyActionTypes.SET.TERM_ID,
      payload: 1,
    });
  });
});
