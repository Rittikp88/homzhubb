// @ts-nocheck
import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { initialUserState } from '@homzhub/common/src/modules/user/reducer';
import { initialPropertyState } from '@homzhub/common/src/modules/property/reducer';
import { PropertyActionTypes } from '@homzhub/common/src/modules/property/actions';
import { ServiceSteps } from '@homzhub/common/src/mocks/ServiceSteps';
import {
  ServiceCheckoutSteps,
  mapStateToProps,
  mapDispatchToProps,
} from '@homzhub/mobile/src/screens/Service/ServiceCheckoutSteps';
import { TypeOfSale } from '@homzhub/common/src/domain/models/Property';

const mock = jest.fn();

describe('Service List Steps Screen', () => {
  let component: ShallowWrapper;
  let props: any;
  let instance: any;

  beforeEach(() => {
    props = {
      steps: ServiceSteps.steps,
      propertyId: 1,
      termId: 1,
      serviceCategory: {
        id: 1,
        typeOfSale: TypeOfSale.FIND_TENANT,
      },
      navigation: {
        navigate: mock,
        goBack: mock,
      },
    };
    component = shallow(<ServiceCheckoutSteps {...props} t={(key: string): string => key} />);
    instance = component.instance();
  });

  it('should render snapshot', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render snapshot with state values', () => {
    component.setState({ currentStep: 1 });
    instance.onStepPress(1);
    instance.onProceedToNextStep();
    component.setState({ isPaymentSuccess: true });
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render snapshot for next steps', () => {
    component.setState({ currentStep: 5 });
    instance.onProceedToNextStep();
    instance.onSuccess();
    instance.navigateToPropertyHelper('test');
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render snapshot for markdown navigation', () => {
    instance.navigateToPropertyHelper('verification');
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render snapshot for LEASE_DETAILS title', () => {
    instance.getTitleStringsForStep('LEASE_DETAILS');
    instance.renderContent();
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render snapshot for LEASE_DETAILS title', () => {
    props = {
      steps: ServiceSteps.steps,
      serviceCategory: {
        id: 1,
        typeOfSale: TypeOfSale.SELL_PROPERTY,
      },
    };
    component = shallow(<ServiceCheckoutSteps {...props} t={(key: string): string => key} />);
    component.instance().getTitleStringsForStep('LEASE_DETAILS');
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render snapshot for PROPERTY_IMAGES title', () => {
    instance.getTitleStringsForStep('PROPERTY_IMAGES');
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render snapshot for PROPERTY_VERIFICATIONS title', () => {
    instance.getTitleStringsForStep('PROPERTY_VERIFICATIONS');
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render snapshot for PAYMENT_TOKEN_AMOUNT title', () => {
    instance.getTitleStringsForStep('PAYMENT_TOKEN_AMOUNT');
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should navigate back', () => {
    component.find('[testID="lblNavigate"]').prop('onIconPress')();
    expect(mock).toHaveBeenCalled();
  });

  it('should return service steps', () => {
    const mockedState = {
      user: {
        ...initialUserState,
      },
      property: {
        ...initialPropertyState,
        termId: 1,
      },
    };
    const state = mapStateToProps(mockedState);
    expect(state.termId).toBe(1);
  });

  it('should dispatch getServiceStepsDetails', () => {
    const dispatch = jest.fn();
    mapDispatchToProps(dispatch).setTermId(1);
    expect(dispatch.mock.calls[0][0]).toEqual({
      type: PropertyActionTypes.SET.TERM_ID,
      payload: 1,
    });
  });
});
