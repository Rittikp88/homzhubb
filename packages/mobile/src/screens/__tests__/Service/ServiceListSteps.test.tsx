import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { initialUserState } from '@homzhub/common/src/modules/user/reducer';
import { initialPropertyState } from '@homzhub/common/src/modules/property/reducer';
import { PropertyActionTypes } from '@homzhub/common/src/modules/property/actions';
import { TypeOfSale } from '@homzhub/common/src/domain/models/Property';
import { ServiceSteps } from '@homzhub/common/src/mocks/ServiceSteps';
import {
  ServiceListSteps,
  mapStateToProps,
  mapDispatchToProps,
} from '@homzhub/mobile/src/screens/Service/ServiceListSteps';

const mock = jest.fn();

describe('Service List Steps Screen', () => {
  let component: ShallowWrapper;
  let props: any;

  beforeEach(() => {
    props = {
      serviceSteps: ServiceSteps,
      serviceCategory: { id: 1, typeOfSale: TypeOfSale.FIND_TENANT },
      getServiceStepsDetails: mock,
      navigation: {
        navigate: mock,
        goBack: mock,
      },
    };
    component = shallow(
      <ServiceListSteps
        {...props}
        t={(key: string): string => key}
        route={{ params: { name: 'Some Listing', id: 1 }, isExact: true, path: '', url: '' }}
      />
    );
  });

  it('should render snapshot', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should navigate on Continue', () => {
    // @ts-ignore
    component.find('[testID="btnContinue"]').prop('onPress')();
    expect(mock).toHaveBeenCalled();
  });

  it('should navigate back', () => {
    // @ts-ignore
    component.find('[testID="lblNavigate"]').prop('onPress')();
    expect(mock).toHaveBeenCalled();
  });

  it('should return service steps', () => {
    const mockedState = {
      user: {
        ...initialUserState,
      },
      property: {
        ...initialPropertyState,
        servicesSteps: ServiceSteps,
      },
    };
    const state = mapStateToProps(mockedState);
    expect(state.serviceSteps).toBe(ServiceSteps);
  });

  it('should dispatch getServiceStepsDetails', () => {
    const dispatch = jest.fn();
    mapDispatchToProps(dispatch).getServiceStepsDetails({ serviceCategoryId: 1, serviceId: 1 });
    expect(dispatch.mock.calls[0][0]).toEqual({
      type: PropertyActionTypes.GET.SERVICE_STEPS,
      payload: { serviceCategoryId: 1, serviceId: 1 },
    });
  });
});
